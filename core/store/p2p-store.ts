import { create } from 'zustand';
import { gunService } from '@/core/p2p/gun-service';
import { simplePeerService } from '@/core/p2p/simple-peer-service';
import { useIdentityStore } from './identity-store';

interface PeerNode {
    id: string;
    lastSeen: number;
    status: string;
}

interface P2PState {
    isConnected: boolean;
    syncState: 'offline' | 'syncing' | 'synced' | 'error';
    peerCount: number;
    activePeers: Record<string, PeerNode>;

    // Actions
    startNetwork: () => Promise<void>;
    pulseNetwork: () => void;

    // Sync Actions
    publishMessage: (sessionId: string, message: any) => Promise<void>;
    listenToSession: (sessionId: string, onMessage: (msg: any) => void) => void;

    // Public Mesh Actions
    sendPublicMessage: (channel: string, message: any) => Promise<void>;
    joinPublicChannel: (channel: string, onMessage: (msg: any) => void) => void;
    sendPrivateMessage: (recipientPub: string, text: string) => Promise<void>;

    // Sharing (Legacy)
    shareSession: (session: any) => Promise<string>;
    getSharedSession: (id: string) => Promise<any>;
}

export const useP2PStore = create<P2PState>((set, get) => ({
    isConnected: false,
    syncState: 'offline',
    peerCount: 1,
    activePeers: {},

    startNetwork: async () => {
        if (get().isConnected) return;

        console.log("🌐 Red ÉTER: Conectando...");
        set({ syncState: 'syncing' });

        try {
            await gunService.initialize();

            // 1. Authenticate with Identity Keys
            const { pub, priv, epub, epriv } = useIdentityStore.getState();
            if (pub && priv && epub && epriv) {
                const pair = { pub, priv, epub, epriv };
                await gunService.authenticate(pair);
                console.log("🔐 P2P: Autenticado como", pub);
                set({ syncState: 'synced' });
            } else {
                console.warn("⚠️ P2P: No hay llaves de identidad. Ejecutando en modo solo lectura/presencia.");
            }

            // 2. Presence - Subscribe to global pulse
            gunService.joinGlobalPulse((data) => {
                const now = Date.now();
                // Increased timeout to 15s for WAN latency + relay delays
                if (!data.timestamp || now - data.timestamp > 15000) return;

                console.log("📡 Pulse recibido de:", data.key, data);

                set((state) => {
                    const newPeers = { ...state.activePeers };
                    newPeers[data.key] = {
                        id: data.key,
                        lastSeen: data.timestamp,
                        status: data.status
                    };
                    return {
                        activePeers: newPeers,
                        peerCount: Object.keys(newPeers).length + simplePeerService.getConnectionCount()
                    };
                });
            });

            // 3. Initialize Enterprise Multi-Bridge
            simplePeerService.initialize();

            // Listen for Direct P2P
            simplePeerService.onConnect = (peerId) => {
                console.log("🔗 Enterprise P2P Connected:", peerId);
                get().pulseNetwork();
            };

            simplePeerService.onDisconnect = (peerId) => {
                console.log("🚫 Enterprise P2P Disconnected:", peerId);
                get().pulseNetwork();
            };

            set({ isConnected: true });

            // Heartbeat
            setInterval(() => {
                get().pulseNetwork();
            }, 1000);

        } catch (e) {
            console.error("P2P Start Error", e);
            set({ syncState: 'error' });
        }

        // Final connectivity check
        const isAlive = await gunService.testConnection();
        set({ isConnected: isAlive, syncState: isAlive ? 'synced' : 'error' });
    },

    pulseNetwork: () => {
        gunService.emitPresence();
        set((state) => {
            const now = Date.now();
            const activeOnly = Object.entries(state.activePeers)
                .filter(([_, peer]) => now - peer.lastSeen < 15000)
                .reduce((acc, [key, peer]) => ({ ...acc, [key]: peer }), {} as Record<string, PeerNode>);

            const gunPeers = Object.keys(activeOnly).length;
            const p2pCount = simplePeerService.getConnectionCount();

            // Merge SimplePeer nodes into activePeers for UI visualization
            const directPeers = simplePeerService.getConnectedPeers();
            directPeers.forEach(id => {
                if (!activeOnly[id]) {
                    activeOnly[id] = {
                        id,
                        lastSeen: Date.now(),
                        status: 'p2p-direct'
                    };
                }
            });

            return {
                activePeers: activeOnly,
                peerCount: gunPeers + p2pCount
            };
        });
    },

    publishMessage: async (sessionId: string, message: any) => {
        const { pub, priv, epub, epriv } = useIdentityStore.getState();
        if (!pub || !priv) return;

        const pair = { pub, priv, epub, epriv };
        set({ syncState: 'syncing' });
        await gunService.publishMessage(sessionId, message, pair);
        set({ syncState: 'synced' });
    },

    listenToSession: (sessionId: string, onMessage: (msg: any) => void) => {
        const { pub, priv, epub, epriv } = useIdentityStore.getState();
        if (!pub || !priv) return;

        const pair = { pub, priv, epub, epriv };
        gunService.subscribeMessages(sessionId, pair, onMessage);
    },

    sendPublicMessage: async (channel: string, message: any) => {
        // 1. Try SimplePeer Broadcast (Enterprise Speed)
        const sentCount = simplePeerService.broadcast({
            ...message,
            _channel: channel,
            _source: 'p2p-mesh'
        });

        if (sentCount > 0) {
            console.log(`🚀 Mesh P2P: Mensaje enviado a ${sentCount} peers`);
        }

        // 2. Always fallback to Gun.js Mesh (Reliability)
        await gunService.publishPublicMessage(channel, message);
    },

    joinPublicChannel: (channel: string, onMessage: (msg: any) => void) => {
        // Listen to Gun.js Mesh
        gunService.subscribePublicMessages(channel, onMessage);

        // Listen to SimplePeer Messages
        simplePeerService.onData = (peerId, data) => {
            if (data && data._channel === channel) {
                onMessage(data);
            }
        };
    },

    sendPrivateMessage: async (recipientPub: string, text: string) => {
        const { pub, priv, epub, epriv } = useIdentityStore.getState();
        if (!pub || !priv) throw new Error("Need identity");
        const pair = { pub, priv, epub, epriv };
        await gunService.sendPrivateMessage(recipientPub, text, pair);
    },

    shareSession: async (session: any) => {
        return await gunService.shareSession(session);
    },

    getSharedSession: async (id: string) => {
        return await gunService.getSharedSession(id);
    }
}));
