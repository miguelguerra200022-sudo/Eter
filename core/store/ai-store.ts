import { create } from 'zustand';
import { aiService } from '../ai/ai-service';
import { persistence } from '../db/persistence';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface Session {
    id: string;
    title: string;
    messages: Message[];
    timestamp: number;
}

interface AIState {
    // Current State
    currentSessionId: string | null;
    sessions: Session[];
    messages: Message[]; // Legacy getter (pointers to current session)

    // UI State
    isInitialized: boolean;
    isLoading: boolean;
    loadProgress: number;
    loadText: string;
    initError: string | null;
    hardwareSpecs: any | null;

    // Skills State
    activeSkills: string[];
    toggleSkill: (skillId: string) => void;

    // Configuration
    tavilyKey: string | null;
    setTavilyKey: (key: string) => void;

    // Actions
    initializeAI: (onProgress?: (p: any) => void, modelId?: string) => Promise<void>;
    sendMessage: (text: string) => Promise<void>;
    injectMessage: (sessionId: string, message: Message) => void;
    setHardwareSpecs: (specs: any) => void;

    // Command Handlers
    handleCommand: (command: string, args: string[]) => Promise<string | null>;

    // Session Management
    createSession: () => void;
    switchSession: (id: string) => void;
    deleteSession: (id: string) => void;
    renameSession: (id: string, newTitle: string) => void;
    importSession: (session: any) => void;
}

// ... imports
import { persist, createJSONStorage } from 'zustand/middleware';

// ... interfaces

