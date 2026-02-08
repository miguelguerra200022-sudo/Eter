// Core Voice Service using Web Speech API (Zero Dependency)

type VoiceState = 'idle' | 'listening' | 'speaking' | 'processing';

class VoiceService {
    private recognition: any | null = null;
    private synthesis: SpeechSynthesis | null = null;
    private isSupported: boolean = false;
    private onResultCallback: ((text: string) => void) | null = null;
    private onStateChangeCallback: ((state: VoiceState) => void) | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synthesis = window.speechSynthesis;

            // Check browser support for SpeechRecognition
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

            if (SpeechRecognition) {
                this.recognition = new SpeechRecognition();
                this.recognition.continuous = false; // Stop after one sentence
                this.recognition.interimResults = true; // Show words as they are spoken
                this.recognition.lang = 'es-ES'; // Default to Spanish

                this.recognition.onstart = () => this.notifyState('listening');
                this.recognition.onend = () => this.notifyState('idle');

                this.recognition.onresult = (event: any) => {
                    const transcript = Array.from(event.results)
                        .map((result: any) => result[0].transcript)
                        .join('');

                    if (this.onResultCallback) {
                        this.onResultCallback(transcript);
                    }

                    if (event.results[0].isFinal) {
                        this.notifyState('processing');
                    }
                };

                this.recognition.onerror = (event: any) => {
                    console.error("Voice Error:", event.error);
                    this.notifyState('idle');
                };

                this.isSupported = true;
            } else {
                console.warn("Speech Recognition not supported in this browser.");
            }
        }
    }

    public isCapable(): boolean {
        return this.isSupported;
    }

    public startListening(onResult: (text: string) => void, onStateChange?: (state: VoiceState) => void) {
        if (!this.recognition) return;

        // Stop current speech if any
        if (this.synthesis?.speaking) {
            this.synthesis.cancel();
        }

        this.onResultCallback = onResult;
        if (onStateChange) this.onStateChangeCallback = onStateChange;

        try {
            this.recognition.start();
        } catch (e) {
            // Already started?
            this.recognition.stop();
            setTimeout(() => this.recognition.start(), 100);
        }
    }

    public stopListening() {
        if (this.recognition) this.recognition.stop();
    }

    public speak(text: string) {
        if (!this.synthesis) return;

        this.synthesis.cancel(); // Stop anything else

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        // Try to find a good voice
        const voices = this.synthesis.getVoices();
        const spanishVoice = voices.find(v => v.lang.includes('es') && v.name.includes('Google')) || voices.find(v => v.lang.includes('es'));

        if (spanishVoice) utterance.voice = spanishVoice;

        utterance.onstart = () => this.notifyState('speaking');
        utterance.onend = () => this.notifyState('idle');

        this.synthesis.speak(utterance);
    }

    public silence() {
        this.synthesis?.cancel();
    }

    private notifyState(state: VoiceState) {
        if (this.onStateChangeCallback) this.onStateChangeCallback(state);
    }
}

export const voiceService = new VoiceService();
