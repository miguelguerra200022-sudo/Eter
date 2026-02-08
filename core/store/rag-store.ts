import { create } from 'zustand';

interface RagDocument {
    id: string;
    name: string;
    content: string;
    size: number;
}

interface RagState {
    activeDocument: RagDocument | null;
    isProcessing: boolean;
    uploadDocument: (file: File) => Promise<void>;
    clearDocument: () => void;
}

export const useRagStore = create<RagState>((set) => ({
    activeDocument: null,
    isProcessing: false,

    uploadDocument: async (file: File) => {
        set({ isProcessing: true });

        try {
            // Basic text reader for MVP (txt, md, json, js, ts)
            const text = await file.text();

            // Limit size for Llama-3-8B context (approx 8k chars safe limit for injection without complex chunking)
            const safeContent = text.slice(0, 15000);

            set({
                activeDocument: {
                    id: Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    content: safeContent,
                    size: file.size
                },
                isProcessing: false
            });
        } catch (error) {
            console.error("RAG Upload Failed", error);
            set({ isProcessing: false });
        }
    },

    clearDocument: () => set({ activeDocument: null })
}));
