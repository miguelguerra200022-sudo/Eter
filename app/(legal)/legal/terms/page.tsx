"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TermsPage() {
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
                        Términos de Servicio
                    </h1>
                    <p className="text-white/50">Última actualización: Febrero 2026</p>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert prose-cyan max-w-none"
                >
                    <div className="space-y-8 text-white/70 leading-relaxed">

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de Términos</h2>
                            <p>
                                Al acceder y utilizar ÉTER ("el Servicio"), usted acepta estar legalmente vinculado por estos Términos de Servicio.
                                Si no está de acuerdo con estos términos, no utilice el Servicio.
                            </p>
                            <p className="text-eter-cyan/80 italic">
                                En términos simples: Al entrar, aceptas. Si no, sal.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
                            <p>
                                ÉTER es una red de inteligencia artificial descentralizada que opera mediante:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li><strong>Procesamiento Local:</strong> Toda la inferencia de IA ocurre en su dispositivo mediante WebGPU/WebAssembly.</li>
                                <li><strong>Red P2P:</strong> La sincronización de estados utiliza Gun.js, una base de datos descentralizada.</li>
                                <li><strong>Zero-Knowledge:</strong> No almacenamos, registramos ni monitoreamos sus datos o interacciones.</li>
                            </ul>
                            <p className="text-eter-cyan/80 italic mt-4">
                                En términos simples: Tu computadora hace todo. Nosotros no vemos nada.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">3. Privacidad y Autonomía de Datos</h2>
                            <p>
                                ÉTER está diseñado bajo el principio de <strong>autonomía digital</strong>:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>No recopilamos datos personales.</li>
                                <li>No utilizamos cookies de rastreo.</li>
                                <li>No vendemos información a terceros (porque no tenemos acceso a ella).</li>
                                <li>Sus conversaciones con la IA nunca abandonan su navegador.</li>
                            </ul>
                            <p className="text-white/50 mt-4">
                                Para más detalles, consulte nuestra <Link href="/legal/privacy" className="text-eter-cyan hover:underline">Política de Privacidad</Link>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">4. Uso Aceptable</h2>
                            <p>Usted se compromete a:</p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>No utilizar el Servicio para actividades ilegales o que violen derechos de terceros.</li>
                                <li>No intentar atacar, comprometer o saturar la red P2P.</li>
                                <li>No distribuir malware o código malicioso a través de la red.</li>
                            </ul>
                            <p className="text-eter-cyan/80 italic mt-4">
                                En términos simples: No seas un idiota. No hackees. No jodas a otros.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">5. Propiedad Intelectual</h2>
                            <p>
                                El código fuente de ÉTER está disponible bajo licencia de código abierto (consulte el repositorio oficial).
                                La marca "ÉTER" y los activos visuales asociados son propiedad de <strong>ETER CORP.</strong>
                            </p>
                            <p className="text-white/50 mt-2">
                                © 2026 ETER CORP. Todos los derechos reservados.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">6. Limitación de Responsabilidad</h2>
                            <p>
                                El Servicio se proporciona <strong>"TAL CUAL" ("AS IS")</strong>, sin garantías de ningún tipo.
                                ETER CORP. no se hace responsable por:
                            </p>
                            <ul className="list-disc list-inside space-y-2 ml-4">
                                <li>Pérdida de datos (recuerde: todo es local, haga copias de seguridad).</li>
                                <li>Incompatibilidad con su hardware (WebGPU requiere navegadores y GPUs compatibles).</li>
                                <li>Contenido generado por el modelo de IA (las respuestas son no deterministas).</li>
                                <li>Interrupciones en la red P2P causadas por nodos maliciosos externos.</li>
                            </ul>
                            <p className="text-eter-cyan/80 italic mt-4">
                                En términos simples: Si algo sale mal, no nos demandes. Esto es experimental.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">7. Modificaciones a los Términos</h2>
                            <p>
                                Nos reservamos el derecho de modificar estos Términos en cualquier momento.
                                Los cambios entrarán en vigor inmediatamente tras su publicación.
                                El uso continuado del Servicio constituye aceptación de los nuevos términos.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">8. Ley Aplicable</h2>
                            <p>
                                Estos Términos se rigen por las leyes de la jurisdicción donde ETER CORP. esté registrada.
                                Cualquier disputa será resuelta mediante arbitraje vinculante.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">9. Contacto</h2>
                            <p>
                                Para consultas legales o comerciales, contacte a: <br />
                                <a href="mailto:legal@eter.network" className="text-eter-cyan hover:underline">legal@eter.network</a>
                            </p>
                        </section>

                        <div className="mt-12 p-6 border border-eter-purple/30 bg-eter-purple/10 rounded">
                            <p className="text-white/80">
                                <strong>Nota Final:</strong> ÉTER es un proyecto de investigación en autonomía digital.
                                Al usar este servicio, usted forma parte de un experimento en descentralización de IA.
                                Gracias por ser un iniciado.
                            </p>
                        </div>

                    </div>
                </motion.div>

                {/* Footer Navigation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16 pt-8 border-t border-white/10 flex justify-between items-center"
                >
                    <Link href="/legal/privacy" className="text-eter-cyan hover:text-white transition-colors">
                        Política de Privacidad →
                    </Link>
                    <Link href="/docs/whitepaper" className="text-white/50 hover:text-white transition-colors">
                        Whitepaper Técnico →
                    </Link>
                </motion.div>
            </div>
        </main>
    );
}
