"use client";
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Orb } from "@/components/visuals/Orb";
import { useAIStore } from '@/core/store/ai-store';
import { useI18nStore } from '@/core/store/i18n-store';
import { useP2PStore } from '@/core/store/p2p-store';
import { useRagStore } from '@/core/store/rag-store';
import { HardwareScanner } from '@/components/ui/HardwareScanner';
import { Sidebar } from '@/components/chat/Sidebar';
import { VoiceInput } from '@/components/chat/VoiceInput';
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from '@/components/ui/MagneticButton';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { PurgeSystem } from '@/components/ui/PurgeSystem';
import { SkillSelector } from '@/components/chat/SkillSelector';
import { MeshChat } from '@/components/chat/MeshChat';
import { P2PDebug } from '@/components/debug/P2PDebug';
import { SettingsModal } from '@/components/ui/SettingsModal';
import { EterAccount, Chat, Message, MessageList, UserProfile } from '@/core/jazz/schema';
import { useCoState } from 'jazz-tools/react';
import { useJazz } from '@/components/providers/JazzProvider';
import { ID } from 'jazz-tools';
import dynamic from 'next/dynamic';

export default function ChatPageContent() {
  const { initializeAI, isInitialized, isLoading, loadProgress, sendMessage, messages, currentSessionId } = useAIStore();
  const { t, language, setLanguage } = useI18nStore();
  const { startNetwork, peerCount, isConnected } = useP2PStore();
  const { activeDocument, uploadDocument, clearDocument } = useRagStore();
  const [inputText, setInputText] = useState("");
  const [viewMode, setViewMode] = useState<'ai' | 'mesh'>('ai');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // --- JAZZ INTEGRATION ENABLED (DEFENSIVE) ---
  const me = useJazz();
  const isJazzChat = currentSessionId?.startsWith('co_');

  const jazzChat = useCoState(Chat, isJazzChat ? (currentSessionId as ID<Chat>) : undefined);

  // Safe mapping of Jazz messages
  const jazzMessagesUI = (jazzChat && (jazzChat as any).messages && (jazzChat as any).messages.map)
    ? (jazzChat as any).messages.map((msg: Message | null) => {
      if (!msg) return null;
      return {
        role: (msg as any).sender?.id === (me as any)?.id ? 'user' : 'assistant',
        content: (msg as any).text || "",
        timestamp: (msg as any).timestamp
      };
    }).filter((m: any) => m !== null)
    : [];

  const displayMessages = isJazzChat ? jazzMessagesUI : messages;
  // ------------------------

  const handleHardwareComplete = useCallback((specs: any) => {
    useAIStore.getState().setHardwareSpecs(specs);
  }, []);

  // Initialize AI and P2P on mount
  useEffect(() => {
    // initializeAI(); // Removed to allow Hardware Scanner to run first
    startNetwork(); // Start P2P Mesh
  }, [startNetwork]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayMessages]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    if (isJazzChat) {
      if (jazzChat && me) {
        const newMsg = Message.create({
          text: inputText,
          sender: (me as any).profile, // Link to profile
          timestamp: Date.now()
        }, { owner: me as EterAccount });

        // Safe push
        if ((jazzChat as any).messages?.push) {
          (jazzChat as any).messages.push(newMsg);
        }
      }
    } else {
      sendMessage(inputText);
    }
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-eter-dark relative overflow-hidden select-none font-sans">

      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-eter-dark via-[#070710] to-[#0a0a1a] z-0" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 z-0"
        style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />
      <div className="opacity-20"><ParticleBackground /></div>

      {/* Header */}
      <div className="absolute top-8 z-20 text-center w-full flex flex-col items-center pointer-events-none">
        <h1 className="text-4xl md:text-6xl font-light tracking-[0.5em] text-white/90 animate-pulse drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
          {t.title}
        </h1>
        <div className="text-[10px] text-eter-cyan/60 tracking-widest mt-2 uppercase">
          {t.subtitle}
        </div>
      </div>

      {/* P2P Network Status & Hardware HUD */}
      <div className="absolute top-20 left-4 md:top-24 md:left-24 z-30 flex flex-col gap-4 transition-all duration-500 max-w-[150px] md:max-w-none">
        {/* P2P Status */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/5">
          <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] text-white/80 font-mono">
            {isConnected ? `${peerCount} NODOS` : 'BUSCANDO RED...'}
          </span>
        </div>

        {/* Persistent Hardware Scanner */}
        <HardwareScanner onComplete={handleHardwareComplete} />
      </div>

      {/* Mesh Chat Toggle & Settings */}
      <div className="absolute top-4 right-4 z-40 flex gap-2">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-white/10 transition-all"
          title="Configuración"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
        </button>
        <button
          onClick={() => setViewMode('ai')}
          className={clsx(
            "px-4 py-2 rounded-full text-xs font-bold tracking-widest transition-all",
            viewMode === 'ai' ? "bg-white/10 text-white shadow-lg" : "text-white/40 hover:text-white"
          )}
        >
          AI MODE
        </button>
        <button
          onClick={() => setViewMode('mesh')}
          className={clsx(
            "px-4 py-2 rounded-full text-xs font-bold tracking-widest transition-all",
            viewMode === 'mesh' ? "bg-eter-green/20 text-eter-green border border-eter-green/30 shadow-[0_0_15px_rgba(0,255,0,0.2)]" : "text-white/40 hover:text-eter-green"
          )}
        >
          MESH P2P
        </button>
      </div>

      {/* Main Content Area */}
      <div className="z-10 w-full max-w-2xl flex flex-col items-center justify-center relative min-h-[500px]">

        {viewMode === 'mesh' ? (
          <div className="w-full h-[600px] bg-black/40 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
            <MeshChat />
          </div>
        ) : (
          <>
            {/* The Orb */}
            <div className={clsx(
              "transition-all duration-1000",
              messages.length > 0 ? "scale-50 -translate-y-32 opacity-50" : "scale-100"
            )}>
              <div className="w-64 h-64 md:w-96 md:h-96">
                <Orb />
              </div>
            </div>

            {/* Loading State or Chat Interface */}
            <div className="absolute bottom-0 w-full px-6 pb-12 flex flex-col items-center">
              {/* ... Loading ... */}
              {isLoading && (
                <div className="w-80 flex flex-col items-center gap-2 mb-8">
                  <div className="text-xs text-eter-cyan/80 font-mono tracking-wider animate-pulse text-center break-words max-w-full">
                    {useAIStore.getState().loadText || t.loadingCore}
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-eter-cyan shadow-[0_0_10px_#00F0FF]"
                      initial={{ width: 0 }}
                      animate={{ width: `${loadProgress * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between w-full text-[10px] text-white/30 font-mono">
                    <span>Core: Loaded</span>
                    <span>{(loadProgress * 100).toFixed(0)}%</span>
                  </div>
                </div>
              )}

              {/* Chat Messages Area */}
              <AnimatePresence>
                {(isInitialized || isJazzChat) && displayMessages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full h-[300px] overflow-y-auto mb-6 px-4 py-2 space-y-4 scrollbar-hide glass-panel rounded-xl"
                  >
                    {displayMessages.map((msg: any, idx: number) => {
                      const isTool = msg.content.startsWith('🔍 Investigando:');
                      return (
                        <div key={idx} className={clsx(
                          "flex w-full mb-2",
                          msg.role === 'user' ? "justify-end" : "justify-start"
                        )}>
                          <div className={clsx(
                            "max-w-[80%] rounded-lg px-4 py-2 text-sm backdrop-blur-sm border",
                            isTool
                              ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-200 font-mono text-xs tracking-wider animate-pulse shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                              : msg.role === 'user'
                                ? "bg-eter-cyan/10 border-eter-cyan/30 text-eter-cyan text-right shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                                : "bg-eter-purple/10 border-eter-purple/30 text-white text-left shadow-[0_0_10px_rgba(189,0,255,0.1)]"
                          )}>
                            {msg.content}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Input */}
              {isInitialized ? (
                <div className="relative w-full">
                  {activeDocument && (
                    <div className="absolute -top-10 left-0 right-0 mx-4 bg-eter-cyan/10 border border-eter-cyan/30 rounded-t-lg px-4 py-2 flex justify-between items-center backdrop-blur-md">
                      <div className="flex items-center gap-2 text-xs text-eter-cyan">
                        <span>📄</span>
                        <span className="truncate max-w-[200px] font-mono">{activeDocument.name}</span>
                        <span className="opacity-50">({(activeDocument.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <button onClick={clearDocument} className="text-white/50 hover:text-white transition-colors">✕</button>
                    </div>
                  )}

                  <div className="w-full max-w-md relative flex items-center gap-2">
                    <SkillSelector />

                    <label className="cursor-pointer p-3 text-white/40 hover:text-eter-cyan transition-colors">
                      <input
                        type="file"
                        accept=".txt,.md,.json,.js,.ts"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) uploadDocument(file);
                        }}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                    </label>

                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder={activeDocument ? `Pregunta sobre ${activeDocument.name}...` : t.inputPlaceholder}
                      className={clsx(
                        "w-full bg-black/40 border border-white/10 rounded-r-full py-3 pl-4 pr-24 text-white text-sm focus:outline-none focus:border-eter-cyan/60 focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all placeholder:text-white/20 backdrop-blur-md",
                        activeDocument ? "rounded-tl-none border-t-eter-cyan/30" : "rounded-l-none"
                      )}
                    />

                    <div className="absolute right-2 flex items-center gap-1">
                      <VoiceInput onInput={(text) => setInputText(text)} />

                      <MagneticButton
                        onClick={handleSend}
                        className="p-2 rounded-full text-eter-cyan/50 hover:text-eter-cyan hover:text-white transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      </MagneticButton>
                    </div>
                  </div>
                </div>
              ) : useAIStore.getState().initError ? (
                <div className="flex flex-col items-center gap-6 p-6 bg-red-950/20 border border-red-500/30 rounded-2xl backdrop-blur-xl animate-in fade-in zoom-in duration-500 max-w-sm text-center">
                  <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                    <span className="text-3xl animate-pulse">⚠️</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-red-400 font-bold tracking-tighter uppercase">Fallo de Enlace Neural</h3>
                    <p className="text-[10px] font-mono text-red-200/60 leading-relaxed uppercase">
                      {useAIStore.getState().initError}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                    <MagneticButton
                      onClick={() => initializeAI()}
                      className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[10px] font-bold tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.2)]"
                    >
                      REINTENTAR (FORZADO)
                    </MagneticButton>
                    <MagneticButton
                      onClick={() => {
                        const specs = useAIStore.getState().hardwareSpecs;
                        useAIStore.getState().setHardwareSpecs({ ...specs, isForced: false });

                        useAIStore.setState({ isLoading: true, loadText: "Inicializando CPU Neural (WASM)...", initError: null });
                        import('@/core/ai/ai-service').then(({ aiService }) => {
                          aiService.switchToCpu((p) => {
                            useAIStore.setState({ loadProgress: p.progress, loadText: p.text });
                          }).then(() => {
                            useAIStore.setState({ isInitialized: true, isLoading: false, loadText: "CPU Ready" });
                          }).catch(e => {
                            useAIStore.setState({ isLoading: false, initError: "Fallo CPU: " + e.message });
                          });
                        });
                      }}
                      className="w-full py-3 rounded-xl bg-orange-600/20 border border-orange-500/50 hover:bg-orange-600/40 text-orange-200 text-[10px] font-bold tracking-widest transition-all"
                    >
                      USAR MODO CPU (LENTO PERO SEGURO)
                    </MagneticButton>
                    <MagneticButton
                      onClick={() => {
                        const specs = useAIStore.getState().hardwareSpecs;
                        useAIStore.getState().setHardwareSpecs({ ...specs, isForced: false });
                        initializeAI();
                      }}
                      className="w-full py-3 rounded-xl border border-white/10 bg-white/5 text-white/40 text-[10px] tracking-widest hover:bg-white/10 hover:text-white transition-all"
                    >
                      VOLVER A SIMULADOR (MODO SEGURO)
                    </MagneticButton>
                  </div>
                </div>
              ) : !isLoading && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-[10px] font-mono text-eter-cyan/60 tracking-widest uppercase">
                      SYSTEM READY {/* Status text always visible */}
                    </div>
                    <MagneticButton onClick={() => initializeAI()} className="px-10 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/50 text-xs tracking-widest hover:bg-white/10 hover:text-white transition-all duration-500 hover:border-eter-cyan/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] group">
                      <span className="group-hover:text-eter-cyan transition-colors">{t.startButton}</span>
                    </MagneticButton>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

      </div>

      <PurgeSystem />

      {/* Footer */}
      <div className="absolute bottom-4 text-[10px] text-white/10 font-mono">
        {t.footerText}
      </div>

      {/* EMERGENCY DEBUGGER */}
      <P2PDebug />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </main>
  );
}
