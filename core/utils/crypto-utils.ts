/**
 * Encryption Master Utilities
 * Using WebCrypto API for secure, local encryption.
 */

const SALT = new TextEncoder().encode("ETER_SOVEREIGN_SALT");
const ITERATIONS = 100000;

async function deriveKey(password: string): Promise<CryptoKey> {
    const passwordBytes = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey(
        "raw",
        passwordBytes,
        "PBKDF2",
        false,
        ["deriveKey"]
    );

    return await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: SALT,
            iterations: ITERATIONS,
            hash: "SHA-256"
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

export async function encryptText(text: string, password: string): Promise<string> {
    const key = await deriveKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedText = new TextEncoder().encode(text);

    const encryptedContent = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        key,
        encodedText
    );

    // Combine IV and Encrypted Content
    const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encryptedContent), iv.length);

    // Return as Base64 for chat display
    return btoa(String.fromCharCode(...combined));
}

export async function decryptText(encryptedBase64: string, password: string): Promise<string> {
    try {
        const combined = new Uint8Array(
            atob(encryptedBase64).split("").map(c => c.charCodeAt(0))
        );
        const iv = combined.slice(0, 12);
        const content = combined.slice(12);

        const key = await deriveKey(password);
        const decryptedContent = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            content
        );

        return new TextDecoder().decode(decryptedContent);
    } catch (e) {
        throw new Error("Fallo de Desencriptación: Password incorrecto o Hash corrupto.");
    }
}
