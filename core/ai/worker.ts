// Polyfill environment for WebLLM in restrictive environments
if (typeof self !== "undefined") {
    // 1. Cache API Polyfill (In-Memory)
    if (!("caches" in self)) {
        const memoryCache = new Map<string, any>();
        // @ts-ignore
        self.caches = {
            open: async (cacheName: string) => ({
                put: async (request: any, response: any) => {
                    const url = request.url || request;
                    memoryCache.set(`${cacheName}:${url}`, await response.clone().blob());
                },
                match: async (request: any) => {
                    const url = request.url || request;
                    const blob = memoryCache.get(`${cacheName}:${url}`);
                    return blob ? new Response(blob) : undefined;
                },
                delete: async (request: any) => {
                    const url = request.url || request;
                    return memoryCache.delete(`${cacheName}:${url}`);
                },
                keys: async () => [],
                add: async (request: any) => {
                    const url = request.url || request;
                    console.log(`[Polyfill] Start Fetch: ${url}`);
                    const response = await fetch(url);
                    if (!response.ok) throw new TypeError('Bad response status');
                    console.log(`[Polyfill] Fetch Done: ${url} (${response.headers.get("content-length")} bytes)`);
                    memoryCache.set(`${cacheName}:${url}`, await response.clone().blob());
                },
                addAll: async (requests: any[]) => {
                    await Promise.all(requests.map(async (request: any) => {
                        const url = request.url || request;
                        console.log(`[Polyfill] Start Fetch (All): ${url}`);
                        const response = await fetch(url);
                        if (!response.ok) throw new TypeError('Bad response status');
                        memoryCache.set(`${cacheName}:${url}`, await response.clone().blob());
                    }));
                }
            }),
            has: async () => false,
            delete: async () => true,
            keys: async () => [],
            match: async () => undefined
        };
    }

    // 2. Crypto Polyfill
    if (!("crypto" in self)) {
        // @ts-ignore
        self.crypto = {} as any;
    }
    if (!("randomUUID" in self.crypto)) {
        // @ts-ignore
        self.crypto.randomUUID = function error(): string {
            return '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c: any) =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        };
    }
}

import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// Hook up the worker handler to let WebLLM handle the message passing
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
    handler.onmessage(msg);
};
