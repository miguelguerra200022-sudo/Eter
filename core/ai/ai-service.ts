import { CreateWebWorkerMLCEngine, MLCEngine, InitProgressCallback } from "@mlc-ai/web-llm";
import { CpuEngine } from "./cpu-engine";

// Configuration for Llama-3-8B-Instruct (Quantized)
const SELECTED_MODEL = "Llama-3-8B-Instruct-q4f32_1-MLC";

// Mock Engine for environments without WebGPU
class MockMLCEngine {
    chat = {
        completions: {
            create: async (params: any) => {
                console.log("[MockEngine] Generating response for:", params.messages);
                const fullPrompt = params.messages[params.messages.length - 1].content;

                // Extract only the User Question if context is present
                const userQuestion = fullPrompt.includes("PREGUNTA USUARIO:")
                    ? fullPrompt.split("PREGUNTA USUARIO:")[1].trim()
                    : fullPrompt;

                // Simulate processing delay (thinking time)
                await new Promise(resolve => setTimeout(resolve, 1500));

                let responseText = `[MODO SIMULACIÓN] Entendido: "${userQuestion}".\n\n(RAG: He consultado tus recuerdos y documentos activos para generar esta respuesta simulada).`;

                if (userQuestion.toLowerCase().includes("hola") || userQuestion.toLowerCase().includes("soy")) {
                    responseText = "¡Saludos, Iniciado! He accedido a mi memoria y sé quién eres. La conexión neuronal simulada es estable. ¿En qué puedo ayudarte mientras conseguimos una GPU real?";
                }

                if (userQuestion.toLowerCase().includes("recuerdas")) {
                    responseText = "Sí, consultando mis registros internos (IndexedDB), puedo ver nuestra conversación anterior. Tu identidad es consistente.";
                }

                return {
                    choices: [{
                        message: {
                            content: responseText
                        }
                    }]
                };
            }
        }
    };
}

export class AIService {
    private engine: any | null = null;
    private cpuEngine: CpuEngine | null = null;
    private worker: Worker | null = null;
    private useCpu: boolean = false;

    async initialize(onProgress: InitProgressCallback, modelId: string = SELECTED_MODEL, forceNative: boolean = false) {
        if (this.engine) return;

        console.log(`🚀 Initializing AI Engine with Model: ${modelId} (Force Native: ${forceNative})`);

        // Verify Environment Capabilities
        if (typeof window === "undefined") return; // Server-side guard

        // POLYFILL: Cache API (In-Memory Mock for environments without persistence)
        if (!("caches" in window)) {
            console.warn("⚠️ Cache API missing. Using In-Memory Polyfill. Model will not persist.");
            const memoryCache = new Map<string, any>();

            // @ts-ignore
            window.caches = {
                open: async (cacheName: string) => ({
                    put: async (request: any, response: any) => {
                        const url = request.url || request;
                        memoryCache.set(`${cacheName}:${url}`, await response.clone().blob());
                    },
                    match: async (request: any) => {
                        const url = request.url || request;
                        const blob = memoryCache.get(`${cacheName}:${url}`);
                        return blob ? new Response(blob) : undefined;
                    },
                    delete: async (request: any) => {
                        const url = request.url || request;
                        return memoryCache.delete(`${cacheName}:${url}`);
                    },
                    keys: async () => [],
                    add: async (request: any) => {
                        const url = request.url || request;
                        const response = await fetch(url);
                        if (!response.ok) throw new TypeError('Bad response status');
                        memoryCache.set(`${cacheName}:${url}`, await response.clone().blob());
                    },
                    addAll: async (requests: any[]) => {
                        await Promise.all(requests.map(async (request: any) => {
                            const url = request.url || request;
                            const response = await fetch(url);
                            if (!response.ok) throw new TypeError('Bad response status');
                            memoryCache.set(`${cacheName}:${url}`, await response.clone().blob());
                        }));
                    }
                }),
                has: async () => false,
                delete: async () => true,
                keys: async () => [],
                match: async () => undefined
            };
        }

        try {
            // Polyfill for crypto.randomUUID if missing (critical for WebLLM)
            if (!("randomUUID" in crypto)) {
                // @ts-ignore
                crypto.randomUUID = function error(): string {
                    return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
                        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
                    );
                };
            }

            // Create a new worker
            // Note: In Next.js/Webpack, we need to ensure this worker path resolves correctly.
            // Usually placing worker.ts in public or using a specific loader is needed, 
            // but for App Router we'll use the precise import.
            this.worker = new Worker(new URL("./worker.ts", import.meta.url), {
                type: "module",
            });

            const onConnect = (progress: any) => {
                console.log("Loading progress:", progress);
                if (onProgress) onProgress(progress);
            };

            this.engine = await CreateWebWorkerMLCEngine(
                this.worker,
                modelId,
                { initProgressCallback: onConnect } // Using wrapper logging
            );
        } catch (error: any) {
            console.warn("WebWebLLM Init Failed (likely WebGPU missing). Fallback logic triggered.", error);

            // CRITICAL: IF FORCED, DO NOT MOCK. DIE WITH HONOR.
            if (forceNative) {
                console.error("Force Native Enabled: Skipping Mock Engine fallback. Throwing real error.");
                throw error;
            }

            const errorMessage = error instanceof Error ? error.message : String(error);

            // Fallback to Mock Engine
            if (onProgress) {
                // Determine if it is a shader error or OOM
                const friendlyError = errorMessage.includes("shader-f16")
                    ? "Tu GPU no soporta Float16. Intentando modo seguro..."
                    : `Error Crítico: ${errorMessage.slice(0, 50)}...`;

                onProgress({ text: `${friendlyError} (Simulación Activa)`, progress: 0.5, timeElapsed: 0 });
                // Simulate initial load delay
                await new Promise(resolve => setTimeout(resolve, 3000)); // Longer wait to let user read error
                onProgress({ text: "Núcleo Simulado Activo", progress: 1.0, timeElapsed: 1000 });
            }
            this.engine = new MockMLCEngine();
        }
    }

    async switchToCpu(onProgress?: (p: any) => void) {
        console.log("🔄 Switching to CPU Engine...");
        this.useCpu = true;
        this.cpuEngine = new CpuEngine();
        await this.cpuEngine.initialize(onProgress);
    }

    async generate(prompt: string, context: string = "") {
        if (this.useCpu) {
            if (!this.cpuEngine) throw new Error("CPU Engine not initialized");
            const messages = [
                { role: "system", content: "You are ETER. Concise and helpful." + (context ? `\n\nContext:\n${context}` : "") },
                { role: "user", content: prompt }
            ];
            return await this.cpuEngine.generate(prompt, messages);
        }

        if (!this.engine) throw new Error("AI Engine not initialized");

        const systemMessage = "You are ETER, a highly advanced AI entity connected to a decentralized neural network. You are mysterious, concise, and helpful. You adapt to the language of the user seamlessly. NEVER echo the internal context tags like [RECUERDO]. Handle context as deep knowledge, not as part of the conversation flow."
            + (context ? `\n\nINTERNAL CONTEXT (DO NOT DISCLOSE):\n${context}` : "");

        const messages = [
            { role: "system", content: systemMessage },
            { role: "user", content: prompt }
        ];

        const reply = await this.engine.chat.completions.create({
            messages: messages as any,
            temperature: 0.7,
            max_tokens: 256,
        });

        return reply.choices[0].message.content || "";
    }

    // Streaming support could be added here
}

export const aiService = new AIService();
