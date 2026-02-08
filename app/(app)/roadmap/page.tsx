"use client";
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useRouter } from 'next/navigation';

const ROADMAP_ITEMS = [
    {
        phase: "FASE 1: EL DESPERTAR (ESTADO ACTUAL: VIVO)",
        period: "Q1 2026 - PRESENTE",
        color: "text-emerald-400",
        description: "El sistema ya está operativo. Hemos logrado ejecutar IA local en el navegador y establecer las bases de la red P2P.",
        techs: [
            {
                title: "IA Offline (WebGPU + CPU Fallback) ✅",
                desc: "IMPLEMENTADO. El motor neuronal corre 100% en tu dispositivo. Si tienes GPU dedicada, vuela. Si no, nuestro nuevo modo 'Universal CPU' garantiza acceso en cualquier laptop moderna.",
                vision: "Autonomía total. Tu hardware, tu inteligencia. Sin dependencias de APIs de terceros."
            },
            {
                title: "Interfaz Cinemática y Reactiva ✅",
                desc: "IMPLEMENTADO. Una experiencia de usuario premium con físicas de partículas, efectos magnéticos y transiciones fluidas (SPA) que demuestran que la privacidad no está reñida con la belleza.",
                vision: "Demostrar que el software libre puede ser más elegante y utilizable que el privativo."
            },
            {
                title: "Sincronización P2P (Gun.js) ⚡",
                desc: "EN PROCESO (BETA). Tus dispositivos ya pueden descubrirse en red local. Estamos activando los nodos repetidores para garantizar mensajes offline persistentes.",
                vision: "La nube eres tú. Tus datos fluyen libremente entre tus posesiones digitales."
            }
        ]
    },
    {
        phase: "FASE 2: LA CONEXIÓN (INTELIGENCIA COLECTIVA)",
        period: "Año 2027",
        color: "text-eter-cyan",
        description: "Una vez que somos autónomos, nos unimos. Creamos una red de colaboración donde compartimos conocimiento sin sacrificar privacidad.",
        techs: [
            {
                title: "Aprendizaje Federado (Federated Learning)",
                desc: "Tu IA aprende de tus interacciones y mejora. Luego, comparte esas mejoras matemáticas (gradientes) con la red global, pero NUNCA tus datos crudos. La red se vuelve más inteligente gracias a ti, sin saber quién eres.",
                vision: "Construir la primera Superinteligencia Democrática. Un cerebro global alimentado por millones de usuarios, que pertenece a todos y a nadie a la vez. El conocimiento se vuelve un bien común, no un secreto corporativo."
            },
            {
                title: "Mercado de Habilidades Neurales",
                desc: "Un ecosistema donde usuarios pueden crear y compartir 'micro-cerebros' o habilidades específicas (ej. un experto en leyes, un tutor de física) directamente con otros usuarios.",
                vision: "Descentralizar la educación y la especialización. Si tu IA aprende a diagnosticar problemas de coche, puede enseñar a la mía instantáneamente. Creamos una economía del conocimiento fluida y sin barreras."
            },
            {
                title: "Protocolo de Consenso de Verdad",
                desc: "Un sistema distribuido para verificar la veracidad de la información generada por la IA, utilizando múltiples nodos para cruzar referencias y detectar alucinaciones o sesgos.",
                vision: "Combatir la desinformación con consenso matemático. En lugar de un 'Ministerio de la Verdad' centralizado, confiamos en la validación cruzada de miles de nodos independientes."
            }
        ]
    },
    {
        phase: "FASE 3: LA EXPANSIÓN (RED MALLA GLOBAL)",
        period: "Año 2028-2029",
        color: "text-purple-500",
        description: "Rompemos la última barrera: la conectividad física. Internet deja de ser un servicio que alquilas y se convierte en un derecho que compartimos.",
        techs: [
            {
                title: "Enrutamiento Mesh (Malla) Inteligente",
                desc: "Cada dispositivo con ÉTER instalado actúa como un nodo repetidor. Si un usuario tiene acceso a internet, puede compartir su ancho de banda de forma segura y anonimizada con los dispositivos cercanos.",
                vision: "Internet indestructible y accesible para todos. Eliminar las 'zonas muertas' y la censura gubernamental. Si uno de nosotros tiene conexión, todos tenemos conexión. La red somos nosotros."
            },
            {
                title: "Tunelización Cuántica Resistente",
                desc: "Protocolos de comunicación diseñados para resistir la inspección profunda de paquetes (DPI) y bloqueos a nivel de ISP, utilizando técnicas de ofuscación avanzadas.",
                vision: "Garantizar el derecho a la libre comunicación en cualquier régimen o circunstancia. Una red que fluye como el agua, imposible de contener o bloquear por muros de fuego tradicionales."
            },
            {
                title: "Economía de Ancho de Banda (Tokenizada)",
                desc: "Un sistema opcional donde quienes comparten su conectividad (nodos de salida) son recompensados automáticamente por la red, incentivando la expansión de la infraestructura física.",
                vision: "Convertir la infraestructura de telecomunicaciones en un mercado justo y participativo. Tu router ya no es un gasto pasivo, es un activo que trabaja para ti y para la comunidad."
            }
        ]
    },
    {
        phase: "FASE 4: LA SINGULARIDAD DISTRIBUIDA",
        period: "Horizonte 2030+",
        color: "text-rose-500",
        description: "El destino final. Una simbiosis perfecta entre humanidad e inteligencia artificial distribuida, libre de control centralizado.",
        techs: [
            {
                title: "Identidad Autónoma Auto-Gestionada (DID)",
                desc: "Tu identidad digital deja de estar en manos de redes sociales o gobiernos. Se convierte en una prueba criptográfica matemática que tú controlas al 100%, válida en cualquier lugar del metaverso o la web.",
                vision: "Recuperar tu 'Yo' digital. Ser ciudadano de la red con derechos inalienables, no un usuario con términos y condiciones. La base para una sociedad digital verdaderamente libre."
            },
            {
                title: "Computación Planetaria",
                desc: "La capacidad de procesamiento ociosa de millones de dispositivos se une para resolver problemas científicos complejos (cura de enfermedades, modelos climáticos) mientras duermen.",
                vision: "Usar nuestros recursos para sanar al mundo, no para minar monedas inútiles. Convertir la red ÉTER en el superordenador más potente de la historia, dedicado al bienestar humano."
            }
        ]
    }
];

