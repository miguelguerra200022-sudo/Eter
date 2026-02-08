import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { voiceService } from '@/core/ai/voice-service';

interface VoiceInputProps {
    onInput: (text: string) => void;
}

export function VoiceInput({ onInput }: VoiceInputProps) {
    const [isListening, setIsListening] = useState(false);
    const [isSupported, setIsSupported] = useState(false);

    useEffect(() => {
        setIsSupported(voiceService.isCapable());
    }, []);

    const toggleListening = () => {
        if (isListening) {
            voiceService.stopListening();
            setIsListening(false);
        } else {
            setIsListening(true);
            voiceService.startListening(
                (text) => {
                    onInput(text);
                },
                (state) => {
                    if (state === 'idle') setIsListening(false);
                }
            );
        }
    };

    if (!isSupported) return null;

    return (
        <div className="relative">
            {isListening && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-[10px] text-eter-cyan font-mono animate-pulse whitespace-nowrap bg-black/50 px-2 py-1 rounded backdrop-blur-md border border-eter-cyan/30">
                    ESCUCHANDO...
                </span>
            )}

            <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition-all duration-300 relative group overflow-hidden ${isListening
                        ? 'text-red-500 bg-red-500/10'
                        : 'text-white/40 hover:text-eter-cyan hover:bg-white/5'
                    }`}
            >
                {/* Visual Pulse Wave */}
                <AnimatePresence>
                    {isListening && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0.5 }}
                            animate={{ scale: 1.5, opacity: 0 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="absolute inset-0 bg-red-500 rounded-full opacity-20"
                        />
                    )}
                </AnimatePresence>

                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
            </button>
        </div>
    );
}
