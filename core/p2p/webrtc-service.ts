// WebRTC Direct P2P Service
// Uses Gun.js as signaling channel and Google STUN for NAT traversal

declare global {
    interface Window {
        Gun: any;
    }
}

interface PeerConnection {
    id: string;
    connection: RTCPeerConnection;
    channel: RTCDataChannel | null;
    state: 'connecting' | 'connected' | 'disconnected';
}

// Free STUN servers (no TURN needed for most cases)
const ICE_SERVERS: RTCConfiguration = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun3.l.google.com:19302' },
        { urls: 'stun:stun4.l.google.com:19302' }
    ]
};

export class WebRTCService {
    private gun: any = null;
    private myId: string;
    private peers: Map<string, PeerConnection> = new Map();
    private onMessageCallback: ((peerId: string, data: any) => void) | null = null;
    private onPeerConnectedCallback: ((peerId: string) => void) | null = null;
    private onPeerDisconnectedCallback: ((peerId: string) => void) | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            // Generate unique ID for this peer
            this.myId = sessionStorage.getItem('eter_webrtc_id') ||
                `rtc-${Math.random().toString(36).substr(2, 9)}`;
            sessionStorage.setItem('eter_webrtc_id', this.myId);
            console.log('🌐 WebRTC Service initialized. ID:', this.myId);
        } else {
            this.myId = '';
        }
    }

    async initialize(gunInstance: any) {
        this.gun = gunInstance;
        if (!this.gun) {
            console.error('❌ WebRTC: Gun instance required for signaling');
            return;
        }

        // Listen for incoming connection offers
        this.gun.get('eter-webrtc-v1').get('signals').map().on((data: any, key: string) => {
            if (!data || !data.to || data.to !== this.myId) return;
            if (data.from === this.myId) return;

            this.handleSignal(data);
        });

        // Broadcast presence
        this.broadcastPresence();
        console.log('✅ WebRTC: Listening for connection signals');
    }

    private broadcastPresence() {
        if (!this.gun) return;
        this.gun.get('eter-webrtc-v1').get('presence').get(this.myId).put({
            id: this.myId,
            timestamp: Date.now(),
            ready: true
        });
    }

    async connectToPeer(peerId: string): Promise<boolean> {
        if (peerId === this.myId) return false;
        if (this.peers.has(peerId)) {
            console.log('⚠️ Already connected/connecting to', peerId);
            return true;
        }

        console.log('🔗 WebRTC: Initiating connection to', peerId);

        const pc = new RTCPeerConnection(ICE_SERVERS);
        const peerConn: PeerConnection = {
            id: peerId,
            connection: pc,
            channel: null,
            state: 'connecting'
        };
        this.peers.set(peerId, peerConn);

        // Create data channel (initiator side)
        const channel = pc.createDataChannel('eter-data', { ordered: true });
        this.setupDataChannel(channel, peerId);
        peerConn.channel = channel;

        // ICE candidate handling
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                this.sendSignal(peerId, {
                    type: 'candidate',
                    candidate: event.candidate.toJSON()
                });
            }
        };

        pc.onconnectionstatechange = () => {
            console.log(`📶 WebRTC [${peerId}]: Connection state:`, pc.connectionState);
            if (pc.connectionState === 'connected') {
                peerConn.state = 'connected';
                this.onPeerConnectedCallback?.(peerId);
            } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                peerConn.state = 'disconnected';
                this.onPeerDisconnectedCallback?.(peerId);
                this.peers.delete(peerId);
            }
        };

        // Create and send offer
        try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            this.sendSignal(peerId, {
                type: 'offer',
                sdp: pc.localDescription?.sdp
            });
            return true;
        } catch (e) {
            console.error('❌ WebRTC: Failed to create offer', e);
            this.peers.delete(peerId);
            return false;
        }
    }

    private async handleSignal(data: any) {
        const { from, type, sdp, candidate } = data;
        console.log(`📨 WebRTC: Received ${type} from ${from}`);

        let peerConn = this.peers.get(from);

        if (type === 'offer') {
            // Create new connection for incoming offer
            const pc = new RTCPeerConnection(ICE_SERVERS);
            peerConn = {
                id: from,
                connection: pc,
                channel: null,
                state: 'connecting'
            };
            this.peers.set(from, peerConn);

            // Handle incoming data channel
            pc.ondatachannel = (event) => {
                peerConn!.channel = event.channel;
                this.setupDataChannel(event.channel, from);
            };

            pc.onicecandidate = (event) => {
                if (event.candidate) {
                    this.sendSignal(from, {
                        type: 'candidate',
                        candidate: event.candidate.toJSON()
                    });
                }
            };

            pc.onconnectionstatechange = () => {
                if (pc.connectionState === 'connected') {
                    peerConn!.state = 'connected';
                    this.onPeerConnectedCallback?.(from);
                } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
                    peerConn!.state = 'disconnected';
                    this.onPeerDisconnectedCallback?.(from);
                    this.peers.delete(from);
                }
            };

            // Set remote description and create answer
            await pc.setRemoteDescription({ type: 'offer', sdp });
            const answer = await pc.createAnswer();
            await pc.setLocalDescription(answer);
            this.sendSignal(from, {
                type: 'answer',
                sdp: pc.localDescription?.sdp
            });

        } else if (type === 'answer' && peerConn) {
            await peerConn.connection.setRemoteDescription({ type: 'answer', sdp });

        } else if (type === 'candidate' && peerConn) {
            try {
                await peerConn.connection.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
                console.error('❌ WebRTC: Failed to add ICE candidate', e);
            }
        }
    }

    private sendSignal(to: string, payload: any) {
        if (!this.gun) return;
        const signalId = `${this.myId}-${to}-${Date.now()}`;
        this.gun.get('eter-webrtc-v1').get('signals').get(signalId).put({
            from: this.myId,
            to: to,
            ...payload,
            timestamp: Date.now()
        });
    }

    private setupDataChannel(channel: RTCDataChannel, peerId: string) {
        channel.onopen = () => {
            console.log(`✅ WebRTC: DataChannel OPEN with ${peerId}`);
        };

        channel.onclose = () => {
            console.log(`❌ WebRTC: DataChannel CLOSED with ${peerId}`);
        };

        channel.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(`📩 WebRTC Message from ${peerId}:`, data);
                this.onMessageCallback?.(peerId, data);
            } catch (e) {
                console.log(`📩 WebRTC Raw Message from ${peerId}:`, event.data);
                this.onMessageCallback?.(peerId, { raw: event.data });
            }
        };
    }

    sendMessage(peerId: string, data: any): boolean {
        const peer = this.peers.get(peerId);
        if (!peer || !peer.channel || peer.channel.readyState !== 'open') {
            console.warn(`⚠️ WebRTC: Cannot send to ${peerId}, channel not ready`);
            return false;
        }

        peer.channel.send(JSON.stringify(data));
        return true;
    }

    broadcast(data: any) {
        let sent = 0;
        this.peers.forEach((peer, id) => {
            if (this.sendMessage(id, data)) sent++;
        });
        console.log(`📤 WebRTC: Broadcast to ${sent} peers`);
        return sent;
    }

    // Event handlers
    onMessage(callback: (peerId: string, data: any) => void) {
        this.onMessageCallback = callback;
    }

    onPeerConnected(callback: (peerId: string) => void) {
        this.onPeerConnectedCallback = callback;
    }

    onPeerDisconnected(callback: (peerId: string) => void) {
        this.onPeerDisconnectedCallback = callback;
    }

    getMyId(): string {
        return this.myId;
    }

    getConnectedPeers(): string[] {
        return Array.from(this.peers.entries())
            .filter(([_, p]) => p.state === 'connected')
            .map(([id, _]) => id);
    }

    getConnectionCount(): number {
        return this.getConnectedPeers().length;
    }

    // Discover and auto-connect to available peers
    async autoConnect() {
        if (!this.gun) return;

        console.log('🔍 WebRTC: Scanning for peers...');

        this.gun.get('eter-webrtc-v1').get('presence').map().once((data: any, key: string) => {
            if (!data || !data.ready || data.id === this.myId) return;

            // Only connect to recent peers (last 30s)
            if (Date.now() - data.timestamp > 30000) return;

            console.log('👋 WebRTC: Found peer', data.id);
            this.connectToPeer(data.id);
        });
    }
}

export const webRTCService = new WebRTCService();
