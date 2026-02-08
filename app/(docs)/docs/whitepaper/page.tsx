"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WhitepaperPage() {
    return (
        <main className="min-h-screen bg-[#030305] text-white px-6 py-12">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link href="/" className="inline-block text-eter-cyan hover:text-white transition-colors mb-8">
                        ← Volver al Inicio
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        ÉTER
                    </h1>
                    <h2 className="text-2xl md:text-4xl font-light text-white/70 mb-4">
                        Red Neural Descentralizada
                    </h2>
                    <p className="text-white/50">Technical Whitepaper v1.0 | Febrero 2026</p>
                </motion.div>

                {/* Abstract */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 p-8 border-l-4 border-eter-cyan bg-eter-cyan/5"
                >
                    <h3 className="text-xl font-bold text-eter-cyan mb-4">Abstract</h3>
                    <p className="text-white/80 leading-relaxed">
                        ÉTER es la primera implementación de una red de inteligencia artificial que opera de manera completamente descentralizada,
                        sin servidores centrales ni recopilación de datos. Mediante la combinación de <strong>procesamiento local (WebGPU)</strong>,
                        <strong>sincronización P2P (Gun.js)</strong> y <strong>modelos de lenguaje compactos (Llama 3.2)</strong>,
                        ÉTER devuelve el control de la IA a los usuarios, eliminando la dependencia de infraestructuras corporativas
                        y garantizando privacidad absoluta por diseño arquitectónico.
                    </p>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-12 text-white/70 leading-relaxed"
                >

                    {/* 1. Introduction */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4">1. Introducción</h2>
                        <h3 className="text-xl font-semibold text-white/90 mb-3">1.1 Motivación</h3>
                        <p className="mb-4">
                            La centralización de los modelos de IA en los últimos años ha creado un oligopolio tecnológico donde:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                            <li>Todas las consultas pasan por servidores corporativos (OpenAI, Google, Anthropic).</li>
                            <li>Los datos de los usuarios se utilizan para entrenamiento sin consentimiento explícito.</li>
                            <li>La censura y los sesgos son impuestos desde arriba.</li>
                            <li>El acceso requiere pagos recurrentes y conexión a internet.</li>
                        </ul>
                        <p>
                            ÉTER propone un modelo alternativo: <strong>IA autónoma</strong>, donde cada usuario es dueño absoluto de su infraestructura de inferencia.
                        </p>

                        <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">1.2 Objetivos</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Zero-Knowledge:</strong> Ningún dato del usuario debe abandonar su dispositivo sin consentimiento.</li>
                            <li><strong>Offline-First:</strong> La IA debe funcionar sin conexión una vez descargado el modelo.</li>
                            <li><strong>Open Source:</strong> Toda la lógica de la aplicación debe ser auditable.</li>
                            <li><strong>P2P Collaboration:</strong> Los usuarios deben poder sincronizar estados sin depender de servidores centrales.</li>
                        </ul>
                    </section>

                    {/* 2. Architecture */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4">2. Arquitectura del Sistema</h2>

                        <h3 className="text-xl font-semibold text-white/90 mb-3">2.1 Capa de Inferencia (WebLLM + WebGPU)</h3>
                        <p className="mb-4">
                            La inferencia de IA se ejecuta localmente mediante <strong>WebLLM</strong>, un framework que compila modelos de lenguaje
                            (formato GGUF/MLCEngine) para su ejecución en navegadores web.
                        </p>
                        <div className="bg-black/30 p-4 rounded border border-white/10 mb-4 font-mono text-sm">
                            <div className="text-eter-cyan">Tecnologías:</div>
                            <div className="ml-4 mt-2 text-white/60">
                                • Modelo: Llama-3.2-1B-Instruct (cuantizado a 4-bit)<br />
                                • Aceleración: WebGPU API (fallback: WebAssembly + SIMD)<br />
                                • Almacenamiento: IndexedDB (modelo + historial local)
                            </div>
                        </div>
                        <p className="mb-4">
                            <strong>Flujo de Inferencia:</strong>
                        </p>
                        <ol className="list-decimal list-inside space-y-2 ml-4 mb-4">
                            <li>Usuario ingresa prompt en la interfaz.</li>
                            <li>Web Worker procesa la solicitud fuera del hilo principal.</li>
                            <li>MLCEngine ejecuta el modelo en GPU mediante WebGPU.</li>
                            <li>La respuesta se devuelve sin tocar ningún servidor externo.</li>
                        </ol>

                        <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">2.2 Capa de Red (Gun.js P2P)</h3>
                        <p className="mb-4">
                            La sincronización de estados (ej: "usuarios conectados") utiliza <strong>Gun.js</strong>,
                            un protocolo de base de datos distribuida basado en CRDTs (Conflict-free Replicated Data Types).
                        </p>
                        <div className="bg-black/30 p-4 rounded border border-white/10 mb-4 font-mono text-sm">
                            <div className="text-eter-cyan">Características:</div>
                            <div className="ml-4 mt-2 text-white/60">
                                • Topología: Mesh descentralizado<br />
                                • Protocolo: WebSockets + WebRTC<br />
                                • Persistencia: Opcional (relays públicos)<br />
                                • Sincronización: Eventual consistency con CRDTs
                            </div>
                        </div>
                        <p>
                            Cada usuario emite "pulsos de presencia" anónimos que otros nodos escuchan.
                            No se transmiten conversaciones ni datos sensibles.
                        </p>

                        <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">2.3 Capa de Interfaz (Next.js 16 + React 19)</h3>
                        <p className="mb-4">
                            La aplicación web está construida con Next.js (App Router) y React 19 para una experiencia moderna:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>SSR/SSG:</strong> Renderizado inicial rápido.</li>
                            <li><strong>Animaciones:</strong> Framer Motion para transiciones fluidas.</li>
                            <li><strong>State Management:</strong> Zustand para gestión de estado global.</li>
                            <li><strong>Visuals:</strong> Canvas 2D + Three.js (adaptativo) para el Orbe central.</li>
                        </ul>
                    </section>

                    {/* 3. Security & Privacy */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4">3. Seguridad y Privacidad</h2>

                        <h3 className="text-xl font-semibold text-white/90 mb-3">3.1 Modelo de Amenazas</h3>
                        <p className="mb-4">Consideramos tres vectores de ataque:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Ataque de Observador Pasivo:</strong> Un adversario que monitorea tráfico de red.</li>
                            <li><strong>Nodo Malicioso P2P:</strong> Un peer que intenta inyectar datos falsos.</li>
                            <li><strong>Compromiso del Cliente:</strong> Malware en el dispositivo del usuario.</li>
                        </ul>

                        <h3 className="text-xl font-semibold text-white/90 mb-3 mt-6">3.2 Mitigaciones</h3>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Contra Observador Pasivo:</strong> Todo el procesamiento es local. No hay tráfico saliente con datos sensibles.</li>
                            <li><strong>Contra Nodo Malicioso:</strong> Los datos P2P son efímeros (solo timestamps). La corrupción no afecta la inferencia local.</li>
                            <li><strong>Contra Compromiso del Cliente:</strong> Al ser una app web, el vector de ataque se limita al navegador (sandbox estándar).</li>
                        </ul>
                    </section>

                    {/* 4. Performance */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4">4. Rendimiento</h2>

                        <h3 className="text-xl font-semibold text-white/90 mb-3">4.1 Benchmarks de Inferencia</h3>
                        <div className="bg-black/30 p-4 rounded border border-white/10 mb-4 font-mono text-sm">
                            <div className="text-white/80">Hardware: GPU dedicada (NVIDIA RTX 3060)</div>
                            <div className="ml-4 mt-2 text-white/60">
                                • Velocidad: ~30 tokens/segundo<br />
                                • Latencia inicial: ~500ms (carga del modelo)<br />
                                • Memoria GPU: ~2.5GB
                            </div>
                            <div className="text-white/80 mt-4">Hardware: GPU integrada (Intel Iris Xe)</div>
                            <div className="ml-4 mt-2 text-white/60">
                                • Velocidad: ~8 tokens/segundo<br />
                                • Latencia inicial: ~1.2s<br />
                                • Memoria GPU: ~2GB
                            </div>
                            <div className="text-white/80 mt-4">Fallback: CPU (WebAssembly)</div>
                            <div className="ml-4 mt-2 text-white/60">
                                • Velocidad: ~2 tokens/segundo<br />
                                • Latencia inicial: ~3s
                            </div>
                        </div>
                        <p className="text-white/50">
                            <em>Nota: Los benchmarks son aproximados y varían según el hardware del usuario.</em>
                        </p>
                    </section>

                    {/* 5. Use Cases */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4">5. Casos de Uso</h2>
                        <ul className="space-y-4">
                            <li>
                                <strong className="text-white">5.1 Chat Privado sin Censura:</strong>
                                <p className="ml-4 mt-2">
                                    Consultas sobre temas sensibles (salud, legal, política) sin riesgo de vigilancia corporativa.
                                </p>
                            </li>
                            <li>
                                <strong className="text-white">5.2 Asistente Offline:</strong>
                                <p className="ml-4 mt-2">
                                    Una vez descargado el modelo, funciona sin conexión (viajes, zonas sin internet).
                                </p>
                            </li>
                            <li>
                                <strong className="text-white">5.3 Educación Descentralizada:</strong>
                                <p className="ml-4 mt-2">
                                    Estudiantes en regiones con censura pueden acceder a IA sin depender de infraestructura externa.
                                </p>
                            </li>
                        </ul>
                    </section>

                    {/* 6. Roadmap */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4">6. Roadmap</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold text-eter-cyan">Q1 2026 (Actual)</h3>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Beta pública (web)</li>
                                    <li>Soporte multi-idioma (ES/EN)</li>
                                    <li>Integración P2P básica</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-eter-cyan">Q2 2026</h3>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Aplicación móvil (React Native)</li>
                                    <li>Sincronización de historial P2P encriptado</li>
                                    <li>Soporte para modelos más grandes (3B-7B)</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-eter-cyan">Q3-Q4 2026</h3>
                                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                                    <li>Federación de nodos (usuarios pueden hostear relays privados)</li>
                                    <li>Multimodalidad (visión + texto)</li>
                                    <li>Sistema de reputación P2P</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    {/* 7. Conclusion */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4">7. Conclusión</h2>
                        <p className="mb-4">
                            ÉTER demuestra que es posible construir IA de producción sin sacrificar privacidad ni depender de infraestructuras centralizadas.
                            Al combinar WebGPU, Gun.js y modelos compactos, hemos creado una arquitectura que es:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                            <li><strong>Privada por diseño</strong> (ningún dato sale del navegador).</li>
                            <li><strong>Resistente a censura</strong> (sin puntos únicos de fallo).</li>
                            <li><strong>Accesible</strong> (solo requiere un navegador moderno).</li>
                        </ul>
                        <p>
                            Este es solo el comienzo. Invitamos a desarrolladores, investigadores y usuarios a unirse a la red y contribuir al futuro de la IA autónoma.
                        </p>
                    </section>

                    {/* References */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-4">Referencias</h2>
                        <ul className="space-y-2 text-sm text-white/60">
                            <li>[1] WebLLM Project - <a href="https://webllm.mlc.ai" className="text-eter-cyan hover:underline">https://webllm.mlc.ai</a></li>
                            <li>[2] Gun.js Documentation - <a href="https://gun.eco" className="text-eter-cyan hover:underline">https://gun.eco</a></li>
                            <li>[3] WebGPU Specification - <a href="https://gpuweb.github.io/gpuweb/" className="text-eter-cyan hover:underline">https://gpuweb.github.io/gpuweb/</a></li>
                            <li>[4] Llama 3.2 Models - Meta AI Research</li>
                        </ul>
                    </section>

                    {/* Footer */}
                    <div className="mt-12 p-6 border border-eter-purple/30 bg-black/50 rounded">
                        <p className="text-white/80">
                            <strong>Licencia:</strong> Este documento está disponible bajo Creative Commons BY-SA 4.0.<br />
                            <strong>Código Fuente:</strong> github.com/eter-network/eter-core (ficticio)<br />
                            <strong>Contacto:</strong> research@eter.network
                        </p>
                    </div>

                </motion.div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center"
                >
                    <Link href="/legal/privacy" className="text-white/50 hover:text-white transition-colors">
                        ← Política de Privacidad
                    </Link>
                    <Link href="/" className="text-eter-cyan hover:text-white transition-colors">
                        Volver al Inicio →
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
