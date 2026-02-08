"use client";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const FAQS = [
    {
        q: "¿Es realmente gratis?",
        a: "Sí. El núcleo de ÉTER es código abierto. No cobramos suscripción porque tú pones el hardware (tu dispositivo). Al eliminar los servidores centrales costosos, eliminamos la necesidad de cobrarte una mensualidad."
    },
    {
        q: "¿Mis datos están seguros si uso la red P2P?",
        a: "Absolutamente. Usamos encriptación de extremo a extremo (E2EE) de grado militar. Cuando compartes algo, viaja por un túnel seguro directo al receptor. Nadie en el medio, ni nosotros, ni tu proveedor de internet, puede ver el contenido."
    },
    {
        q: "¿Qué diferencia hay con ChatGPT o Claude?",
        a: "Ellos son 'Nube' (tus datos van a sus servidores). ÉTER es 'Local' (la IA vive en tu dispositivo). Ellos poseen tu inteligencia; con ÉTER, tú eres el dueño. Además, ÉTER funciona sin internet, ellos no."
    },
    {
        q: "¿Necesito un ordenador muy potente?",
        a: "No necesariamente. Hemos optimizado nuestros modelos para funcionar en laptops modernas y teléfonos de gama media-alta. Gracias a WebGPU, aprovechamos al máximo lo que ya tienes."
    },
    {
        q: "¿Puedo compartir mi internet con otros?",
        a: "En la Fase 3 de nuestro Roadmap, sí. Estamos construyendo una red en malla donde podrás compartir de forma segura y anónima tu ancho de banda, potencialmente ganando recompensas por ayudar a expandir la red."
    },
    {
        q: "¿Es legal usar esto?",
        a: "Totalmente. ÉTER es una herramienta tecnológica neutral, como un navegador web o un cliente de correo. Defendemos tu derecho a la privacidad y a la libre comunicación, derechos protegidos internacionalmente."
    },
    {
        q: "¿Cómo te encuentra entre millones de usuarios sin servidor?",
        a: "No buscamos tu IP, sino tu 'Alma' criptográfica (Soul). Usamos una red de propagación inteligente donde los mensajes saltan de vecino en vecino (como el rumor en una fiesta) encontrando la ruta más corta hasta ti, sin necesidad de una lista central."
    },
    {
        q: "¿Funciona REALMENTE sin internet?",
        a: "SÍ. Puedes usar el 'Modo Café' para chatear con personas en tu mismo WiFi (incluso si el router no tiene internet). Además, tus mensajes se guardan en el 'Modo Avión' y se disparan automáticamente en cuanto detectan una señal o nodo cercano."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="relative z-10 w-full max-w-4xl mx-auto px-6 py-24">
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-center mb-16"
            >
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Preguntas Recurrentes</h2>
                <p className="text-white/50">Todo lo que necesitas saber antes de dar el salto.</p>
            </motion.div>

            <div className="space-y-4">
                {FAQS.map((faq, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className={clsx(
                            "border rounded-xl transition-all duration-300 overflow-hidden group",
                            openIndex === i
                                ? "bg-white/10 border-eter-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                        )}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full text-left p-6 flex justify-between items-center text-lg font-medium text-white/90 group-hover:text-white transition-colors"
                        >
                            {faq.q}
                            <span className={clsx("text-2xl transition-transform duration-300 text-eter-cyan", openIndex === i ? "rotate-45" : "rotate-0")}>
                                +
                            </span>
                        </button>

                        <AnimatePresence>
                            {openIndex === i && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                >
                                    <div className="p-6 pt-0 text-white/60 leading-relaxed border-t border-white/5">
                                        {faq.a}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
