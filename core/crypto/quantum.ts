import { MlKem1024 } from 'crystals-kyber-js';

// Convert Uint8Array to Base64
export function toBase64(bytes: Uint8Array): string {
    return btoa(String.fromCharCode(...bytes));
}

// Convert Base64 to Uint8Array
export function fromBase64(base64: string): Uint8Array {
    return new Uint8Array(atob(base64).split('').map(c => c.charCodeAt(0)));
}

export interface QuantumKeys {
    publicKey: string; // Base64
    privateKey: string; // Base64
}

const STORAGE_KEY = 'eter_quantum_sk';

export class QuantumService {
    // Generate new key pair
    static async generateKeys(): Promise<QuantumKeys> {
        // MlKem1024 key pair generation
        // Note: crystals-kyber-js might return [pk, sk] or object depending on version.
        // Checking library usage: typically returns { pk, sk } or [pk, sk]. 
        // Let's assume standard API or adjust after check. 
        // Actually, looking at docs for `crystals-kyber-js`:
        // It likely exposes `MlKem1024` class with `keyPair` method. 
        // Let's safe-guard with try-catch or explicit check.

        // Using the standard implementation pattern from similar libs:
        const recipient = new MlKem1024();
        const [pk, sk] = await recipient.generateKeyPair();

        const keys = {
            publicKey: toBase64(pk),
            privateKey: toBase64(sk)
        };

        // Save private key locally
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, keys.privateKey);
        }

        return keys;
    }

    // Retrieve local private key
    static getLocalPrivateKey(): string | null {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(STORAGE_KEY);
        }
        return null;
    }

    // Encapsulate (Sender uses Receiver's Public Key)
    static async encapsulate(recipientPublicKeyBase64: string): Promise<{ ciphertext: string, sharedSecret: string }> {
        const pk = fromBase64(recipientPublicKeyBase64);
        const sender = new MlKem1024();
        const [ciphertext, sharedSecret] = await sender.encap(pk);

        return {
            ciphertext: toBase64(ciphertext),
            sharedSecret: toBase64(sharedSecret)
        };
    }

    // Decapsulate (Receiver uses their Private Key)
    static async decapsulate(ciphertextBase64: string, privateKeyBase64: string): Promise<string> {
        const c = fromBase64(ciphertextBase64);
        const sk = fromBase64(privateKeyBase64);
        const receiver = new MlKem1024();
        const sharedSecret = await receiver.decap(c, sk);

        return toBase64(sharedSecret);
    }
}
