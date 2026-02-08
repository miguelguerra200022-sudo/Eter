"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { useIdentityStore } from '@/core/store/identity-store';
import { useI18nStore } from '@/core/store/i18n-store';
import { useAIStore } from '@/core/store/ai-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { WifiOff } from 'lucide-react';

// --- JAZZ IMPORTS ENABLED ---
import { useCoState } from 'jazz-tools/react';
import { EterAccount, Chat, ChatList, MessageList, UserProfile } from '@/core/jazz/schema';
import { useJazz } from '@/components/providers/JazzProvider';

const OfflineLink = dynamic(() => import('@/components/p2p/OfflineLink'), { ssr: false });

export const Sidebar = () => {
    const { t } = useI18nStore();
    const { currentSessionId, switchSession: setLocalSessionId } = useAIStore();
    const [isOpen, setIsOpen] = useState(false);
    const [showOfflineLink, setShowOfflineLink] = useState(false);

    return (
        <SideBarContent
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            showOfflineLink={showOfflineLink}
            setShowOfflineLink={setShowOfflineLink}
            currentSessionId={currentSessionId}
            switchSession={setLocalSessionId}
        />
    );
};

function SideBarContent({ isOpen, setIsOpen, showOfflineLink, setShowOfflineLink, currentSessionId, switchSession }: any) {
    // --- JAZZ DEBUGGING ---
    const me = useJazz();

    // Safety cast for TS issues 
    const myRootId = (me as any)?.root?.id;
    const myProfileId = (me as any)?.profile?.id;

    const chats = useCoState(ChatList, myRootId);

    // Enable Profile Hook
    const profile = useCoState(UserProfile, myProfileId);

    const handleCreateChat = () => {
        if (!me || !chats) return;
        const newChat = Chat.create({
            title: "Nuevo Chat",
            messages: MessageList.create([], { owner: me as EterAccount })
        }, { owner: me as EterAccount });
        (chats as any).push(newChat);
        switchSession((newChat as any).id);
    };

    // Ensure profile exists (Defensive)
    useEffect(() => {
        if (me && !(me as any).profile) {
            if (typeof (me as any).ensureProfile === 'function') {
                (me as any).ensureProfile("Comandante Miguel");
            } else {
                console.warn("[Sidebar] ensureProfile missing on account object", me);
            }
        }
    }, [me]);

    // Quantum Identity Logic
    useEffect(() => {
        const initQuantum = async () => {
            if (me && (me as any).profile) {
                const profile = (me as any).profile;

                // If profile doesn't have a key, or we want to ensure we have one
                if (!profile.kyberKey) {
                    console.log("[Quantum] Generating new Kyber-1024 Identity...");
                    const { QuantumService } = await import('@/core/crypto/quantum');
                    const keys = await QuantumService.generateKeys();

                    // Update Profile
                    profile.kyberKey = keys.publicKey;
                    console.log("[Quantum] Identity Published to Jazz Profile.");
                }
            }
        };
        initQuantum();
    }, [me]);

    return (
        <motion.div
            initial={{ width: 60 }}
            animate={{ width: isOpen ? 260 : 60 }}
            className="h-screen bg-[#050510] border-r border-white/10 flex flex-col absolute left-0 top-0 z-50 transition-all duration-300 shadow-2xl"
        >
            {/* ... Header ... */}
            <div className="p-4 flex items-center gap-4 h-16">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <AnimatePresence mode="wait">
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2 overflow-hidden whitespace-nowrap"
                        >
                            <Link href="/" className="font-bold text-white tracking-widest hover:text-eter-cyan transition-colors">
                                ÉTER
                            </Link>
                            <span className="text-[10px] text-eter-cyan/60 font-mono py-0.5 px-1 bg-eter-cyan/10 rounded">ALPHA</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* "New Chat" Button */}
            <div className="px-3 pb-4">
                <button
                    onClick={handleCreateChat}
                    className={clsx(
                        "flex items-center gap-3 w-full p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all group",
                        !isOpen && "justify-center px-0 bg-transparent border-none"
                    )}
                >
                    <div className="w-6 h-6 flex items-center justify-center text-eter-cyan bg-eter-cyan/10 rounded-full group-hover:scale-110 transition-transform">
                        +
                    </div>
                    {isOpen && <span className="text-sm text-white/90 font-medium truncate">Nuevo Chat</span>}
                </button>
            </div>

            {/* Offline Connect Button */}
            <div className="px-3 pb-2">
                <button
                    onClick={() => setShowOfflineLink(true)}
                    className={clsx(
                        "flex items-center gap-3 w-full p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 hover:border-purple-500/40 transition-all group",
                        !isOpen && "justify-center px-0 bg-transparent border-none"
                    )}
                >
                    <div className="w-6 h-6 flex items-center justify-center text-purple-400 bg-purple-500/10 rounded-full group-hover:scale-110 transition-transform">
                        <WifiOff size={14} />
                    </div>
                    {isOpen && <span className="text-sm text-purple-200 font-medium truncate">Modo Offline</span>}
                </button>
            </div>

            {/* Jazz Chat List (ENABLED DEFENSIVELY) */}
            <div className="flex-1 overflow-y-auto scrollbar-hide px-2 space-y-1">
                {chats && (chats as any).map ? (chats as any).map((chatItem: Chat | null) => {
                    const chat = chatItem as Chat;
                    if (!chat) return null;
                    return (
                        <div
                            key={(chat as any).id as string}
                            onClick={() => switchSession((chat as any).id)}
                            className={clsx(
                                "cursor-pointer p-2 rounded-lg transition-colors relative group",
                                (chat as any).id === currentSessionId ? "bg-white/10" : "hover:bg-white/5"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-lg opacity-50">⚡</span>
                                {isOpen && (
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs text-white/90 truncate font-medium">{(chat.title as string) || "Sin título"}</div>
                                        <div className="text-[10px] text-white/40 truncate">
                                            {new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    isOpen && (
                        <div className="p-4 text-xs text-white/30 text-center font-mono">
                            {me ? "Cargando Jazz..." : "Conectando..."}
                        </div>
                    )
                )}
            </div>

            {/* User Footer (Jazz Profile) - ENABLED */}
            <div className="p-4 border-t border-white/5">
                <div className={clsx("flex items-center gap-2", !isOpen && "justify-center")}>
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 overflow-hidden relative group">
                        {(profile as any)?.avatarUrl ? (
                            <img src={(profile as any).avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <span>?</span>
                        )}
                        {/* Quantum Status Indicator */}
                        {(profile as any)?.kyberKey && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-cyan-500 rounded-full border border-black shadow-[0_0_5px_cyan]" title="Quantum Secure" />
                        )}
                    </div>
                    {isOpen && (
                        <div className="flex flex-col">
                            <span className="text-xs text-white/80 font-mono">
                                {(profile as any)?.name || "Comandante"}
                            </span>
                            <div className="flex items-center gap-1">
                                <span className="text-[9px] text-green-500">Jazz Identity</span>
                                {(profile as any)?.kyberKey && (
                                    <span className="text-[8px] text-cyan-400 font-mono border border-cyan-500/30 px-1 rounded bg-cyan-500/10" title="Kyber-1024 Active">
                                        Q-UNK
                                    </span>
                                )}
                            </div>
                            {(profile as any)?.kyberKey && (
                                <span className="text-[8px] text-white/20 font-mono truncate max-w-[100px]">
                                    {(profile as any).kyberKey.substring(0, 12)}...
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showOfflineLink && <OfflineLink onClose={() => setShowOfflineLink(false)} />}
        </motion.div>
    );
}

// Keeping MenuTrigger for future reimplementation...
const MenuTrigger = () => null;
