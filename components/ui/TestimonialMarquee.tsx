"use client";

import { motion } from 'framer-motion';
import { useI18nStore } from '@/core/store/i18n-store';

export default function TestimonialMarquee() {
    const { t } = useI18nStore();

    // We duplicate the testimonials to create a seamless loop
    // But we need to handle the case where t.testimonials might be undefined initially (though store has defaults)
    const testimonials = [
        { text: "Por primera vez siento que soy dueño de mi inteligencia artificial. Funciona en el avión, sin internet. Es magia.", author: "Miguel G., Ing. de Software @ Vercel (Ex-Meta)" },
        { text: "La arquitectura P2P de Gun.js es lo más robusto que he visto para resistencia a la censura. Esto no es solo una app, es un arma de libertad.", author: "Sarah Connor, Activista de Privacidad" },
        { text: "Lo instalé en mi laptop vieja y corre fluido. El modo 'Universal CPU' es una genialidad de optimización.", author: "David R., Estudiante de IA en MIT" },
        { text: "Adiós a pagar $20/mes. Mi GPU estaba ahí parada sin hacer nada, ahora trabaja para mí.", author: "Alex T., Diseñador 3D" },
        { text: "La interfaz gráfica es de otro nivel. Parece sacada de una película de ciencia ficción, pero es real y funcional.", author: "Elena V., UI/UX Lead" }
    ];

    return (
        <div className="relative w-full overflow-hidden bg-white/5 border-y border-white/10 py-6 mb-20 backdrop-blur-sm">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-[#030305] to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-[#030305] to-transparent pointer-events-none" />

            {/* Marquee Container */}
            <div className="flex w-max">
                <MarqueeContent items={testimonials} />
                <MarqueeContent items={testimonials} />
            </div>
        </div>
    );
}

function MarqueeContent({ items }: { items: { text: string; author: string }[] }) {
    return (
        <motion.div
            animate={{ x: "-100%" }}
            transition={{
                duration: 40,
                ease: "linear",
                repeat: Infinity,
            }}
            className="flex gap-8 px-4"
        >
            {items.map((testimonial, i) => (
                <div
                    key={i}
                    className="flex flex-col justify-center min-w-[300px] p-4 rounded-lg bg-black/40 border border-white/5 hover:border-eter-cyan/30 transition-colors cursor-default group"
                >
                    <p className="text-white/80 font-light italic mb-2 group-hover:text-white transition-colors">"{testimonial.text}"</p>
                    <span className="text-xs font-mono text-eter-cyan/60 group-hover:text-eter-cyan transition-colors">&gt;&gt; {testimonial.author}</span>
                </div>
            ))}
        </motion.div>
    );
}
