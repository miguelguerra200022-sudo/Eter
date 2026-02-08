// Gun Service - CDN Injection Strategy (Nuclear Option)
// Vercel bundler fails to process Gun, so we load it from global window
// import { type IGunInstance } from 'gun'; // REMOVED to prevent build error

// Declare global types for Gun attached to window
declare global {
    interface Window {
        Gun: any;
        SEA: any;
    }
}

const PEERS = [
    // Primary Gun relays
    'https://eter-signal-server.onrender.com/gun', // Custom Eter Relay
    'https://gun-manhattan.herokuapp.com/gun',
    'https://gun-us.herokuapp.com/gun',
    // Community relays
    'https://gun.heron.ninja/gun',
    'https://peer.wallie.io/gun',
    // Additional backup relays
    'https://gun-eu.herokuapp.com/gun',
    'https://gun-ams.herokuapp.com/gun',
    'https://gunjs.herokuapp.com/gun'
];

export class GunService {
    private gun: any | null = null;
    private user: any | null = null;
    private isInitializing: boolean = false;
    private peerId: string | null = null;
    public logs: string[] = [];
    private logListeners: ((log: string) => void)[] = [];
    private keepAliveInterval: any = null;

    constructor() {
        this.log("🔧 Service Instantiated (CDN Mode)");
        if (typeof window !== 'undefined') {
            this.peerId = sessionStorage.getItem('eter_peer_id');
            if (!this.peerId) {
                this.peerId = `anon-${Math.random().toString(36).substr(2, 9)}`;
                sessionStorage.setItem('eter_peer_id', this.peerId);
            }
        }
    }

    private log(msg: string) {
        const entry = `[${new Date().toLocaleTimeString()}] ${msg}`;
        console.log("GUN-SVC:", msg);
        this.logs.push(entry);
        if (this.logs.length > 50) this.logs.shift();
        this.logListeners.forEach(l => l(entry));
    }

    public onLog(cb: (log: string) => void) {
        this.logListeners.push(cb);
        return () => { this.logListeners = this.logListeners.filter(l => l !== cb); };
    }

    async initialize() {
        if (typeof window === 'undefined') return;
        if (this.gun || this.isInitializing) return;

        this.isInitializing = true;
        this.log("🌌 ÉTER P2P: Esperando script Gun (CDN)...");

        // Wait for connection to be available in window (injected by Script tag)
        let retries = 0;
        const waitForGun = async () => {
            while (!window.Gun && retries < 20) {
                await new Promise(r => setTimeout(r, 500));
                retries++;
            }
        };

        try {
            await waitForGun();

            if (!window.Gun) {
                throw new Error("Gun CDN failed to load after 10s");
            }

            this.log("✅ CDN Loaded. Starting Engine.");
            const Gun = window.Gun;

            this.gun = Gun({
                peers: PEERS,
                localStorage: false,
                radisk: true,
                axe: false
            });

            this.user = this.gun.user();
            this.log(`🌌 ÉTER P2P: Nodo Gun ACTIVO [ID: ${this.peerId}]`);

            this.gun.on('hi', (peer: any) => {
                this.log(`👋 P2P: Conectado a peer: ${peer.url || 'WebRTC Peer'}`);
            });

            this.gun.on('bye', (peer: any) => {
                this.log(`👋 P2P: Desconectado de peer: ${peer.url || 'WebRTC Peer'}`);
            });

            // Start Keep-Alive Heartbeat
            this.startKeepAlive();

        } catch (error: any) {
            this.log(`❌ Error FATAL inicializando: ${error.message}`);
        } finally {
            this.isInitializing = false;
        }
    }

    private startKeepAlive() {
        // Clear any existing interval
        if (this.keepAliveInterval) clearInterval(this.keepAliveInterval);

        // Send presence every 10 seconds to keep connections alive
        this.keepAliveInterval = setInterval(() => {
            if (this.gun && this.peerId) {
                const myId = this.user?.is?.pub || this.peerId;
                this.gun.get('eter-global-v3').get('pulse').get(myId).put({
                    timestamp: Date.now(),
                    status: 'online',
                    platform: navigator.platform
                });
                // Optional: Read something to keep socket active
                this.gun.get('eter-global-v3').get('heartbeat').once(() => { });
            }
        }, 10000);

        // this.log("💓 Keep-Alive iniciado (10s interval)");
    }

    async testConnection(): Promise<boolean> {
        if (!this.gun) return false;
        return new Promise((resolve) => {
            const testId = Date.now().toString();
            const timer = setTimeout(() => {
                this.log("⚠️ Handshake Timeout");
                resolve(false);
            }, 3000);

            this.gun.get('eter-test-v1').get(testId).put({ hello: 'world' }, (ack: any) => {
                clearTimeout(timer);
                if (ack.err) {
                    this.log("❌ Handshake Failed: " + ack.err);
                    resolve(false);
                } else {
                    this.log("✅ Handshake Success!");
                    resolve(true);
                }
            });
        });
    }

