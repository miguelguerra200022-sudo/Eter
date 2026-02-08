"use client";
import React, { useState } from 'react';
import { useP2PStore } from '@/core/store/p2p-store';
import { MagneticButton } from '@/components/ui/MagneticButton';

export const PrivateDM = () => {
    const { sendPrivateMessage } = useP2PStore();
    const [recipientPub, setRecipientPub] = useState("");
    const [msg, setMsg] = useState("");
    const [status, setStatus] = useState("");

    const handleSend = async () => {
        if (!recipientPub.trim() || !msg.trim()) {
            setStatus("❌ Debes escribir un mensaje y una Public Key válida.");
            return;
        }
        setStatus("📡 Buscando nodo destinatario...");
        try {
            await sendPrivateMessage(recipientPub, msg);
            setStatus("✅ Mensaje Encriptado y Enviado a la Red.");
            setMsg("");
        } catch (e) {
            setStatus("❌ Error de Red P2P.");
        }
    };

    return (
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 mt-4 backdrop-blur-md">
            <h3 className="text-xs font-bold text-eter-purple uppercase tracking-widest mb-2">Canal Privado (Direct Message)</h3>
            <div className="flex flex-col gap-2">
                <input
                    type="text"
                    placeholder="Pegar Public Key del Destinatario (PUB)"
                    value={recipientPub}
                    onChange={e => setRecipientPub(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white font-mono"
                />
                <textarea
                    placeholder="Mensaje secreto..."
                    value={msg}
                    onChange={e => setMsg(e.target.value)}
                    className="bg-black/40 border border-white/10 rounded px-3 py-2 text-xs text-white h-20 resize-none"
                />
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-white/50">{status}</span>
                    <MagneticButton onClick={handleSend} className="bg-eter-purple/20 text-eter-purple hover:bg-eter-purple/40 px-4 py-2 rounded text-xs font-bold transition-all">
                        ENVIAR DM
                    </MagneticButton>
                </div>
                <div className="mt-2 text-[9px] text-white/20 font-mono text-center">
                    * Nota: Bluetooth Mesh requiere adaptador Desktop Bridge (no disponible en navegador puro).
                </div>
            </div>
        </div>
    );
};
