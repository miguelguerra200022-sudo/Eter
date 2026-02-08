"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export const PurgeSystem: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [isPurging, setIsPurging] = useState(false);

    const handlePurge = async () => {
        if (confirmText !== 'DELETE') return;

        setIsPurging(true);

        try {
            // 1. Clear LocalStorage
            localStorage.clear();

            // 2. Clear IndexedDB
            const dbs = await window.indexedDB.databases();
            dbs.forEach(db => {
                if (db.name) window.indexedDB.deleteDatabase(db.name);
            });

            // 3. Clear Caches (PWA)
            const cacheNames = await caches.keys();
            await Promise.all(cacheNames.map(name => caches.delete(name)));

            // 4. Unregister Service Workers
            const registrations = await navigator.serviceWorker.getRegistrations();
            for (let registration of registrations) {
                await registration.unregister();
            }

            // 5. Final Wipe and Reload
            sessionStorage.clear();
            window.location.href = '/';
        } catch (error) {
            console.error("Purge Error:", error);
            alert("Error al purgar el sistema. Es posible que debas limpiar manualmente los datos del navegador.");
            setIsPurging(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-6 right-6 z-[100]">
                <MagneticButton
                    onClick={() => setIsOpen(true)}
                    className="p-4 rounded-full bg-red-900/20 border border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg hover:shadow-red-500/40 group"
                >
                    <Trash2 size={24} className="group-hover:scale-110 transition-transform" />
                </MagneticButton>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isPurging && setIsOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-md bg-[#0a0a10] border border-red-500/50 rounded-2xl p-8 shadow-[0_0_50px_rgba(239,68,68,0.2)]"
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 text-white/40 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col items-center text-center gap-6">
                                <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 animate-pulse">
                                    <AlertTriangle size={40} className="text-red-500" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold text-white tracking-tight uppercase">¿Eliminar Núcleo Neural?</h2>
                                    <p className="text-sm text-white/60 leading-relaxed font-mono uppercase tracking-tighter">
                                        Esta acción purgará todos los modelos descargados (GBs), historiales, identidades y claves P2P guardadas localmente.
                                        <br /><br />
                                        <span className="text-red-400 font-bold underline">No hay vuelta atrás.</span> El dispositivo se liberará de la carga de ÉTER por completo.
                                    </p>
                                </div>

                                <div className="w-full space-y-4">
                                    <div className="text-[10px] text-red-400/80 font-mono uppercase tracking-widest">
                                        Escribe "DELETE" para confirmar la purga
                                    </div>
                                    <input
                                        type="text"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                                        className="w-full bg-black/60 border border-red-500/30 rounded-xl px-4 py-3 text-center text-white font-mono tracking-[0.5em] focus:outline-none focus:border-red-500 transition-all placeholder:text-red-900/40"
                                        placeholder="CONFIRMAR"
                                        autoFocus
                                    />

                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => setIsOpen(false)}
                                            disabled={isPurging}
                                            className="flex-1 py-3 rounded-xl border border-white/10 text-white/40 hover:bg-white/5 hover:text-white transition-all text-xs font-bold"
                                        >
                                            CANCELAR
                                        </button>
                                        <button
                                            onClick={handlePurge}
                                            disabled={confirmText !== 'DELETE' || isPurging}
                                            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:grayscale text-white text-xs font-bold transition-all shadow-lg shadow-red-600/20"
                                        >
                                            {isPurging ? 'PURGANDO...' : 'EJECUTAR PURGA'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};
