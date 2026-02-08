"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIStore } from '@/core/store/ai-store';
import { Sparkles, Check, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';

const AVAILABLE_SKILLS = [
    { id: 'research-expert', name: 'Investigador Experto', icon: '🌐', description: 'Acceso a búsquedas web en tiempo real.' },
    { id: 'crypto-master', name: 'Maestro de Cifrado', icon: '🔐', description: 'Herramientas de privacidad y encriptación.' },
];

export const SkillSelector = () => {
    const { activeSkills, toggleSkill } = useAIStore();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute bottom-full right-0 mb-4 w-64 bg-[#0a0a1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] z-50"
                        >
                            <div className="p-3 border-b border-white/5">
                                <span className="text-[10px] font-mono text-eter-cyan/60 tracking-widest uppercase">Habilidades Activas</span>
                            </div>
                            <div className="p-2 space-y-1">
                                {AVAILABLE_SKILLS.map((skill) => {
                                    const isActive = activeSkills.includes(skill.id);
                                    return (
                                        <button
                                            key={skill.id}
                                            onClick={() => toggleSkill(skill.id)}
                                            className={clsx(
                                                "w-full text-left p-2 rounded-xl flex items-start gap-3 transition-all",
                                                isActive ? "bg-eter-cyan/10 hover:bg-eter-cyan/20" : "hover:bg-white/5"
                                            )}
                                        >
                                            <div className="mt-0.5 text-lg">{skill.icon}</div>
                                            <div className="flex-1">
                                                <div className={clsx("text-xs font-bold", isActive ? "text-eter-cyan" : "text-white/60")}>
                                                    {skill.name}
                                                </div>
                                                <div className="text-[9px] text-white/30 leading-tight mt-0.5">
                                                    {skill.description}
                                                </div>
                                            </div>
                                            {isActive && (
                                                <Check size={14} className="text-eter-cyan mt-1" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={clsx(
                    "p-2 rounded-full transition-all border",
                    isOpen || activeSkills.length > 0
                        ? "bg-eter-cyan/20 border-eter-cyan/50 text-eter-cyan shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                )}
                title="Gestionar Habilidades"
            >
                <div className="relative">
                    <Sparkles size={18} />
                    {activeSkills.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-eter-cyan rounded-full animate-pulse" />
                    )}
                </div>
            </button>
        </div>
    );
};
