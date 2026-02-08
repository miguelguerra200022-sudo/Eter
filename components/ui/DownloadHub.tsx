"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function DownloadHub() {
    const [platform, setPlatform] = useState<'win' | 'mac' | 'linux' | 'android' | 'ios' | 'unknown'>('unknown');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        // Platform detection
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('win')) setPlatform('win');
        else if (userAgent.includes('mac')) setPlatform('mac');
        else if (userAgent.includes('linux')) setPlatform('linux');
        else if (userAgent.includes('android')) setPlatform('android');
        else if (userAgent.includes('iphone') || userAgent.includes('ipad')) setPlatform('ios');

        // PWA Install Prompt Capture
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
        });
    }, []);

    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setDeferredPrompt(null);
            }
        } else {
            alert("Para instalar ÉTER: \n\n1. Abre el menú del navegador (...)\n2. Selecciona 'Instalar App' o 'Añadir a Pantalla de Inicio'.");
        }
    };

    const getIcon = () => {
        switch (platform) {
            case 'win': return "🪟";
            case 'mac': return "🍎";
            case 'linux': return "🐧";
            case 'android': return "🤖";
            case 'ios': return "🍏";
            default: return "💾";
        }
    };

    const getLabel = () => {
        switch (platform) {
            case 'win': return "Descargar para Windows";
            case 'mac': return "Descargar para Mac";
            case 'linux': return "Descargar para Linux";
            case 'android': return "Instalar en Android";
            case 'ios': return "Instalar en iOS";
            default: return "Descargar App";
        }
    };

    return (
        <section className="relative z-10 w-full py-20 px-6 bg-black/40 backdrop-blur-md border-y border-white/5">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8 text-white">Instalación Neural Nativa</h2>

                <div className="flex flex-col items-center gap-6">
                    {/* Primary Smart Button */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleInstall}
                        className="relative group px-10 py-5 bg-eter-cyan/10 border border-eter-cyan/50 rounded-xl overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-eter-cyan/20 blur-xl group-hover:opacity-100 opacity-0 transition-opacity duration-500" />
                        <div className="relative flex items-center gap-4">
                            <span className="text-4xl filter drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                                {getIcon()}
                            </span>
                            <div className="text-left">
                                <div className="text-xs text-eter-cyan font-mono uppercase tracking-widest">Recomendado</div>
                                <div className="text-xl font-bold text-white">{getLabel()}</div>
                            </div>
                        </div>
                    </motion.button>

                    <p className="text-white/30 text-sm max-w-md">
                        {platform === 'ios'
                            ? "En iOS: Toca el botón 'Compartir' y luego 'Añadir a Inicio'."
                            : platform === 'android'
                                ? "Versión PWA Optimizada con acceso a GPU local."
                                : "Instala la aplicación de escritorio para máximo rendimiento offline."}
                    </p>
                </div>

                {/* All Platforms Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 opacity-50 hover:opacity-100 transition-opacity duration-500">
                    {['Windows', 'Linux', 'Android', 'iOS'].map((os) => (
                        <div key={os} className="p-4 border border-white/5 rounded bg-white/5 hover:bg-white/10 transition-colors cursor-not-allowed" title="Autodetectado arriba">
                            <div className="text-white/40 text-xs uppercase tracking-widest mb-1">{os}</div>
                            <div className="text-white font-mono text-sm">v0.3.0 Ready</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
