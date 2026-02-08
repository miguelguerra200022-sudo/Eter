"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#030305] text-white px-6 py-12">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <Link href="/" className="inline-block text-eter-cyan hover:text-white transition-colors mb-8">
                        ← Volver al Inicio
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        Política de Privacidad Zero-Knowledge
                    </h1>
                    <p className="text-white/50">Última actualización: Febrero 2026</p>
                </motion.div>

                {/* Alert Box */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mb-12 p-8 border-2 border-eter-cyan bg-eter-cyan/10 rounded"
                >
                    <h2 className="text-2xl font-bold text-eter-cyan mb-4">
                        🔒 Declaración de Autonomía Digital
                    </h2>
                    <p className="text-white text-lg leading-relaxed">
                        ÉTER <strong>no recopila, no almacena, no rastrea y no vende</strong> ningún dato personal.
                        Esta no es una promesa: es una imposibilidad arquitectónica.
                        Todo el procesamiento ocurre en <strong>su dispositivo</strong>.
                        Jamás abandonará su navegador sin su consentimiento explícito.
                    </p>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-8 text-white/70 leading-relaxed"
                >

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">1. ¿Qué NO Recopilamos?</h2>
                        <p className="mb-4">La lista completa:</p>
                        <ul className="list-disc list-inside space-y-2 ml-4">
                            <li><strong>Datos personales:</strong> Nombre, email, teléfono, dirección (nunca solicitados).</li>
                            <li><strong>Historial de conversaciones:</strong> Sus chats con la IA se almacenan solo en IndexedDB local.</li>
                            <li><strong>Cookies de rastreo:</strong> No usamos cookies. Este sitio es completamente funcional sin ellas.</li>
                            <li><strong>Dirección IP:</strong> No registramos IPs en servidores (no hay servidores para eso).</li>
                            <li><strong>Metadata de navegación:</strong> No usamos Google Analytics, Facebook Pixel, ni herramientas similares.</li>
                            <li><strong>Datos P2P:</strong> La red Gun.js sincroniza estados anónimamente sin vincular identidades.</li>
                        </ul>
                        <p className="text-eter-cyan/80 italic mt-4">
                            En términos simples: NADA. Literalmente nada.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">2. ¿Cómo Funciona el Procesamiento Local?</h2>
                        <p>
                            ÉTER utiliza <strong>WebLLM</strong>, una implementación de modelos de lenguaje que se ejecutan directamente en su navegador mediante:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                            <li><strong>WebGPU:</strong> API de aceleración gráfica para inferencia rápida.</li>
                            <li><strong>WebAssembly (fallback):</strong> Si no hay GPU compatible, usa CPU.</li>
                            <li><strong>IndexedDB:</strong> Almacenamiento local del navegador para el modelo y el historial de chat.</li>
                        </ul>
                        <p className="mt-4">
                            Resultado: <strong>Ningún dato sale de su navegador</strong>. Ni siquiera podríamos acceder a él si quisiéramos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">3. Red P2P y Anonimato</h2>
                        <p>
                            La sincronización de "usuarios conectados" se realiza mediante <strong>Gun.js</strong>, un protocolo P2P que:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                            <li>Asigna IDs temporales de sesión (sin vinculación a identidades reales).</li>
                            <li>Transmite únicamente "pulsos de presencia" (timestamps anónimos).</li>
                            <li>No almacena historiales de conexión.</li>
                        </ul>
                        <p className="mt-4 text-white/50">
                            <strong>Nota:</strong> Los nodos públicos de Gun.js (relays) pueden registrar IPs por motivos técnicos,
                            pero estos no están bajo nuestro control ni son vinculados a su identidad por ÉTER.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">4. Compartir con Terceros</h2>
                        <p className="text-2xl font-mono text-eter-cyan">
                            NO APLICABLE.
                        </p>
                        <p className="mt-4">
                            No tenemos datos que compartir. No hay análisis con terceros, no hay publicidad dirigida, no hay monetización de datos.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">5. Derechos del Usuario</h2>
                        <p>
                            Dado que usted controla todos los datos (están en su navegador), usted tiene:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                            <li><strong>Derecho a borrar:</strong> Limpie IndexedDB desde las herramientas de desarrollador de su navegador.</li>
                            <li><strong>Derecho a exportar:</strong> Acceda a sus datos locales mediante la consola del navegador.</li>
                            <li><strong>Derecho a desconectarse:</strong> Cierre la pestaña. Eso es todo.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">6. Cumplimiento Legal</h2>
                        <p>
                            ÉTER cumple con:
                        </p>
                        <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
                            <li><strong>GDPR (UE):</strong> No procesamos datos personales, por lo tanto estamos exentos de la mayoría de obligaciones.</li>
                            <li><strong>CCPA (California):</strong> No vendemos datos porque no los recopilamos.</li>
                        </ul>
                        <p className="mt-4 text-white/50">
                            Si alguna autoridad reguladora solicita datos de usuarios, nuestra respuesta será:
                            <em>"No tenemos acceso a esa información por diseño".</em>
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">7. Cambios a Esta Política</h2>
                        <p>
                            Si cambiamos esta política (altamente improbable dada nuestra arquitectura),
                            publicaremos la versión actualizada en esta página con una nueva fecha de actualización.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">8. Contacto</h2>
                        <p>
                            Para preguntas sobre privacidad, contacte a: <br />
                            <a href="mailto:privacy@eter.network" className="text-eter-cyan hover:underline">privacy@eter.network</a>
                        </p>
                    </section>

                    <div className="mt-12 p-6 border border-eter-cyan/30 bg-black/50 rounded">
                        <p className="text-white/90 text-lg">
                            <strong>Filosofía ÉTER:</strong> La mejor privacidad es aquella que no requiere confianza.
                            No confíe en nosotros: <strong>verifique el código</strong>.
                            Toda la lógica de la aplicación es de código abierto.
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
                    <Link href="/legal/terms" className="text-white/50 hover:text-white transition-colors">
                        ← Términos de Servicio
                    </Link>
                    <Link href="/docs/whitepaper" className="text-eter-cyan hover:text-white transition-colors">
                        Whitepaper Técnico →
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
