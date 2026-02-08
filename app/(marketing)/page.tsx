"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useI18nStore } from '@/core/store/i18n-store';
import TestimonialMarquee from '@/components/ui/TestimonialMarquee';
import DownloadHub from '@/components/ui/DownloadHub';
import FAQ from '@/components/ui/FAQ';
import { ParticleBackground } from '@/components/ui/ParticleBackground';
import { MagneticButton } from '@/components/ui/MagneticButton';
import { useScroll, useTransform } from 'framer-motion';

// ... (Orb3D import remains same)
const Orb3D = dynamic(() => import('@/components/visuals/Orb3D'), {
    ssr: false,
    loading: () => <div className="w-full h-[500px] flex items-center justify-center"><div className="animate-pulse text-white/30">Cargando...</div></div>
});

export default function LandingPage() {
    const { t } = useI18nStore();
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]); // Orb moves slower
    const textY = useTransform(scrollY, [0, 500], [0, 100]); // Text moves even slower

    return (
        <main className="flex flex-col items-center bg-[#030305] text-white relative font-sans w-full overflow-x-hidden">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-eter-purple/20 via-black to-black opacity-40 z-0 pointer-events-none" />
            <ParticleBackground />

            {/* === HERO SECTION === */}
            <section className="relative z-10 flex flex-col items-center text-center min-h-[90vh] justify-center px-6 py-20 w-full mb-10">

                {/* Parallax Layer 1: Orb */}
                <motion.div
                    style={{ y }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, type: "spring" }}
                    className="w-full max-w-2xl mb-8 relative z-10"
                >
                    <Orb3D />
                </motion.div>

                {/* Parallax Layer 2: Text */}
                <motion.div
                    style={{ y: textY }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="relative z-20 mix-blend-screen"
                >
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                        {t.landingHeroBase} <span className="text-eter-cyan tracking-[0.2em] relative inline-block after:content-[''] after:absolute after:inset-0 after:bg-eter-cyan/20 after:blur-xl after:-z-10">{t.landingHeroGradient}</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="text-lg md:text-2xl text-white/70 max-w-2xl mb-12 font-light tracking-wide leading-relaxed backdrop-blur-sm bg-black/30 p-4 rounded-xl border border-white/5"
                >
                    {t.landingDesc} <br />
                    <span className="text-eter-cyan font-semibold drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">{t.landingDescSpan}</span>
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.5, type: "spring" }}
                    className="flex flex-col md:flex-row gap-6 items-center relative z-30"
                >
                    <Link href="/chat">
                        <MagneticButton className="group relative px-10 py-5 bg-white text-black font-black tracking-[0.2em] text-sm uppercase overflow-hidden hover:scale-105 transition-all duration-300 rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(0,240,255,0.6)]">
                            <span className="relative z-10 group-hover:text-black transition-colors">{t.landingCTA}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-eter-cyan via-white to-eter-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
                        </MagneticButton>
                    </Link>

                    <Link href="/roadmap">
                        <MagneticButton className="px-8 py-4 border border-eter-cyan/30 bg-eter-cyan/5 text-eter-cyan font-bold tracking-widest text-sm uppercase hover:bg-eter-cyan hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] backdrop-blur-md">
                            Vision 2030 🔮
                        </MagneticButton>
                    </Link>
                </motion.div>
            </section>

            {/* === PROBLEM / SOLUTION (SPLIT) === */}
            <section className="relative z-10 w-full py-24 bg-gradient-to-b from-black via-[#0a0a0c] to-black">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                    {/* Problem */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative p-8 border border-red-500/20 bg-red-900/5 rounded-2xl backdrop-blur-sm"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-20 text-red-500 text-6xl">⚠️</div>
                        <h3 className="text-2xl font-bold text-red-400 mb-4 font-mono tracking-widest uppercase">ERROR: CENTRALIZATION</h3>
                        <h2 className="text-4xl font-bold text-white mb-6">{t.problemTitle}</h2>
                        <p className="text-white/60 text-lg leading-relaxed">{t.problemDesc}</p>
                    </motion.div>

                    {/* Solution */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative p-8 border border-eter-cyan/30 bg-eter-cyan/5 rounded-2xl backdrop-blur-sm shadow-[0_0_50px_rgba(0,240,255,0.05)]"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-20 text-eter-cyan text-6xl">🛡️</div>
                        <h3 className="text-2xl font-bold text-eter-cyan mb-4 font-mono tracking-widest uppercase">SYSTEM: AUTONOMOUS</h3>
                        <h2 className="text-4xl font-bold text-white mb-6">{t.solutionTitle}</h2>
                        <p className="text-white/60 text-lg leading-relaxed">{t.solutionDesc}</p>
                    </motion.div>
                </div>
            </section>

            {/* === STATS / LIVE NETWORK === */}
            <section className="relative z-10 w-full py-12 border-y border-white/5 bg-white/5 backdrop-blur-md">
                <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <h3 className="text-white/40 text-sm font-mono tracking-widest uppercase mb-1">{t.statsTitle}</h3>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-green-400 font-mono text-sm">ONLINE</span>
                        </div>
                    </div>

                    <div className="flex gap-12 text-center">
                        <div>
                            <div className="text-3xl font-black text-white font-mono">1,024</div>
                            <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{t.stats?.nodes || "NODES"}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white font-mono">84.2M</div>
                            <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{t.stats?.blocks || "BLOCKS"}</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white font-mono">∞</div>
                            <div className="text-xs text-white/40 uppercase tracking-widest mt-1">{t.stats?.tps || "TPS"}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === HOW IT WORKS (STEPS) === */}
            <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-3xl md:text-5xl font-bold text-center mb-16 text-white/90"
                >
                    {t.howItWorksTitle}
                </motion.h2>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-[20%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-eter-cyan/30 to-transparent z-0" />

                    {(t.howItWorksSteps || []).map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="relative z-10 flex flex-col items-center text-center group"
                        >
                            <div className="w-16 h-16 rounded-full bg-black border border-eter-cyan/50 flex items-center justify-center text-xl font-bold text-eter-cyan mb-6 shadow-[0_0_20px_rgba(0,240,255,0.2)] group-hover:scale-110 transition-transform duration-300 group-hover:bg-eter-cyan group-hover:text-black">
                                {i + 1}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                            <p className="text-white/50 text-sm max-w-xs">{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* === FEATURES SECTION === */}
            <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 border-t border-white/5">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-center mb-4 text-white/90"
                >
                    {t.featuresTitle}
                </motion.h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                    {[
                        {
                            title: "Memoria Eterna",
                            desc: "Jazz Mesh garantiza que tus datos vivan para siempre en la red distribuida. Sin coste de almacenamiento central.",
                            icon: "♾️",
                            tech: "CRDT / CoValues"
                        },
                        {
                            title: "IA Autónoma",
                            desc: "Modelos Llama-3 corriendo 100% en tu navegador (WebGPU). Privacidad absoluta.",
                            icon: "🧠",
                            tech: "WebLLM / Local"
                        },
                        {
                            title: "Identidad Quantum",
                            desc: "Protección criptográfica ML-KEM-1024 resistente a computación cuántica.",
                            icon: "🔐",
                            tech: "NIST Level 5"
                        },
                        {
                            title: "Resistencia P2P",
                            desc: "Funciona sin internet (LAN/Bluetooth). Si cae la red global, nosotros seguimos.",
                            icon: "📡",
                            tech: "WebRTC / Mesh"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="p-6 border border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-sm hover:border-eter-cyan/50 hover:bg-white/10 transition-all duration-300 group rounded-xl relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-eter-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10">
                                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-eter-cyan transition-colors">{feature.title}</h3>
                                <p className="text-white/60 text-sm group-hover:text-white/90 transition-colors mb-4">{feature.desc}</p>
                                <span className="text-[10px] font-mono text-eter-cyan/60 border border-eter-cyan/20 px-2 py-1 rounded bg-eter-cyan/5 uppercase tracking-wider block w-fit">
                                    {feature.tech}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* === SOCIAL PROOF SECTION (MARQUEE) === */}
            <section className="relative z-10 w-full px-0 py-20 overflow-hidden bg-black/20">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-bold text-center mb-16 text-white/90"
                >
                    {t.testimonialsTitle}
                </motion.h2>

                <TestimonialMarquee />

            </section>

            {/* === MANIFESTO SNIPPET === */}
            <section className="relative z-10 w-full py-24 px-6 bg-[url('/grid.svg')] bg-center">
                <div className="max-w-4xl mx-auto text-center border border-eter-cyan/20 p-12 bg-black/80 backdrop-blur-xl rounded-3xl shadow-[0_0_100px_rgba(0,240,255,0.1)]">
                    <h2 className="text-eter-cyan font-mono tracking-[0.3em] uppercase mb-6 text-sm">
                        {t.manifestoTitle || "MANIFIESTO 2026"}
                    </h2>
                    <p className="text-2xl md:text-4xl font-light text-white leading-relaxed mb-10">
                        "{t.manifestoText}"
                    </p>
                    <Link href="/docs/whitepaper" className="inline-block px-8 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-eter-cyan hover:scale-105 transition-all duration-300 rounded-sm">
                        {t.manifestoLink} &rarr;
                    </Link>
                </div>
            </section>

            {/* === DOWNLOAD HUB SECTION === */}
            <DownloadHub />

            {/* === FAQ SECTION === */}
            <FAQ />

            {/* === FOOTER === */}
            <footer className="relative z-10 w-full border-t border-white/10 py-16 px-6 mt-20 bg-black/40 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">

                    {/* Brand */}
                    <div className="col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-black font-mono">É</div>
                            <span className="font-bold tracking-widest text-white">ÉTER</span>
                        </div>
                        <p className="text-white/40 text-xs leading-relaxed">
                            Construyendo la infraestructura para la autonomía digital humana. Sin servidores centrales. Sin censura.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="col-span-1 flex flex-col gap-4">
                        <h4 className="font-mono text-xs text-eter-cyan uppercase tracking-widest mb-2">Producto</h4>
                        <Link href="/chat" className="text-white/60 hover:text-white transition-colors text-sm">Iniciar Sistema</Link>
                        <Link href="/docs/features" className="text-white/60 hover:text-white transition-colors text-sm">Características</Link>
                        <Link href="/docs/security" className="text-white/60 hover:text-white transition-colors text-sm">Seguridad P2P</Link>
                    </div>

                    <div className="col-span-1 flex flex-col gap-4">
                        <h4 className="font-mono text-xs text-eter-cyan uppercase tracking-widest mb-2">Recursos</h4>
                        <Link href="/docs/whitepaper" className="text-white/60 hover:text-white transition-colors text-sm">Whitepaper</Link>
                        <Link href="https://github.com/eter-protocol" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm">Github (Soon)</Link>
                        <Link href="/docs/privacy" className="text-white/60 hover:text-white transition-colors text-sm">Privacidad</Link>
                    </div>

                    {/* VISIONARY LINK */}
                    <div className="col-span-1 flex flex-col justify-center">
                        <Link href="/roadmap" className="group relative p-6 border border-eter-cyan/30 rounded-xl bg-eter-cyan/5 hover:bg-eter-cyan/10 transition-all duration-300 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-eter-cyan/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <h4 className="text-eter-cyan font-bold tracking-widest mb-2 flex items-center gap-2">
                                VISION 2030 <span className="animate-pulse">🔮</span>
                            </h4>
                            <p className="text-xs text-white/70">
                                Descubre el plan maestro para descentralizar el mundo.
                            </p>
                            <div className="mt-4 text-xs font-mono text-eter-cyan/60 group-hover:text-eter-cyan transition-colors uppercase tracking-widest">
                                Ver Roadmap &rarr;
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-white/20 font-mono text-[10px]">
                        © 2026 ETER PROTOCOL. COPYLEFT (AGPLv3).
                    </div>
                </div>
            </footer>
        </main>
    );
}
