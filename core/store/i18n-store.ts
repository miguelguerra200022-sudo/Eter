import { create } from 'zustand';

type Language = 'es' | 'en';

interface Translations {
    title: string;
    subtitle: string;
    initializing: string;
    inputPlaceholder: string;
    startButton: string;
    loadingCore: string;
    syncComplete: string;
    connectionError: string;
    footerText: string;

    // Landing Page
    landingHeroBase: string;
    landingHeroGradient: string;
    landingDesc: string;
    landingDescSpan: string;
    landingCTA: string;
    landingWhitepaper: string;
    testimonialsTitle: string;

    // Expanded
    problemTitle: string;
    problemDesc: string;
    solutionTitle: string;
    solutionDesc: string;
    howItWorksTitle: string;
    howItWorksSteps: { title: string; desc: string }[];
    featuresTitle: string;
    statsTitle: string;
    stats: { nodes: string; blocks: string; tps: string };
    manifestoTitle: string;
    manifestoText: string;

    // App Header
    manifestoLink: string;
    offlineReady: string;
    loadingModel: string;

    testimonials: { text: string; author: string }[];
}

const translations: Record<Language, Translations> = {
    es: {
        title: "É T E R",
        subtitle: "RED NEURAL DESCENTRALIZADA",
        initializing: "INICIALIZANDO ENLACE NEURAL...",
        inputPlaceholder: "Pregúntale a la Red...",
        startButton: "INICIAR SISTEMA",
        loadingCore: "Conectando al Núcleo Neural...",
        syncComplete: "Sincronización Completa",
        connectionError: "Error de Conexión Neural",
        footerText: "v0.3.0 // ENLACE NEURAL ACTIVO",

        landingHeroBase: "É T E",
        landingHeroGradient: "R",
        landingDesc: "La Última Red. Inteligencia Artificial Autónoma y Eterna.",
        landingDescSpan: "Tu dispositivo es el servidor. Tu mente es la llave. Bienvenido a la Resistencia Digital.",
        landingCTA: "CONECTAR AL ENLACE",
        landingWhitepaper: "Protocolo",
        testimonialsTitle: "La Red que Sobrevivirá al Apagón",

        // New Expanded Sections
        problemTitle: "La Nube Centralizada ha Fallado",
        problemDesc: "Tus datos son vendidos. Tu identidad es alquilada. Si el servidor se apaga, pierdes todo.",
        solutionTitle: "La Respuesta: Autonomía Radical",
        solutionDesc: "ÉTER devuelve el poder al borde. Sin intermediarios. Sin censura. Sin apagones.",

        howItWorksTitle: "Arquitectura Neural",
        howItWorksSteps: [
            { title: "1. Inicialización", desc: "Tu navegador descarga el núcleo de IA (WebLLM) y genera tu identidad cuántica." },
            { title: "2. Sincronización", desc: "Te conectas a otros pares vía WebRTC. La red Mesh se forma instantáneamente." },
            { title: "3. Persistencia", desc: "Tus pensamientos se replican en crifrado en el enjambre. Inmortalidad digital." }
        ],
        featuresTitle: "Infraestructura Post-Colapso",
        statsTitle: "Estado de la Red (Simulado)",
        stats: { nodes: "Nodos Activos", blocks: "Bloques Sincronizados", tps: "Ops/Seg" },

        manifestoTitle: "Manifiesto Cyberpunk 2026",
        manifestoText: "Creemos en un futuro donde la inteligencia no es propiedad de corporaciones, sino un derecho humano básico distribuido.",

        manifestoLink: "MANIFIESTO",
        offlineReady: "Offline Ready",
        loadingModel: "Cargando Motor Local...",

        testimonials: [
            { text: "Mi IA aprende conmigo y nadie puede borrarla.", author: "Anon-7x4f" },
            { text: "Si apagan Internet, ÉTER sigue funcionando localmente.", author: "Prepper_AI" },
            { text: "Cuantos más somos, más rápida se vuelve la red.", author: "Swarm_Node" },
            { text: "Privacidad real: Mis datos mentales nunca salen de mi SSD.", author: "Ghost_Shell" },
            { text: "Llama-3 corre nativo en mi navegador. Increíble.", author: "Tech_Viking" },
            { text: "El fin de la nube centralizada ha llegado.", author: "0xCipher" }
        ]
    },
    en: {
        title: "E T H E R",
        subtitle: "DECENTRALIZED NEURAL NETWORK",
        initializing: "INITIALIZING NEURAL LINK...",
        inputPlaceholder: "Ask the Hive...",
        startButton: "INITIATE SYSTEM",
        loadingCore: "Connecting to Neural Core...",
        syncComplete: "Synchronization Complete",
        connectionError: "Neural Connection Error",
        footerText: "v0.3.0 // NEURAL LINK ACTIVE",

        landingHeroBase: "E T H E",
        landingHeroGradient: "R",
        landingDesc: "The Last Network. Autonomous and Eternal Artificial Intelligence.",
        landingDescSpan: "Your device is the server. Your mind is the key. Welcome to the Digital Resistance.",
        landingCTA: "INITIATE LINK",
        landingWhitepaper: "Protocol",
        testimonialsTitle: "The Network That Survives The Blackout",

        // New Expanded Sections
        problemTitle: "The Centralized Cloud Has Failed",
        problemDesc: "Your data is sold. Your identity is rented. If the server goes dark, you lose everything.",
        solutionTitle: "The Answer: Radical Autonomy",
        solutionDesc: "ETHER returns power to the edge. No middlemen. No censorship. No blackouts.",

        howItWorksTitle: "Neural Architecture",
        howItWorksSteps: [
            { title: "1. Initialization", desc: "Your browser downloads the AI core (WebLLM) and generates your quantum identity." },
            { title: "2. Synchronization", desc: "You connect to peers via WebRTC. The Mesh network forms instantly." },
            { title: "3. Persistence", desc: "Your thoughts are replicated encrypted across the swarm. Digital immortality." }
        ],
        featuresTitle: "Post-Collapse Infrastructure",
        statsTitle: "Network Status (Simulated)",
        stats: { nodes: "Active Nodes", blocks: "Synced Blocks", tps: "Ops/Sec" },

        manifestoTitle: "Cyberpunk Manifesto 2026",
        manifestoText: "We believe in a future where intelligence is not corporate property, but a distributed basic human right.",

        manifestoLink: "MANIFESTO",
        offlineReady: "Offline Ready",
        loadingModel: "Loading Local Engine...",

        testimonials: [
            { text: "My AI learns with me and no one can save delete it.", author: "Anon-7x4f" },
            { text: "If the internet goes down, ETHER keeps running locally.", author: "Prepper_AI" },
            { text: "The more of us there are, the faster the network gets.", author: "Swarm_Node" },
            { text: "Real privacy: My mental data never leaves my SSD.", author: "Ghost_Shell" },
            { text: "Llama-3 running native in my browser. insane.", author: "Tech_Viking" },
            { text: "The end of the centralized cloud is here.", author: "0xCipher" }
        ]
    }
};

interface I18nState {
    language: Language;
    t: Translations;
    setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>((set) => ({
    language: 'es', // Default to Spanish as requested for user comms, but app supports EN
    t: translations['es'],
    setLanguage: (lang: Language) => set({ language: lang, t: translations[lang] })
}));
