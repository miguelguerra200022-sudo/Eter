"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function VisionPage() {
    const [mode, setMode] = useState<'simple' | 'technical'>('simple');

    return (
        <main className="min-h-screen bg-[#030305] text-white pt-24 pb-20 px-6 font-sans relative overflow-x-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-eter-cyan/10 via-black to-black opacity-40 z-0 pointer-events-none" />

            <div className="relative z-10 max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-mono text-eter-cyan mb-6"
                    >
                        MANIFIESTO V1.0
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40"
                    >
                        La Visión ÉTER
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
                    >
                        Entendiendo cómo democratizamos la inteligencia artificial para el 100% de la humanidad.
                    </motion.p>
                </div>

                {/* Mode Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="bg-white/5 border border-white/10 p-1 rounded-full flex relative">
                        {/* Background slider */}
                        <motion.div
                            className="absolute bg-eter-cyan/20 border border-eter-cyan/50 rounded-full h-[calc(100%-8px)] top-1"
                            layoutId="mode-highlight"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            style={{
                                width: '50%',
                                left: mode === 'simple' ? '4px' : 'calc(50% - 4px)'
                            }}
                        />

                        <button
                            onClick={() => setMode('simple')}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 ${mode === 'simple' ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
                        >
                            Explícamelo como a mi abuelo
                        </button>
                        <button
                            onClick={() => setMode('technical')}
                            className={`relative z-10 px-8 py-3 rounded-full text-sm font-bold transition-colors duration-300 ${mode === 'technical' ? 'text-eter-cyan' : 'text-white/40 hover:text-white/70'}`}
                        >
                            Modo Ingeniero (Hardcore)
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-12"
                    >
                        {mode === 'simple' ? <SimpleContent /> : <TechnicalContent />}
                    </motion.div>
                </AnimatePresence>

                {/* Call to Action */}
                <div className="mt-20 text-center border-t border-white/10 pt-12">
                    <h3 className="text-2xl font-bold mb-6">¿Listo para recuperar tu autonomía?</h3>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <Link href="/chat" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:scale-105 transition-transform">
                            Probar ÉTER Ahora
                        </Link>
                        <Link href="/" className="px-8 py-4 border border-white/20 hover:bg-white/5 transition-colors uppercase tracking-widest font-mono text-sm flex items-center justify-center">
                            Volver al Inicio
                        </Link>
                    </div>
                </div>

            </div>
        </main>
    );
}

// === SIMPLE CONTENT ("Abuelo") ===
function SimpleContent() {
    return (
        <div className="space-y-8">
            <Section
                title="1. El Cerebro en un Frasco"
                icon="🧠"
                content={
                    <>
                        <p>Imagina a la IA tradicional (como ChatGPT) como un bibliotecario al que tienes que llamar por teléfono cada vez que tienes una duda. Si se corta la línea (el internet), te quedas sin respuesta. Además, el bibliotecario anota todo lo que le preguntas.</p>
                        <p className="mt-4 font-bold text-white">ÉTER es diferente:</p>
                        <p>Nosotros clonamos al bibliotecario y lo metemos dentro de tu computadora. Ya se leyó todos los libros, así que no necesita llamar a nadie para responderte. Y como vive en tu casa, nadie más escucha lo que hablas con él.</p>
                    </>
                }
            />

            <Section
                title="2. El Videojuego"
                icon="🎮"
                content={
                    <>
                        <p>¿Recuerdas cuando comprabas un videojuego en disco? Una vez que lo tenías, podías jugar toda la vida sin conectarte a internet.</p>
                        <p>ÉTER funciona igual. Necesitas internet UN solo día para descargar el "cerebro" (el modelo de IA). A partir de ese momento, es tuyo para siempre. Puedes irte a una cabaña en la montaña sin señal, y tu IA seguirá escribiendo poemas, resumiendo textos y ayudándote.</p>
                    </>
                }
            />

            <Section
                title="3. La Red de Vecinos"
                icon="🤝"
                content={
                    <>
                        <p>En lugar de depender de una gran empresa central (como Google) que controla todo, ÉTER conecta a las personas directamente.</p>
                        <p>Imagina que quieres enviar una carta a tu vecino. En el sistema viejo, tenías que enviarla a la oficina central de correos en la capital, y ellos se la enviaban a tu vecino (y de paso leían tu carta). En ÉTER, tú simplemente le pasas la carta a tu vecino por la cerca.</p>
                        <p className="text-eter-cyan italic">Sin intermediarios. Sin espías. Solo personas conectadas.</p>
                    </>
                }
            />
        </div>
    );
}

// === TECHNICAL CONTENT ("Ingeniero") ===
function TechnicalContent() {
    return (
        <div className="space-y-8 font-mono text-sm md:text-base">
            <Section
                title="1. Arquitectura Local-First (WebLLM + WebGPU)"
                icon="⚡"
                content={
                    <>
                        <p>Ejecutamos modelos Llama-3 cuantizados (q4f16/q4f32) directamente en el navegador del cliente utilizando WebAssembly y WebGPU. Esto elimina la latencia de red para inferencia y garantiza privacidad absoluta por diseño (air-gap capable).</p>
                        <ul className="list-disc pl-5 mt-4 text-white/60 space-y-2">
                            <li><strong>Zero-Server Inference:</strong> Todo el cómputo ocurre en la GPU del usuario.</li>
                            <li><strong>Latencia Negativa:</strong> Sin round-trip al servidor.</li>
                            <li><strong>Persistencia:</strong> IndexedDB para almacenar pesos del modelo (1.2GB) y caché.</li>
                        </ul>
                    </>
                }
            />

            <Section
                title="2. Red P2P Descentralizada (Gun.js / WebRTC)"
                icon="🌐"
                content={
                    <>
                        <p>Sustituimos la base de datos centralizada (PostgreSQL/AWS) por un grafo distribuido criptográficamente seguro.</p>
                        <div className="bg-black/40 p-4 rounded border border-white/10 mt-4 overflow-x-auto">
                            <code>Usuario A &lt;--[WebRTC DataChannel]--&gt; Usuario B</code>
                        </div>
                        <p className="mt-4">Utilizamos DHT (Distributed Hash Tables) y algoritmos de chisme (gossip protocols) para sincronización de estado eventual consistente. No hay un "servidor maestro" que pueda ser apagado o censurado.</p>
                    </>
                }
            />

            <Section
                title="3. Federated Learning (Entrenamiento Distribuido)"
                icon="🤖"
                content={
                    <>
                        <p>El futuro de ÉTER incluye entrenamiento colaborativo sin exponer datos raw (raw data). Los dispositivos de los usuarios calculan gradientes localmente y solo comparten los vectores de actualización (weights updates) mediante Secure Aggregation.</p>
                        <p className="mt-2 text-eter-purple">Implementation: Differential Privacy (ε-DP) + Homomorphic Encryption.</p>
                        <p className="mt-4">Esto permite que la red se vuelva más inteligente cuanto más usuarios la usen, sin que ÉTER Inc. tenga acceso a una sola conversación privada.</p>
                    </>
                }
            />
        </div>
    );
}

function Section({ title, icon, content }: { title: string, icon: string, content: React.ReactNode }) {
    return (
        <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-eter-cyan/30 transition-colors duration-300">
            <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">{icon}</span>
                <h2 className="text-2xl font-bold text-white">{title}</h2>
            </div>
            <div className="text-white/70 leading-relaxed">
                {content}
            </div>
        </div>
    );
}
