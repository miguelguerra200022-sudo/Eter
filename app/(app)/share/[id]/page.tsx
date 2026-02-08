"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useP2PStore } from '@/core/store/p2p-store';
import { useAIStore } from '@/core/store/ai-store';
import { motion } from 'framer-motion';
import { clsx } from "clsx";

export default function SharePage() {
    const { id } = useParams();
    const router = useRouter();
    const { getSharedSession } = useP2PStore();
    const { createSession, sessions, renameSession } = useAIStore();

    const [status, setStatus] = useState<'loading' | 'error' | 'success'>('loading');
    const [sessionData, setSessionData] = useState<any>(null);

    // If ID is an array, take first; if missing, error
    const shareId = Array.isArray(id) ? id[0] : id;

    useEffect(() => {
        if (!shareId) return;

        const load = async () => {
            try {
                const data = await getSharedSession(shareId);
                setSessionData(data);
                setStatus('success');
            } catch (e) {
                console.error(e);
                setStatus('error');
            }
        };
        load();
    }, [shareId, getSharedSession]);

    const handleImport = () => {
        if (!sessionData) return;

        // Create new local session
        // Note: We might need a way to inject messages directly.
        // For now, we'll manually patch the store via a custom action or just use existing
        // Since createSession just makes a new empty one, we need to populate it.

        // MVP Hack: Directly access store state to inject (or add importSession to store)
        // Let's assume we can add it manually if we had an "importSession" action.
        // For now, we will add 'importSession' to ai-store in next step, 
        // to avoid complex logic here.

        // Wait! We can retrieve state and force set it if we really want to avoid new actions,
        // but adding an action is cleaner.
        // Let's create the action in AI Store quickly.
        useAIStore.getState().importSession(sessionData); // Will implement this next

        router.push('/chat');
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center font-mono text-eter-cyan">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-eter-cyan/30 border-t-eter-cyan rounded-full animate-spin" />
                    <span className="animate-pulse">DECODIFICANDO ENLACE NEURAL...</span>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-red-500 font-mono">
                ENLACE ROTO O CADUCADO
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.05)_0%,transparent_70%)]" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl relative z-10"
            >
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-2xl font-light tracking-wide text-white">Archivo Neural Compartido</h1>
                        <p className="text-sm text-eter-cyan mt-1">{sessionData.title}</p>
                    </div>
                    <div className="text-[10px] text-white/40 font-mono border border-white/10 px-2 py-1 rounded">
                        ID: {shareId}
                    </div>
                </div>

                {/* Preview */}
                <div className="h-64 overflow-y-auto mb-8 space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/20">
                    {sessionData.messages.map((msg: any, i: number) => (
                        <div key={i} className={clsx(
                            "p-3 rounded-lg text-sm max-w-[90%]",
                            msg.role === 'user' ? "ml-auto bg-eter-cyan/10 text-eter-cyan/90" : "bg-white/5 text-white/80"
                        )}>
                            <p className="font-bold text-[10px] opacity-50 mb-1 uppercase">{msg.role}</p>
                            {msg.content}
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => router.push('/')}
                        className="px-6 py-3 rounded-full border border-white/10 text-white/60 hover:bg-white/5 transition-colors text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleImport}
                        className="px-8 py-3 rounded-full bg-eter-cyan/10 border border-eter-cyan/50 text-eter-cyan hover:bg-eter-cyan hover:text-black transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)] text-sm font-bold tracking-widest"
                    >
                        IMPORTAR A MI ÉTER
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
