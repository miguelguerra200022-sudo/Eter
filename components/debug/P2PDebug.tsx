"use client";
import { useEffect, useState } from 'react';
import { gunService } from '@/core/p2p/gun-service';

export const P2PDebug = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setLogs(gunService.logs);
        const unsub = gunService.onLog((log) => {
            setLogs(prev => [...prev.slice(-49), log]);
        });
        return unsub;
    }, []);

    if (!visible) {
        return (
            <button
                onClick={() => setVisible(true)}
                className="fixed bottom-2 left-2 z-[100] text-[8px] bg-red-500/20 text-red-400 px-2 py-1 rounded font-mono hover:bg-red-500/40"
            >
                DEBUG P2P
            </button>
        );
    }

    return (
        <div className="fixed bottom-2 left-2 z-[100] w-64 h-48 bg-black/90 border border-red-500/30 rounded font-mono text-[9px] text-green-400 p-2 overflow-y-auto">
            <div className="flex justify-between items-center mb-1 border-b border-white/10 pb-1">
                <span className="font-bold text-red-500">P2P NETWORK LOGS</span>
                <button onClick={() => setVisible(false)} className="text-white/50 hover:text-white">X</button>
            </div>
            {logs.map((L, i) => (
                <div key={i} className="whitespace-pre-wrap mb-0.5 border-b border-white/5 pb-0.5">
                    {L}
                </div>
            ))}
        </div>
    );
};
