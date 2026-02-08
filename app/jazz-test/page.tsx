"use client";

import { useAccount, useCoState } from "jazz-tools/react";
import { EterAccount } from "@/core/jazz/schema";

export default function JazzTestPage() {
    const me = useAccount(); // Returns the Account directly (or MaybeLoaded)
    // const profile = useCoState(EterAccount, me?.id);

    return (
        <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Estado de Conexión (Sandbox V3)</h2>
                <div className="grid grid-cols-2 gap-4 text-sm font-mono">
                    <div>
                        <span className="text-gray-400">Jazz ID:</span>
                        <span className="ml-2 text-green-400">{(me as any)?.id || "Cargando..."}</span>
                    </div>
                    <div>
                        <span className="text-gray-400">Estado:</span>
                        <span className="ml-2 text-blue-400">
                            {me ? "Autenticado" : "No Autenticado"}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-400">Debug:</span>
                        <pre className="text-[10px] text-gray-500 overflow-auto max-h-20">
                            {JSON.stringify(me, null, 2)}
                        </pre>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-200/80 text-xs">
                    Si ves esta página y el ID aparece, la integración básica de Jazz (v0.20.7) funciona correctamente en este entorno.
                </p>
            </div>
        </div>
    );
}
