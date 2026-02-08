import { io, Socket } from 'socket.io-client';
import type { Instance as SimplePeerInstance } from 'simple-peer';

// Signal Server URL (To be updated with deployed URL)
const SIGNAL_SERVER_URL = 'https://eter-signal-server.onrender.com';
// For local testing: 'http://localhost:3001'

interface PeerNode {
    id: string;
    peer: SimplePeerInstance;
    connected: boolean;
}

export class SimplePeerService {
    private socket: Socket | null = null;
    private peers: Map<string, PeerNode> = new Map();
    private myId: string = '';

    // Callbacks
    public onData: ((senderId: string, data: any) => void) | null = null;
    public onConnect: ((peerId: string) => void) | null = null;
    public onDisconnect: ((peerId: string) => void) | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.myId = sessionStorage.getItem('eter_peer_id') ||
                `peer-${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('eter_peer_id', this.myId);
        }
    }

    initialize(serverUrl: string = SIGNAL_SERVER_URL) {
        if (typeof window === 'undefined') return;
        if (this.socket) return;

        console.log('🔌 SimplePeer: Connecting to Signal Server...', serverUrl);
        this.socket = io(serverUrl);

        this.socket.on('connect', () => {
            console.log('✅ Connected to Signal Server. ID:', this.socket?.id);
            this.socket?.emit('register', this.myId);
        });

        // Other peer joined -> We connect to them (Initiator)
        this.socket.on('peer_joined', (userId: string) => {
            console.log('🆕 New Peer detected:', userId);
            this.connectToPeer(userId, true);
        });

        // Other peer left
        this.socket.on('peer_left', (userId: string) => {
            console.log('🚫 Peer left:', userId);
            this.removePeer(userId);
        });

        // Incoming Signal (Offer/Answer/ICE)
        this.socket.on('signal', async (data: { from: string, signal: any }) => {
            // If we don't have a peer for this user, we are NOT the initiator
            if (!this.peers.has(data.from)) {
                await this.connectToPeer(data.from, false);
            }

            const peerNode = this.peers.get(data.from);
            if (peerNode) {
                console.log(`📩 Signal received from ${data.from}`);
                peerNode.peer.signal(data.signal);
            } else {
                console.warn(`⚠️ Could not find peer ${data.from} even after connect attempt.`);
            }
        });
    }

    // Connect to a peer (create SimplePeer instance)
    private async connectToPeer(userId: string, initiator: boolean) {
        if (this.peers.has(userId)) return;

        console.log(`🔗 Creating SimplePeer for ${userId} (Initiator: ${initiator})`);

        // Dynamic import to avoid SSR issues
        const SimplePeer = (await import('simple-peer')).default;

        const peer = new SimplePeer({
            initiator: initiator,
            trickle: false, // Simple setup first, can enable trickle for speed
            config: {
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:global.stun.twilio.com:3478' }
                ]
            }
        });

        this.peers.set(userId, { id: userId, peer, connected: false });

        // Event: Signal generated (send to other via Socket)
        peer.on('signal', (data) => {
            // console.log(`📤 Generating signal for ${userId}`);
            this.socket?.emit('signal', {
                to: userId,
                from: this.myId,
                signal: data
            });
        });

        peer.on('connect', () => {
            console.log(`🚀 P2P Connected with ${userId}`);
            const node = this.peers.get(userId);
            if (node) node.connected = true;
            this.onConnect?.(userId);
        });

        peer.on('data', (data) => {
            try {
                const parsed = JSON.parse(data.toString());
                // console.log(`📨 Data from ${userId}:`, parsed);
                this.onData?.(userId, parsed);
            } catch (e) {
                console.log(`📨 Raw Data from ${userId}:`, data.toString());
            }
        });

        peer.on('close', () => {
            this.removePeer(userId);
        });

        peer.on('error', (err) => {
            console.error(`❌ Peer Error (${userId}):`, err);
            // Optionally retry or remove
            // this.removePeer(userId);
        });
    }

    // --- MANUAL HANDSHAKE (QR / Offline) ---
    public createManualConnection(initiator: boolean, onSignal: (data: string) => void): { signal: (data: string) => void } {
        const tempId = `manual-${Math.random().toString(36).substr(2, 5)}`;
        console.log(`🔗 Creating Manual Peer (Initiator: ${initiator})`);

        // Dynamic import logic is handled in connectToPeer, but here we need synchronous access or promise
        // For simplicity, we assume SimplePeer is loaded or we wrap it.
        // We'll use a hack to get SimplePeer class since module import is async
        let SimplePeerClass: any;
        import('simple-peer').then(m => {
            SimplePeerClass = m.default;
            start();
        });

        let peer: SimplePeerInstance;

        const start = () => {
            peer = new SimplePeerClass({
                initiator: initiator,
                trickle: false,
                config: { iceServers: [] } // No STUN in air-gapped mode
            });

            this.peers.set(tempId, { id: tempId, peer, connected: false });

            peer.on('signal', (data: any) => {
                // Compress or just stringify
                const signalString = JSON.stringify(data);
                onSignal(signalString);
            });

            peer.on('connect', () => {
                console.log(`🚀 Manual P2P Connected!`);
                const node = this.peers.get(tempId);
                if (node) node.connected = true;
                this.onConnect?.(tempId);
            });

            peer.on('data', (data: any) => {
                try {
                    const parsed = JSON.parse(data.toString());
                    this.onData?.(tempId, parsed);
                } catch (e) {
                    console.log(`📨 Raw Data from Manual Peer:`, data.toString());
                }
            });

            peer.on('error', (err: any) => {
                console.error(`❌ Manual Peer Error:`, err);
            });
        };

        return {
            signal: (data: string) => {
                if (!peer) {
                    // unexpected urgency, wait for load
                    setTimeout(() => peer.signal(JSON.parse(data)), 1000);
                } else {
                    peer.signal(JSON.parse(data));
                }
            }
        };
    }

    private removePeer(userId: string) {
        if (this.peers.has(userId)) {
            const node = this.peers.get(userId);
            try {
                node?.peer.destroy();
            } catch (e) {
                console.error("Error destroying peer", e);
            }
            this.peers.delete(userId);
            this.onDisconnect?.(userId);
            console.log(`🚫 Connection closed with ${userId}`);
        }
    }

    // Broadcast message to all connected peers
    broadcast(data: any) {
        let count = 0;
        const msg = JSON.stringify(data);
        this.peers.forEach((node) => {
            if (node.connected) {
                try {
                    node.peer.send(msg);
                    count++;
                } catch (e) {
                    console.error("Broadcast error", e);
                }
            }
        });
        return count;
    }

    getConnectionCount() {
        let count = 0;
        this.peers.forEach(p => { if (p.connected) count++; });
        return count;
    }

    getConnectedPeers(): string[] {
        const list: string[] = [];
        this.peers.forEach(p => {
            if (p.connected) list.push(p.id);
        });
        return list;
    }
}

export const simplePeerService = new SimplePeerService();
