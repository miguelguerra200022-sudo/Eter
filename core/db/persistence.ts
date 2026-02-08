const DB_NAME = 'eter_neural_db';
const STORE_NAME = 'chat_memory';
const DB_VERSION = 1;

export interface StoredMessage {
    id?: number;
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

class PersistenceService {
    private db: IDBDatabase | null = null;

    async init() {
        if (typeof window === 'undefined') return;

        return new Promise<void>((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject("Neural DB Sync Failed");

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };

            request.onsuccess = (event) => {
                this.db = (event.target as IDBOpenDBRequest).result;
                resolve();
            };
        });
    }

    async saveMessage(role: 'user' | 'assistant', content: string) {
        if (!this.db) await this.init();

        return new Promise<void>((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add({ role, content, timestamp: Date.now() });

            request.onsuccess = () => resolve();
            request.onerror = () => reject("Write Failed");
        });
    }

    async getHistory(): Promise<StoredMessage[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject("Read Failed");
        });
    }

    async clearMemory() {
        if (!this.db) await this.init();
        const transaction = this.db!.transaction([STORE_NAME], 'readwrite');
        transaction.objectStore(STORE_NAME).clear();
    }
}

export const persistence = new PersistenceService();
