import React, { useState, useEffect } from 'react';
import { useAIStore } from '@/core/store/ai-store';
import { MagneticButton } from './MagneticButton';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { tavilyKey, setTavilyKey } = useAIStore();
    const [tempKey, setTempKey] = useState("");
    const [status, setStatus] = useState<"idle" | "saved">("idle");

    useEffect(() => {
        if (isOpen) {
            setTempKey(tavilyKey || "");
            setStatus("idle");
        }
    }, [isOpen, tavilyKey]);

    const handleSave = () => {
        setTavilyKey(tempKey);
        setStatus("saved");
        setTimeout(() => {
            onClose();
        }, 800);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-[#0a0a1a] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl pointer-events-auto relative overflow-hidden">

                            {/* Cyberpunk Glow */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-eter-cyan to-transparent opacity-50" />

                            <h2 className="text-xl font-light text-white mb-6 tracking-widest uppercase flex items-center gap-2">
                                <span className="text-eter-cyan">⚙️</span> Configuración
                            </h2>

                            <div className="space-y-6">
                                {/* Tavily API Key Section */}
                                <div className="space-y-2">
                                    <label className="text-xs text-white/60 font-mono uppercase tracking-wider block">
                                        Tavily Search API Key
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={tempKey}
                                            onChange={(e) => setTempKey(e.target.value)}
                                            placeholder="tvly-..."
                                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 px-4 text-white text-sm focus:outline-none focus:border-eter-cyan/50 focus:shadow-[0_0_15px_rgba(0,240,255,0.1)] transition-all placeholder:text-white/20 font-mono"
                                        />
                                        <div className="absolute right-2 top-2">
                                            {status === "saved" && <span className="text-green-500 text-xs animate-pulse">GUARDADO</span>}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-white/30 leading-relaxed">
                                        Requerido para activar la fase "Investigador Experto".
                                        Obtén tu key gratis en <a href="https://tavily.com" target="_blank" rel="noreferrer" className="text-eter-cyan hover:underline">tavily.com</a>.
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={onClose}
                                        className="flex-1 py-3 rounded-xl border border-white/5 bg-white/5 text-white/40 text-xs tracking-widest hover:bg-white/10 hover:text-white transition-all"
                                    >
                                        CANCELAR
                                    </button>
                                    <MagneticButton
                                        onClick={handleSave}
                                        className="flex-1 py-3 rounded-xl bg-eter-cyan/10 border border-eter-cyan/30 text-eter-cyan text-xs font-bold tracking-widest hover:bg-eter-cyan/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.2)] transition-all"
                                    >
                                        {status === "saved" ? "GUARDADO" : "GUARDAR"}
                                    </MagneticButton>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