export const useAIStore = create<AIState>()(
    persist(
        (set, get) => ({
            // ... all existing state and actions ...
            currentSessionId: null,
            sessions: [],
            messages: [],
            isInitialized: false,
            isLoading: false,
            loadProgress: 0,
            loadText: "Iniciando...",
            initError: null,
            hardwareSpecs: null,
            tavilyKey: null,

            setHardwareSpecs: (specs: any) => set({ hardwareSpecs: specs }),
            setTavilyKey: (key: string) => set({ tavilyKey: key }),

            // --- SKILLS ACTIONS ---
            activeSkills: ['research-expert', 'crypto-master'], // Default enabled
            toggleSkill: (skillId: string) => set(state => {
                const newSkills = state.activeSkills.includes(skillId)
                    ? state.activeSkills.filter(id => id !== skillId)
                    : [...state.activeSkills, skillId];
                return { activeSkills: newSkills };
            }),

            // --- SESSION ACTIONS ---
            createSession: () => {
                const newSession: Session = {
                    id: crypto.randomUUID(),
                    title: 'Nueva Conversación',
                    messages: [],
                    timestamp: Date.now()
                };
                const state = get();
                const updatedSessions = [newSession, ...state.sessions];
                set({
                    sessions: updatedSessions,
                    currentSessionId: newSession.id,
                    messages: []
                });

                // Subscribe to P2P Updates
                import('./p2p-store').then(({ useP2PStore }) => {
                    useP2PStore.getState().listenToSession(newSession.id, (msg) => get().injectMessage(newSession.id, msg));
                });
            },

            switchSession: (id: string) => {
                const state = get();
                const session = state.sessions.find(s => s.id === id);
                if (session) {
                    set({
                        currentSessionId: id,
                        messages: session.messages
                    });

                    // Subscribe to P2P Updates
                    import('./p2p-store').then(({ useP2PStore }) => {
                        useP2PStore.getState().listenToSession(id, (msg) => get().injectMessage(id, msg));
                    });
                }
            },

            renameSession: (id: string, newTitle: string) => {
                set(state => ({
                    sessions: state.sessions.map(s => s.id === id ? { ...s, title: newTitle } : s)
                }));
            },

            deleteSession: (id: string) => {
                set(state => {
                    const newSessions = state.sessions.filter(s => s.id !== id);
                    let newCurrentId = state.currentSessionId;
                    let newMessages = state.messages;

                    if (state.currentSessionId === id) {
                        if (newSessions.length > 0) {
                            newCurrentId = newSessions[0].id;
                            newMessages = newSessions[0].messages;
                        } else {
                            newCurrentId = null;
                            newMessages = [];
                        }
                    }
                    return {
                        sessions: newSessions,
                        currentSessionId: newCurrentId,
                        messages: newMessages
                    };
                });
            },

            importSession: (sessionData: Session) => {
                const state = get();
                const newSession = {
                    ...sessionData,
                    id: crypto.randomUUID(),
                    title: `(Importado) ${sessionData.title}`,
                    timestamp: Date.now()
                };

                set({
                    sessions: [newSession, ...state.sessions],
                    currentSessionId: newSession.id,
                    messages: newSession.messages
                });
            },

            // --- COMMAND HANDLER ---
            handleCommand: async (command: string, args: string[]) => {
                console.log(`🕹️ Command detected: ${command}`, args);

                switch (command) {
                    case '/config':
                        if (args[0] === 'tavily') {
                            const key = args[1];
                            if (!key) return "Uso: /config tavily <API_KEY>";
                            set({ tavilyKey: key });
                            return "✅ API Key de Tavily actualizada corrextamente.";
                        }
                        return "Configuración desconocida. Uso: /config tavily <key>";

                    case '/search':
                        const query = args.join(" ");
                        set({ loadText: `Investigando: "${query}"...`, isLoading: true });
                        try {
                            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                            const data = await res.json();
                            set({ isLoading: false });
                            return `[RESULTADOS DE BÚSQUEDA]\n${data.results.map((r: any) => `- ${r.title}: ${r.snippet} (${r.link})`).join('\n')}`;
                        } catch (e) {
                            set({ isLoading: false });
                            return "Error en la búsqueda web.";
                        }

                    case '/encrypt':
                        if (args.length < 2) return "Uso: /encrypt <texto> <password>";
                        const { encryptText } = await import('../utils/crypto-utils');
                        const pass = args.pop()!;
                        const textToEnc = args.join(" ");
                        const encrypted = await encryptText(textToEnc, pass);
                        return `🔒 TEXTO CIFRADO:\n${encrypted}\n\n(Guarda este hash y usa /decrypt con la misma contraseña para recuperarlo).`;

                    case '/decrypt':
                        if (args.length < 2) return "Uso: /decrypt <hash> <password>";
                        const { decryptText } = await import('../utils/crypto-utils');
                        const dPass = args.pop()!;
                        const hash = args.join("");
                        try {
                            const decrypted = await decryptText(hash, dPass);
                            return `🔓 TEXTO RECUPERADO:\n${decrypted}`;
                        } catch (e: any) {
                            return `❌ ERROR: ${e.message}`;
                        }

                    case '/skills':
                        const { skillLoader } = await import('../ai/skill-loader');
                        const skills = skillLoader.getLoadedSkills();
                        return `🧩 HABILIDADES INSTALADAS:\n${skills.map(s => `- ${s.name} (${s.category})`).join('\n')}`;

                    default:
                        return "Comando no reconocido.";
                }
            },

            // --- CORE AI ACTIONS ---
            initializeAI: async (onProgress, modelId) => {
                const { isInitialized, isLoading } = get();
                if (isInitialized || isLoading) return;

                set({ isLoading: true, loadText: "Conectando al Núcleo Neural..." });

                if (get().sessions.length === 0) {
                    get().createSession();
                }

                try {
                    set({ initError: null, isLoading: true }); // Clear previous error
                    const { hardwareSpecs } = get();
                    const modelToLoad = modelId || hardwareSpecs?.recommendedModel || "Llama-3-8B-Instruct-q4f32_1-MLC";
                    const forceNative = !!hardwareSpecs?.isForced;

                    await aiService.initialize((progress) => {
                        set({ loadProgress: progress.progress, loadText: progress.text });
                        if (onProgress) onProgress(progress);
                    }, modelToLoad, forceNative);

                    // --- LOAD SKILLS ---
                    try {
                        const { skillLoader } = await import('../ai/skill-loader');
                        await skillLoader.loadSkill('/skills/research-expert.md', 'research-expert');
                        await skillLoader.loadSkill('/skills/crypto-master.md', 'crypto-master');
                    } catch (e) {
                        console.warn("Skill Loading failed, core is unaffected.");
                    }

                    set({ isInitialized: true, isLoading: false, loadText: "Sincronización Completa" });
                } catch (error: any) {
                    console.error("AI Init Error:", error);
                    let userMessage = error.message || "Error de Conexión Neural";
                    if (error.toString().includes("WebGPU is not supported") || error.toString().includes("Unable to find a compatible GPU")) {
                        userMessage = "ERROR: El navegador no detecta tu GPU. Verifica los flags de Chrome.";
                    }
                    set({ isLoading: false, loadText: "Fallo de Sistema", initError: userMessage });
                }
            },

            sendMessage: async (text: string) => {
                if (!text.trim()) return;

                // 1. Session Logic
                let { currentSessionId } = get();
                if (!currentSessionId) {
                    get().createSession();
                    currentSessionId = get().currentSessionId;
                }

                const updateSessionMessages = (newMsgs: Message[]) => {
                    set(state => ({
                        sessions: state.sessions.map(s =>
                            s.id === currentSessionId ? { ...s, messages: newMsgs } : s
                        ),
                        messages: newMsgs
                    }));
                };

                const currentMsgs = get().messages;
                const userMsg: Message = { role: 'user', content: text };
                const newMsgsUser = [...currentMsgs, userMsg];
                updateSessionMessages(newMsgsUser);

                // --- COMMAND PROCESSING ---
                if (text.startsWith("/")) {
                    const [cmd, ...args] = text.split(" ");
                    const commandResult = await get().handleCommand(cmd, args);
                    if (commandResult) {
                        const aiMsg: Message = { role: 'assistant', content: commandResult };
                        updateSessionMessages([...newMsgsUser, aiMsg]);
                        return;
                    }
                }

                // --- RESEARCH DETECTION (Legacy Regex Removed) ---
                // Now handled by Agentic Loop in aiService output detection
                let searchContext = "";

                // 2. Memory Context (Long Term)
                let memoryContext = "";
                try {
                    const { initMemory, searchMemory, addToMemory } = await import('./memory-store').then(m => m.useMemoryStore.getState());
                    await initMemory();
                    await addToMemory(text, 'chat');

                    const memories = await searchMemory(text, 3);
                    if (memories.length > 0) {
                        memoryContext = memories.map(m => `[RECUERDO: ${m.content}]`).join('\n');
                    }
                } catch (e) { }

                // 3. Skills Context
                let skillContext = "";
                try {
                    const { skillLoader } = await import('../ai/skill-loader');
                    // Use dynamic active skills from state
                    skillContext = skillLoader.getSystemPrompt(get().activeSkills);
                } catch (e) { }

                // 4. Final Context Assembly
                const { activeDocument } = await import('../store/rag-store').then(m => m.useRagStore.getState());
                let finalSystemContext = skillContext;
                if (memoryContext) finalSystemContext += `\nRECUERDOS RELEVANTES:\n${memoryContext}\n`;
                if (searchContext) finalSystemContext += `\n${searchContext}\n`;
                if (activeDocument) finalSystemContext += `\n[CONTEXTO DOCUMENTO: ${activeDocument.name}]\n${activeDocument.content}\n`;

                try {
                    // 1. First Generation (Agent Decision)
                    let response = await aiService.generate(text, finalSystemContext);
                    let toolUsed = false;

                    // 2. Tool Detection: [SEARCH: query]
                    if (response.trim().startsWith('[SEARCH:')) {
                        const queryMatch = response.match(/\[SEARCH:(.*?)\]/);
                        const query = queryMatch ? queryMatch[1].trim() : null;

                        if (query) {
                            toolUsed = true;
                            // Notify UI of tool use
                            set({ loadText: `Investigando: "${query}"...`, isLoading: true });

                            // Log the tool use as an assistant message (Optional: could be hidden)
                            const toolMsg: Message = { role: 'assistant', content: `🔍 Investigando: ${query}...` };
                            updateSessionMessages([...newMsgsUser, toolMsg]);

                            try {
                                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                                const data = await res.json();
                                let searchResultsText = "";

                                if (data.results && data.results.length > 0) {
                                    searchResultsText = `[RESULTADOS DE INTERNET PARA: "${query}"]\n${data.results.map((r: any) => `- ${r.title}: ${r.snippet} (${r.link})`).join('\n')}`;
                                    if (data.answer) searchResultsText += `\n[RESUMEN IA]: ${data.answer}`;
                                } else {
                                    searchResultsText = `[RESULTADOS DE INTERNET]: No se encontró información relevante para "${query}".`;
                                }

                                // Update context with results
                                finalSystemContext += `\n\n${searchResultsText}\n\nINSTRUCCIÓN: Usa los resultados anteriores para responder a la pregunta original del usuario. Cita las fuentes relevantes.`;

                                // Re-generate with new context
                                set({ loadText: "Analizando datos..." });
                                response = await aiService.generate(text, finalSystemContext);

                            } catch (e) {
                                console.error("Search execution failed", e);
                                finalSystemContext += `\n[ERROR]: La búsqueda falló. Responde con tu conocimiento base.`;
                                response = await aiService.generate(text, finalSystemContext);
                            }
                            set({ isLoading: false });
                        }
                    }

                    const aiMsg: Message = { role: 'assistant', content: response };

                    // Update messages (If tool was used, appendix the final answer)
                    // We need to fetch current messages again because toolMsg might be there
                    const currentSessionMsgs = get().sessions.find(s => s.id === currentSessionId)?.messages || [];
                    updateSessionMessages([...currentSessionMsgs, aiMsg]);

                    // P2P SYNC & Memory Save
                    import('./p2p-store').then(({ useP2PStore }) => {
                        useP2PStore.getState().publishMessage(currentSessionId!, { ...userMsg, timestamp: Date.now() });
                        useP2PStore.getState().publishMessage(currentSessionId!, { ...aiMsg, timestamp: Date.now() });
                    });

                    const { addToMemory } = await import('./memory-store').then(m => m.useMemoryStore.getState());
                    await addToMemory(response, 'chat');
                } catch (e) {
                    console.error(e);
                }
            },

            // Action to receive messages from P2P (Sync)
            injectMessage: (sessionId: string, message: Message) => {
                const { sessions, currentSessionId } = get();
                const targetSession = sessions.find(s => s.id === sessionId);

                if (targetSession) {
                    // Avoid duplicates
                    const exists = targetSession.messages.some(m => m.content === message.content && m.role === message.role);
                    if (exists) return;

                    const newMessages = [...targetSession.messages, message];

                    set(state => ({
                        sessions: state.sessions.map(s =>
                            s.id === sessionId ? { ...s, messages: newMessages } : s
                        ),
                        // Update current view if it's the active session
                        messages: state.currentSessionId === sessionId ? newMessages : state.messages
                    }));
                }
            }
        }),
        {
            name: 'eter-ai-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                sessions: state.sessions,
                currentSessionId: state.currentSessionId,
                hardwareSpecs: state.hardwareSpecs,
                tavilyKey: state.tavilyKey,
                activeSkills: state.activeSkills // Persist skills too
            }),
            onRehydrateStorage: () => (state) => {
                // Restore messages from current session upon hydration
                if (state && state.currentSessionId && state.sessions.length > 0) {
                    const session = state.sessions.find((s: any) => s.id === state.currentSessionId);
                    if (session) {
                        state.messages = session.messages;
                    }
                }
            }
        }
    )
);
