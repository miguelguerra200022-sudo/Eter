import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Dynamic import for Gun/SEA will be handled in actions to avoid SSR issues
interface IdentityState {
    alias: string;
    pub: string | null;     // Public Key
    epub: string | null;    // Encryption Public Key
    priv: string | null;    // Private Key (NEVER SHARE)
    epriv: string | null;   // Encryption Private Key

    isReady: boolean;

    // Actions
    ensureIdentity: () => Promise<void>;
    regenerateIdentity: () => Promise<void>;
    updateAlias: (newAlias: string) => void;
}

export const useIdentityStore = create<IdentityState>()(
    persist(
        (set, get) => ({
            alias: 'Anon-User',
            pub: null,
            epub: null,
            priv: null,
            epriv: null,
            isReady: false,

            updateAlias: (newAlias: string) => set({ alias: newAlias }),

            ensureIdentity: async () => {
                const state = get();
                if (state.pub && state.priv) {
                    set({ isReady: true });
                    return;
                }

                // If missing keys, generate new ones
                await get().regenerateIdentity();
            },

            regenerateIdentity: async () => {
                try {
                    console.log("🔐 Generando Nueva Identidad Autónoma (SEA)...");

                    // Use CDN SEA
                    let retries = 0;
                    while (!window.SEA && retries < 20) {
                        await new Promise(r => setTimeout(r, 500));
                        retries++;
                    }

                    const SEA = window.SEA;
                    if (!SEA) throw new Error("SEA module not loaded (CDN Timeout)");

                    const pair = await SEA.pair();

                    set({
                        pub: pair.pub,
                        epub: pair.epub,
                        priv: pair.priv,
                        epriv: pair.epriv,
                        alias: `Agent-${pair.pub.substring(0, 4)}-${Math.floor(Math.random() * 9999)}`,
                        isReady: true
                    });

                    console.log(`🔐 Identidad Creada: ${pair.pub.substring(0, 8)}...`);
                } catch (e) {
                    console.error("Identity Generation Failed:", e);
                }
            }
        }),
        {
            name: 'eter-identity-v1',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