export default function RoadmapPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#050510] text-white relative overflow-hidden font-sans selection:bg-eter-cyan/30 pb-32">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-eter-cyan/5 to-transparent pointer-events-none" />

            {/* Nav Back */}
            <button
                onClick={() => router.back()}
                className="fixed top-6 left-6 z-50 p-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group"
            >
                <span className="group-hover:-translate-x-1 block transition-transform">←</span>
            </button>

            <div className="max-w-5xl mx-auto px-6 pt-32 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-24"
                >
                    <span className="font-mono text-eter-cyan text-xs tracking-[0.5em] uppercase mb-4 block">Plan Maestro 2026-2030</span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
                        EL FUTURO<br /><span className="text-eter-cyan">DESCENTRALIZADO</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed font-light">
                        No estamos construyendo solo una aplicación. Estamos construyendo <strong className="text-white font-medium">la infraestructura de la libertad digital</strong>.
                        Este es nuestro compromiso inquebrantable contig: devolverte el poder que te fue arrebatado.
                    </p>
                </motion.div>

                <div className="space-y-32">
                    {ROADMAP_ITEMS.map((section, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8, delay: 0.1 }}
                            className="relative"
                        >
                            {/* Phase Connector Line */}
                            {i !== ROADMAP_ITEMS.length - 1 && (
                                <div className="absolute left-4 md:left-[2rem] top-[4rem] bottom-[-9rem] w-px border-l border-dashed border-white/20 z-0 hidden md:block" />
                            )}

                            <div className="flex flex-col md:flex-row gap-12 mb-16 relative z-10">
                                <div className="md:w-1/4 pt-4">
                                    <div className={clsx("font-bold text-6xl opacity-20 font-mono mb-2", section.color)}>0{i + 1}</div>
                                    <div className={clsx("font-mono text-sm tracking-widest uppercase mb-2", section.color)}>
                                        {section.period}
                                    </div>
                                    <h2 className="text-3xl font-bold text-white mb-6 leading-tight">{section.phase.split(':')[1] || section.phase}</h2>
                                    <p className="text-white/50 text-sm leading-relaxed border-l-2 border-white/10 pl-4">
                                        {section.description}
                                    </p>
                                </div>

                                <div className="md:w-3/4 grid gap-8">
                                    {section.techs.map((tech, j) => (
                                        <div
                                            key={j}
                                            className="group relative bg-[#0A0A15] border border-white/5 hover:border-eter-cyan/30 rounded-xl p-8 transition-all duration-500 hover:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden"
                                        >
                                            <div className={clsx("absolute top-0 left-0 w-1 h-full transition-all duration-500 group-hover:bg-eter-cyan/50", section.color.replace('text-', 'bg-').replace('400', '500').replace('500', '600'))} />

                                            <div className="relative z-10">
                                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-eter-cyan transition-colors flex items-center gap-3">
                                                    {tech.title}
                                                </h3>
                                                <p className="text-base text-white/70 mb-6 leading-relaxed">
                                                    {tech.desc}
                                                </p>
                                                <div className="bg-white/5 rounded-lg p-4 border border-white/5">
                                                    <p className={clsx("text-sm italic font-medium opacity-80 flex gap-2", section.color)}>
                                                        <span className="not-italic">👁️‍🗨️</span> {tech.vision}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-40 text-center relative"
                >
                    <div className="absolute inset-0 bg-eter-cyan/20 blur-[100px] rounded-full pointer-events-none" />
                    <h2 className="text-4xl font-bold mb-8 relative z-10">¿Listo para ser parte de la historia?</h2>
                    <button
                        onClick={() => router.push('/chat')}
                        className="relative z-10 px-12 py-5 rounded-full bg-white text-black font-black tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_50px_rgba(255,255,255,0.4)] text-lg"
                    >
                        UNIRME A LA REVOLUCIÓN AHORA
                    </button>
                    <p className="mt-8 text-xs text-white/30 font-mono relative z-10 uppercase tracking-widest">
                        Protocolo ÉTER v1.0 — Iniciando Secuencia
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
