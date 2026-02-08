"use client";
import { useEffect, useState, useRef } from "react";
import { scanHardware, HardwareSpecs } from "@/core/utils/hardware-scan";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

interface HardwareScannerProps {
    onComplete: (specs: HardwareSpecs) => void;
}

export const HardwareScanner = ({ onComplete }: HardwareScannerProps) => {
    const [specs, setSpecs] = useState<HardwareSpecs | null>(null);
    const [scanning, setScanning] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => setLogs(prev => [...prev, `> ${msg}`]);
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    useEffect(() => {
        const runScan = async () => {
            addLog("INITIATING HARDWARE PROBE...");
            await delay(500);

            addLog("ACCESSING WEBGL CONTEXT...");
            await delay(600);

            const result = await scanHardware();
            setSpecs(result);

            addLog(`GPU DETECTED: ${result.gpu.slice(0, 30)}...`);
            addLog(`CPU THREADS: ${result.cpuThreads}`);
            addLog(`MEMORY ALLOCATION: ${result.ram}`);
            await delay(600);

            addLog(`NEURAL SCORE: ${result.score}/100`);
            addLog(`TIER ASSIGNED: ${result.tier}`);
            addLog("DIAGNOSTIC COMPLETE.");
            await delay(1000);

            setScanning(false);
            onComplete(result);
        };

        runScan();
    }, [onComplete]);

    // COMPACT MODE (Persistent HUD)
    if (!scanning && specs) {
        return (
            <div className="font-mono text-[10px] text-eter-cyan/60 bg-black/40 border border-white/10 p-2 rounded backdrop-blur-md flex flex-col gap-1 w-full md:w-[200px]">
                <div className="flex justify-between items-center border-b border-white/10 pb-1 mb-1">
                    <span className="uppercase tracking-widest text-eter-cyan">SYSTEM STATUS</span>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#00ff00]" />
                </div>
                <div className="flex justify-between">
                    <span>GPU:</span>
                    <span className="text-white/80 truncate w-24 text-right">{specs.gpu.split('Match')[0].split('(')[0].slice(0, 15)}</span>
                </div>
                <div className="flex justify-between">
                    <span>RAM:</span>
                    <span className="text-white/80">{specs.ram}</span>
                </div>
                <div className="flex justify-between">
                    <span>ADAPTER:</span>
                    <span className="text-white/80 text-[9px] truncate w-24 text-right">
                        {specs.webGpuAdapterName || "N/A"}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>WEB.GPU:</span>
                    <span className={specs.webGpuAvailable ? 'text-green-400' : 'text-red-500 animate-pulse'}>
                        {specs.webGpuAvailable ? 'READY' : 'MISSING'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>TIER:</span>
                    <span className={specs.tier === 'HIGH' ? 'text-green-400' : 'text-yellow-400'}>{specs.tier}</span>
                </div>
                <div className="text-[9px] text-white/20 mt-1 truncate">
                    MODEL: {specs.recommendedModel.split('-')[0]}
                </div>

                {/* WARNINGS & ERRORS */}
                {/* Show if missing capability OR if missing adapter */}
                {(!specs.webGpuAvailable || (specs.webGpuAdapterName?.includes("No Adapter") || specs.webGpuAdapterName?.includes("Probe Failed") || specs.webGpuAdapterName === "N/A")) && (
                    <>
                        {/* CASE 1: BROWSER BLOCK (Mali/Adreno/Missing) */}
                        <div className="mt-2 p-2 bg-red-900/90 border border-red-500/50 rounded text-[9px] leading-tight text-red-200 shadow-lg relative z-50">
                            <strong className="block text-red-400 mb-1">⚠️ ACTIVAR GPU</strong>
                            <ol className="list-decimal ml-3 space-y-1 opacity-90">
                                <li>Ve a <span className="font-mono bg-black/50 px-1 rounded">chrome://flags</span></li>
                                <li>Activa <span className="font-mono text-yellow-400">unsafe-webgpu</span></li>
                                <li>Reinicia Chrome.</li>
                            </ol>

                            {/* FORCE BYPASS BUTTON - CASE 1 */}
                            <button
                                onClick={() => {
                                    const forcedSpecs = {
                                        ...specs,
                                        webGpuAvailable: true,
                                        webGpuAdapterName: "Hybrid Native/Force",
                                        tier: 'LOW',
                                        recommendedModel: 'TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC',
                                        isForced: true
                                    } as HardwareSpecs;
                                    setSpecs(forcedSpecs);
                                    onComplete(forcedSpecs);
                                }}
                                className="w-full mt-2 bg-red-600 hover:bg-red-500 text-white font-bold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-colors shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                            >
                                <span className="animate-pulse">☢️</span> FORZAR INICIO
                            </button>
                            <div className="text-[7px] text-center mt-1 opacity-50 text-red-100">Ignorar seguridad (Riesgo de Crash)</div>
                        </div>


                        {/* CASE 2: SOFTWARE ADAPTER (SwiftShader) */}
                        {specs.webGpuAdapterName?.includes("(SW)") && (
                            <div className="mt-2 p-2 bg-yellow-900/40 border border-yellow-500/30 rounded text-[9px] text-yellow-200">
                                <strong className="block text-yellow-400 mb-1">⚠️ MODO LENTO</strong>
                                Usando renderizado por Software. La IA funcionará pero muy lento.
                            </div>
                        )}

                        {/* CASE 3: SPECIFIC ERROR */}
                        {specs.webGpuAdapterName?.startsWith("Error:") && (
                            <div className="mt-2 p-2 bg-red-900/40 border border-red-500/30 rounded text-[9px] text-red-300 break-all">
                                <strong>ERROR:</strong> {specs.webGpuAdapterName}
                                {/* FORCE BYPASS BUTTON FOR ERRORS TOO */}
                                <button
                                    onClick={() => {
                                        const forcedSpecs = {
                                            ...specs,
                                            webGpuAvailable: true,
                                            webGpuAdapterName: "Hybrid Native/Force",
                                            tier: 'LOW',
                                            recommendedModel: 'TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC',
                                            isForced: true
                                        } as HardwareSpecs;
                                        setSpecs(forcedSpecs);
                                        onComplete(forcedSpecs);
                                    }}
                                    className="w-full mt-2 bg-red-600/50 hover:bg-red-500/50 border border-red-500 text-white font-bold py-1 px-2 rounded flex items-center justify-center gap-1 transition-colors"
                                >
                                    IGNORAR Y CONTINUAR
                                </button>
                            </div>
                        )}

                    </>
                )}
            </div>
        );
    }

    // SCANNING MODE (Original)
    return (
        <div className="font-mono text-xs w-full max-w-md bg-black/60 border border-[#4D4DFF]/30 rounded-lg p-4 backdrop-blur-md shadow-[0_0_20px_rgba(77,77,255,0.1)]">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                <span className="text-white/60 font-bold tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#4D4DFF] animate-pulse shadow-[0_0_10px_#4D4DFF]" />
                    SYSTEM DIAGNOSTIC
                </span>
                <span className="text-[10px] text-white/30">{specs ? 'COMPLETE' : 'SCANNING...'}</span>
            </div>

            <div className="h-32 overflow-hidden relative flex flex-col justify-end">
                <div className="space-y-1">
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={clsx(
                                "truncate",
                                // Highlight the very last log (Newest)
                                i === logs.length - 1
                                    ? "text-[#4D4DFF] font-bold drop-shadow-[0_0_8px_rgba(77,77,255,0.8)]"
                                    : "text-white/40"
                            )}
                        >
                            {log}
                        </motion.div>
                    ))}
                    <div ref={logsEndRef} />
                </div>

                {/* Scanlines Effect */}
                <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {!scanning && specs && (
                <div className="border-t border-white/10 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-white/40">RECOMMENDED PROTOCOL:</span>
                        <span className={`font-bold ${specs.tier === 'HIGH' ? 'text-green-400' :
                            specs.tier === 'MEDIUM' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                            {specs.tier} PERFORMANCE
                        </span>
                    </div>
                    <div className="text-[10px] text-white/30 truncate mb-2">
                        MODEL: {specs.recommendedModel}
                    </div>

                    {/* MAL SPECIFIC FIX HINT */}
                    {specs.webGpuAvailable && (specs.webGpuAdapterName === "No Adapter Found" || specs.webGpuAdapterName === "Probe Failed" || specs.webGpuAdapterName === "N/A") && (
                        <div className="mt-2 p-2 bg-red-900/30 border border-red-500/50 rounded text-[9px] text-red-200">
                            <strong className="block text-red-400 mb-1">⚠️ GPU BLOCKED BY BROWSER</strong>
                            Chrome ha ocultado tu GPU (Mali). Para activar la IA Real:
                            <ol className="list-decimal ml-4 mt-1 space-y-1 opacity-80">
                                <li>Abre: <span className="font-mono bg-black/50 px-1 rounded select-all">chrome://flags</span></li>
                                <li>Busca: <span className="font-mono text-yellow-500">unsafe-webgpu</span></li>
                                <li>Cámbialo a <strong>Enabled</strong> y Reinicia Chrome.</li>
                            </ol>
                            <div className="mt-2 text-[8px] text-white/20 border-t border-white/10 pt-1">
                                DIAGNOSTIC v2.1-{specs.webGpuAdapterName}
                            </div>

                            {/* FORCE BYPASS BUTTON */}
                            <button
                                onClick={() => {
                                    const forcedSpecs = {
                                        ...specs,
                                        webGpuAvailable: true,
                                        webGpuAdapterName: "Hybrid Native/Force", // CLEAR THE ERROR NAME
                                        tier: 'LOW',
                                        recommendedModel: 'TinyLlama-1.1B-Chat-v0.4-q4f32_1-MLC',
                                        isForced: true
                                    } as HardwareSpecs;
                                    setSpecs(forcedSpecs);
                                    onComplete(forcedSpecs);
                                }}
                                className="w-full mt-2 bg-red-600 hover:bg-green-600 text-white font-bold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-colors shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                            >
                                <span className="animate-pulse">☢️</span> FORZAR INICIO
                            </button>
                            <div className="text-[7px] text-center mt-1 opacity-50 text-red-100">Ignorar seguridad (Riesgo de Crash)</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
