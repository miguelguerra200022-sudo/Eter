export class CpuEngine {
    private pipe: any = null;
    private modelId: string = 'Xenova/Qwen1.5-0.5B-Chat';

    async initialize(onProgress?: (progress: any) => void) {
        if (this.pipe) return;

        console.log(`🧠 Initializing CPU Engine (WASM-CDN) with ${this.modelId}...`);

        try {
            // MAGIC: Import from CDN to bypass Vercel build limits
            // @ts-ignore
            const { pipeline, env } = await import(/* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');

            // Configure env
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            // Progress callback wrapper
            const progressCallback = (data: any) => {
                if (data.status === 'progress' && onProgress) {
                    onProgress({
                        text: `Descargando Cerebro CPU: ${data.file} (${data.progress.toFixed(0)}%)`,
                        progress: data.progress / 100
                    });
                }
            };

            this.pipe = await pipeline('text-generation', this.modelId, {
                progress_callback: progressCallback,
                quantized: true
            });
            console.log("🧠 CPU Engine Ready.");
        } catch (error) {
            console.error("CPU Engine Init Failed:", error);
            throw error;
        }
    }

    async generate(prompt: string, messages: any[]) {
        if (!this.pipe) throw new Error("CPU Engine not initialized");

        const fullPrompt = `<|im_start|>system\nYou are a helpful AI assistant.<|im_end|>\n<|im_start|>user\n${prompt}<|im_end|>\n<|im_start|>assistant\n`;

        const output = await this.pipe(fullPrompt, {
            max_new_tokens: 128,
            temperature: 0.7,
            do_sample: true,
            top_k: 20
        });

        // Parse result
        let cleanOutput = output[0].generated_text;
        if (cleanOutput.includes("<|im_start|>assistant\n")) {
            cleanOutput = cleanOutput.split("<|im_start|>assistant\n")[1];
        }

        return cleanOutput;
    }
}
