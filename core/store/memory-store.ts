import { create } from 'zustand';
import { openDB, IDBPDatabase } from 'idb';
import MiniSearch from 'minisearch';

// Tipos de datos para la memoria
interface MemoryItem {
    id: string;
    content: string;
    type: 'chat' | 'document' | 'user_fact';
    timestamp: number;
    tags?: string[];
}

interface MemoryState {
    isReady: boolean;
    isIndexing: boolean;
    searchResults: MemoryItem[];

    // Actions
    initMemory: () => Promise<void>;
    addToMemory: (content: string, type: 'chat' | 'document' | 'user_fact') => Promise<void>;
    searchMemory: (query: string, limit?: number) => Promise<MemoryItem[]>;
    clearMemory: () => Promise<void>;
}

// Configuración de IndexedDB
const DB_NAME = 'eter-memory-v1';
const STORE_NAME = 'memories';

// Instancia global de MiniSearch (fuera del store para evitar re-creación)
const miniSearch = new MiniSearch({
    fields: ['content', 'tags'], // campos a indexar
    storeFields: ['id', 'content', 'type', 'timestamp', 'tags'], // campos a devolver
    searchOptions: {
        boost: { tags: 2 },
        fuzzy: 0.2,
        prefix: true
    }
});

export const useMemoryStore = create<MemoryState>((set, get) => ({
    isReady: false,
    isIndexing: false,
    searchResults: [],

    initMemory: async () => {
        if (get().isReady) return;
        set({ isIndexing: true });

        try {
            // 1. Abrir DB
            const db = await openDB(DB_NAME, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    }
                },
            });

            // 2. Cargar datos existentes e indexar
            const allMemories = await db.getAll(STORE_NAME);
            if (allMemories.length > 0) {
                miniSearch.removeAll();
                miniSearch.addAll(allMemories);
            }

            console.log(`🧠 ÉTER Memory: Cargados ${allMemories.length} recuerdos.`);
            set({ isReady: true, isIndexing: false });
        } catch (error) {
            console.error("❌ Fallo iniciando memoria:", error);
            set({ isIndexing: false });
        }
    },

    addToMemory: async (content: string, type = 'chat') => {
        const item: MemoryItem = {
            id: crypto.randomUUID(),
            content,
            type,
            timestamp: Date.now(),
            tags: [type]
        };

        try {
            // Guardar en IDB
            const db = await openDB(DB_NAME, 1);
            await db.put(STORE_NAME, item);

            // Indexar en MiniSearch (Memoria)
            if (!miniSearch.has(item.id)) {
                miniSearch.add(item);
            }

            console.log("💾 Recuerdo guardado:", content.substring(0, 20) + "...");
        } catch (error) {
            console.error("Fallo guardando recuerdo:", error);
        }
    },

    searchMemory: async (query: string, limit = 3) => {
        if (!query.trim()) return [];

        // Búsqueda semántica "lite" (Full Text Search + Fuzzy)
        const results = miniSearch.search(query);

        // Mapear resultados al formato MemoryItem
        const items = results.slice(0, limit).map(r => ({
            id: r.id,
            content: r.content,
            type: r.type,
            timestamp: r.timestamp,
            tags: r.tags
        } as MemoryItem));

        set({ searchResults: items });
        return items;
    },

    clearMemory: async () => {
        const db = await openDB(DB_NAME, 1);
        await db.clear(STORE_NAME);
        miniSearch.removeAll();
        set({ searchResults: [] });
        console.log("🧹 Memoria purgada.");
    }
}));
