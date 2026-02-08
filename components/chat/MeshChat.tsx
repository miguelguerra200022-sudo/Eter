"use client";
import React, { useEffect, useState, useRef } from 'react';
import { useP2PStore } from '@/core/store/p2p-store';
import { useIdentityStore } from '@/core/store/identity-store';
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { MagneticButton } from '@/components/ui/MagneticButton';
import { PrivateDM } from './PrivateDM';

interface MeshMessage {
    id: string;
    text: string;
    sender: string;
    alias: string;
    timestamp: number;
}

export const MeshChat = () => {
    const { alias, pub } = useIdentityStore();
    const { sendPublicMessage, joinPublicChannel } = useP2PStore();
    const [messages, setMessages] = useState<MeshMessage[]>([]);
    const [inputText, setInputText] = useState("");
    const [showDM, setShowDM] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const MESH_CHANNEL_ID = 'eter-global-mesh-v1';

    useEffect(() => {
        // Subscribe to global mesh channel
        joinPublicChannel(MESH_CHANNEL_ID, (msg: any) => {
            if (msg && msg.text && msg.timestamp) {
                setMessages(prev => {
                    if (prev.some(m => m.id === msg.id)) return prev;
                    return [...prev, msg].sort((a, b) => a.timestamp - b.timestamp);
                });
            }
        });
    }, [joinPublicChannel]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async () => {
        if (!inputText.trim()) return;

        const msg: MeshMessage = {
            id: crypto.randomUUID(),
            text: inputText,
            sender: pub || 'anon',
            alias: alias || 'Anonymous',
            timestamp: Date.now()
        };

        // UI Optimistic Update
        setMessages(prev => [...prev, msg]);
        setInputText("");

        // Network Publish
        await sendPublicMessage(MESH_CHANNEL_ID, msg);
    };

    return (
        <div className="flex flex-col h-full w-full relative">
            <div className="absolute top-0 left-0 right-0 p-2 bg-eter-green/10 border-b border-eter-green/20 backdrop-blur text-center z-10 flex justify-between items-center px-4">
                <span className="text-xs font-mono text-eter-green tracking-widest uppercase animate-pulse">
                    📡 RED MESH GLOBAL
                </span>
                <button
                    onClick={() => setShowDM(!showDM)}
                    className="text-[10px] bg-eter-purple/20 text-eter-purple px-2 py-1 rounded hover:bg-eter-purple/40 transition-colors"
                >
                    {showDM ? 'VER CHAT PÚBLICO' : 'ENVIAR MENSAJE PRIVADO'}
                </button>
            </div>

            {showDM ? (
                <div className="p-4 pt-16 h-full overflow-y-auto">
                    <PrivateDM />

                    <div className="mt-8 p-4 border border-white/5 rounded-lg bg-black/20">
                        <h4 className="text-xs text-white/40 mb-2 uppercase tracking-wider">Tu Identidad (Compartir para recibir)</h4>
                        <code className="block p-2 bg-black/40 rounded text-[10px] text-eter-cyan break-all select-all cursor-pointer hover:bg-white/5" onClick={() => navigator.clipboard.writeText(pub || '')}>
                            {pub || 'Generando...'}
                        </code>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto scrollbar-hide p-4 pt-12 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-white/20 text-xs mt-20 font-mono">
                            Esperando señales de la red... <br />
                            (Nadie ha hablado aquí recientemente)
                        </div>
                    )}

                    {messages.map((msg) => {
                        const isMe = msg.sender === pub;
                        return (
                            <div key={msg.id} className={clsx("flex flex-col", isMe ? "items-end" : "items-start")}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={clsx("text-[9px] font-bold uppercase", isMe ? "text-eter-cyan" : "text-eter-green")}>
                                        {msg.alias}
                                    </span>
                                    <span className="text-[9px] text-white/20">
                                        {new Date(msg.timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                                <div className={clsx(
                                    "max-w-[80%] rounded-lg px-3 py-2 text-sm border backdrop-blur-sm",
                                    isMe
                                        ? "bg-eter-cyan/10 border-eter-cyan/30 text-white"
                                        : "bg-eter-green/10 border-eter-green/30 text-white"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={bottomRef} />
                </div>
            )}

            <div className="p-4 bg-black/40 border-t border-white/10 backdrop-blur flex gap-2">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Transmitir a la red..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-full py-2 px-4 text-sm text-white focus:border-eter-green/50 focus:outline-none transition-all placeholder:text-white/20"
                />
                <MagneticButton onClick={handleSend} className="p-2 rounded-full bg-eter-green/10 text-eter-green hover:bg-eter-green/20 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </MagneticButton>
            </div>
        </div>
    );
};