    getGun() {
        return this.gun;
    }

    joinGlobalPulse(onPulse: (data: any) => void) {
        if (!this.gun) {
            this.initialize().then(() => {
                if (this.gun) this._subscribePulse(onPulse);
            });
            return;
        }
        this._subscribePulse(onPulse);
    }

    private _subscribePulse(onPulse: (data: any) => void) {
        this.gun.get('eter-global-v3').get('pulse').map().on((data: any, key: string) => {
            onPulse({ key, ...data });
        });
    }

    emitPresence() {
        if (!this.gun || !this.peerId) return;
        const myId = this.user?.is?.pub || this.peerId;
        this.gun.get('eter-global-v3').get('pulse').get(myId).put({
            timestamp: Date.now(),
            status: 'online',
            platform: navigator.platform
        });
    }

    // --- SHARING CAPABILITIES ---
    async shareSession(sessionData: any): Promise<string> {
        if (!this.gun) await this.initialize();
        const shareId = Math.random().toString(36).substring(2, 15);
        const node = this.gun.get('eter-global-v3').get('shares').get(shareId);
        return new Promise((resolve, reject) => {
            node.put({
                data: JSON.stringify(sessionData),
                timestamp: Date.now(),
                author: this.peerId
            }, (ack: any) => {
                if (ack.err) reject(ack.err);
                else resolve(shareId);
            });
        });
    }

    async getSharedSession(shareId: string): Promise<any> {
        if (!this.gun) await this.initialize();
        return new Promise((resolve, reject) => {
            this.gun.get('eter-global-v3').get('shares').get(shareId).once((data: any) => {
                if (!data || !data.data) {
                    reject("Session not found");
                    return;
                }
                try {
                    resolve(JSON.parse(data.data));
                } catch (e) {
                    reject("Corrupted session data");
                }
            });
        });
    }

    // --- AUTHENTICATION (SEA) ---
    async authenticate(pair: any): Promise<void> {
        if (!this.gun) await this.initialize();
        if (this.user?.is) return;
        return new Promise((resolve) => {
            this.user.auth(pair, (ack: any) => {
                if (ack.err) console.error("Gun Auth Fail:", ack.err);
                else this.log("🔐 Identity Logged In");
                resolve();
            });
        });
    }

    // --- PRIVATE DM (MVP) ---
    async sendPrivateMessage(recipientPub: string, text: string, myPair: any) {
        if (!this.gun) await this.initialize();
        if (!this.user?.is) await this.authenticate(myPair);
        const msg = {
            text,
            from: myPair.pub,
            timestamp: Date.now()
        };
        // MVP: Write to public inbox
        this.gun.get('eter-users').get(recipientPub).get('inbox').set(msg);
    }

    // --- ENCRYPTED SYNC (MESSAGES) ---
    async publishMessage(sessionId: string, message: any, pair: any) {
        if (!this.gun) await this.initialize();
        if (!this.user?.is) await this.authenticate(pair);

        const SEA = window.SEA;
        if (!SEA) throw new Error("SEA not ready");

        const encryptedContent = await SEA.encrypt(message.content, pair);
        const secureMessage = {
            ...message,
            content: encryptedContent,
            _encrypted: true
        };

        this.user.get('sessions').get(sessionId).get('messages').get(message.timestamp).put(secureMessage);
    }

    subscribeMessages(sessionId: string, pair: any, onMessage: (msg: any) => void) {
        if (!this.user?.is) return;

        this.user.get('sessions').get(sessionId).get('messages').map().on(async (data: any, key: string) => {
            if (!data || !data._encrypted) return;
            try {
                const SEA = window.SEA;
                const decryptedContent = await SEA.decrypt(data.content, pair);
                if (decryptedContent) {
                    onMessage({ ...data, content: decryptedContent, _decrypted: true });
                }
            } catch (e) {
                console.error("Decryption failed:", key);
            }
        });
    }

    // Stub methods for other interfaces to satisfy TS (implement if needed)
    // async publishMessage() {} // REPLACED WITH REAL IMPLEMENTATION
    // subscribeMessages() {}    // REPLACED WITH REAL IMPLEMENTATION
    async publishPublicMessage(channel: string, message: any) {
        if (!this.gun) await this.initialize();
        this.gun.get(channel).set(message);
    }
    subscribePublicMessages(channel: string, onMessage: (msg: any) => void) {
        if (!this.gun) return;
        // console.log(`📡 Suscribiendo a canal público: ${channel}`);

        // 1. Listen for new additions
        this.gun.get(channel).map().on((data: any, key: string) => {
            if (data) {
                // Ensure unique ID is attached
                onMessage({ ...data, id: key });
            }
        });

        // 2. Force a fetch of the graph to hydrate history
        this.gun.get(channel).map().once((data: any, key: string) => {
            if (data) onMessage({ ...data, id: key });
        });
    }
}

export const gunService = new GunService();
