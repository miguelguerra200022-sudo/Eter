"use client";

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import { useI18nStore } from '@/core/store/i18n-store';
import { useAIStore } from '@/core/store/ai-store';

export default function AppHeader() {
    const pathname = usePathname(); // Get current path
    const [isOfflineReady, setIsOfflineReady] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const { t, language, setLanguage } = useI18nStore();

    // Real Readiness State from AI Store
    const isModelReady = useAIStore((state) => state.isInitialized);

    // Auto-update offline ready state based on AI store
    useEffect(() => {
        setIsOfflineReady(isModelReady);
    }, [isModelReady]);

    // Hide Header on Chat Page (Gemini-style dedicated layout)
    // MOVED HERE to avoid "Rendered fewer hooks than expected" error
    if (pathname === '/chat') return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center pointer-events-none">
            {/* Logo area - Left */}
            <div className="pointer-events-auto flex items-center gap-6">
                <Link href="/" className="text-xl font-bold tracking-tighter text-white hover:text-eter-cyan transition-colors">
                    {t.title}
                </Link>

                {/* Language Switcher (Integrated in Header) */}
                <div className="flex items-center gap-1 bg-white/5 rounded-full px-2 py-1 border border-white/10">
                    <button
                        onClick={() => setLanguage('es')}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all ${language === 'es' ? 'text-eter-cyan bg-white/10 shadow-[0_0_5px_rgba(0,240,255,0.3)]' : 'text-white/40 hover:text-white'}`}
                    >
                        ES
                    </button>
                    <span className="text-white/10 text-[10px]">|</span>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded transition-all ${language === 'en' ? 'text-eter-cyan bg-white/10 shadow-[0_0_5px_rgba(0,240,255,0.3)]' : 'text-white/40 hover:text-white'}`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* Center/Right Actions */}
            <div className="flex items-center gap-4 pointer-events-auto">

                {/* Vision Link */}
                <Link href="/vision" className="hidden md:block text-xs uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                    {t.manifestoLink}
                </Link>

                {/* Offline Indicator */}
                <div
                    className="relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            borderColor: isOfflineReady ? "rgba(0, 240, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"
                        }}
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md transition-colors duration-500 cursor-help
                            ${isOfflineReady ? 'bg-eter-cyan/10 border-eter-cyan/30' : 'bg-white/5 border-white/10'}
                        `}
                    >
                        <div className="relative flex h-2 w-2">
                            {isOfflineReady && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eter-cyan opacity-75"></span>
                            )}
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isOfflineReady ? 'bg-eter-cyan' : 'bg-white/20'}`}></span>
                        </div>
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${isOfflineReady ? 'text-eter-cyan' : 'text-white/40'}`}>
                            {isOfflineReady ? t.offlineReady : t.loadingModel}
                        </span>
                    </motion.div>

                    {/* Tooltip */}
                    <AnimatePresence>
                        {showTooltip && isOfflineReady && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute right-0 top-full mt-2 w-64 p-3 bg-black/90 border border-eter-cyan/30 rounded text-xs text-white/80 backdrop-blur-xl shadow-xl shadow-eter-cyan/10"
                            >
                                <p className="font-bold text-eter-cyan mb-1">⚡ Cerebro Descargado</p>
                                <p>El modelo de IA reside en tu dispositivo. Puedes desconectar internet y seguir usándolo con total privacidad.</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </header>
    );
}
