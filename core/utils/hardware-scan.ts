export interface HardwareSpecs {
    gpu: string;
    cpuThreads: number;
    ram: number | string;
    score: number;
    tier: 'LOW' | 'MEDIUM' | 'HIGH';
    recommendedModel: string;
    webGpuAvailable: boolean;
    webGpuAdapterName?: string;
    isForced?: boolean;
}

export const scanHardware = async (): Promise<HardwareSpecs> => {
    // 1. Detect GPU via WebGL
    let gpu = "Unknown GPU";
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        if (gl) {
            const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                gpu = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
            }
        }
    } catch (e) {
        console.warn("GPU Detection Failed", e);
    }

    // 2. Detect CPU
    const cpuThreads = navigator.hardwareConcurrency || 4;

    // 3. Detect RAM (Chrome/Edge only, roughly)
    const nav: any = navigator;
    const ram = (nav.deviceMemory ? `${nav.deviceMemory} GB` : "Unknown");

    // 5. Explicit WebGPU Check & Adapter Probe
    let webGpuAvailable = false;
    let webGpuAdapterName = "N/A";

    try {
        if (typeof navigator !== 'undefined' && 'gpu' in nav) {
            webGpuAvailable = true;

            // 1. Try standard request
            try {
                let adapter = await nav.gpu.requestAdapter();

                // 2. If failed, try LOW POWER
                if (!adapter) {
                    console.warn("Standard GPU Adapter failed. Retrying with LOW-POWER...");
                    adapter = await nav.gpu.requestAdapter({ powerPreference: 'low-power' });
                }

                // 3. If still failed, try FORCE FALLBACK (Software/SwiftShader)
                if (!adapter) {
                    console.warn("Low-Power GPU Adapter failed. Retrying with FORCE FALLBACK...");
                    adapter = await nav.gpu.requestAdapter({ forceFallbackAdapter: true });
                }

                if (adapter) {
                    const info = await adapter.requestAdapterInfo();
                    webGpuAdapterName = info.device || info.description || "Generic WebGPU Adapter";
                    if ((adapter as any).isFallbackAdapter) {
                        webGpuAdapterName = `(SW) ${webGpuAdapterName}`;
                    }
                } else {
                    webGpuAdapterName = "No Adapter Found";
                }
            } catch (innerE: any) {
                console.error("Inner Adapter Request Error:", innerE);
                webGpuAdapterName = `Error: ${innerE.message || 'Unknown'}`;
            }
        }
    } catch (e: any) {
        webGpuAdapterName = `Probe Failed: ${e.message}`;
    }

    // 4. Calculate Score (Heuristic)
    let score = 0;

    // GPU Scoring
    if (gpu.includes("NVIDIA") || gpu.includes("RTX") || gpu.includes("GTX")) score += 50;
    else if (gpu.includes("Apple") || gpu.includes("M1") || gpu.includes("M2") || gpu.includes("M3")) score += 45;
    else if (gpu.includes("Radeon") || gpu.includes("AMD")) score += 40;
    else if (gpu.includes("Intel")) score += 20;
    else if (gpu.includes("Mali")) score += 30; // Mobile GPU (Medium-ish)
    else score += 10; // Generic/Software

    // CPU Scoring
    score += Math.min(cpuThreads * 2, 30); // Max 30 pts for CPU

    // RAM Scoring
    const numericRam = typeof ram === 'string' && ram !== "Unknown" ? parseInt(ram) : 8;
    score += Math.min(numericRam * 2, 20); // Max 20 pts for RAM

    // Determine Tier
    let tier: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
    let recommendedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC"; // Default SAFE (f32)

    if (score > 80 && webGpuAvailable) {
        tier = 'HIGH';
        recommendedModel = "Llama-3-8B-Instruct-q4f32_1-MLC"; // Beast mode
    } else if (score > 50 && webGpuAvailable) {
        tier = 'MEDIUM';
        // Phi-3 is great but requires newer hardware features often. 
        // TinyLlama is safer for broader mobile coverage, but let's try RedPajama or stay with TinyLlama for stability.
        recommendedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC";
    } else {
        tier = 'LOW';
        // STRICTLY use q4f32 for low-end/old mobiles to avoid shader-f16 errors
        recommendedModel = "TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC";
    }

    return {
        gpu,
        cpuThreads,
        ram,
        score,
        tier,
        recommendedModel,
        webGpuAvailable,
        webGpuAdapterName
    };
};
