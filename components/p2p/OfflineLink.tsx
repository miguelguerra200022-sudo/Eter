'use client';
import { useState, useEffect, useRef } from 'react';
import QRCode from 'react-qr-code';
import { simplePeerService } from '@/core/p2p/simple-peer-service';
import { X, Camera, Smartphone, Copy, Check } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function OfflineLink({ onClose }: { onClose: () => void }) {
    const [role, setRole] = useState<'host' | 'guest' | null>(null);
    const [step, setStep] = useState(1);
    const [mySignal, setMySignal] = useState('');
    const [manualPeer, setManualPeer] = useState<{ signal: (data: string) => void } | null>(null);
    const [status, setStatus] = useState('');
    const [copied, setCopied] = useState(false);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    const handleScan = (data: string | null) => {
        if (!data) return;

        try {
            const signal = atob(data); // Decode Base64

            if (role === 'guest' && step === 1) {
                // Guest received Offer
                setStatus('Generando respuesta...');
                const mp = simplePeerService.createManualConnection(false, (answerData) => {
                    setMySignal(btoa(answerData));
                    setStatus('Muestra este código al anfitrión');
                    setStep(2);
                });
                setManualPeer(mp);
                // Inject the offer
                mp.signal(signal);
            }
            else if ((role === 'host' && (step === 1 || step === 2))) {
                // Host received Answer
                if (manualPeer) {
                    setStatus('Conectando...');
                    manualPeer.signal(signal);
                    onClose(); // Success!
                }
            }
        } catch (e) {
            console.error("QR Error", e);
            setStatus('Error al leer código. Intenta pegar el texto.');
        }
    };

    useEffect(() => {
        // Initialize Scanner when needed
        const needsScanner = (role === 'host' && step === 2) || (role === 'guest' && step === 1);

        if (needsScanner) {
            // Small timeout to ensure DOM is ready
            const timer = setTimeout(() => {
                if (document.getElementById('reader')) {
                    if (scannerRef.current) {
                        try { scannerRef.current.clear(); } catch (e) { }
                    }

                    const scanner = new Html5QrcodeScanner(
                        "reader",
                        { fps: 10, qrbox: { width: 250, height: 250 } },
                        false
                    );

                    scanner.render((decodedText) => {
                        handleScan(decodedText);
                        try { scanner.clear(); } catch (e) { }
                        scannerRef.current = null;
                    }, (error) => {
                        // console.warn(error);
                    });

                    scannerRef.current = scanner;
                }
            }, 500);
            return () => {
                clearTimeout(timer);
                if (scannerRef.current) {
                    try { scannerRef.current.clear(); } catch (e) { }
                }
            };
        }
    }, [role, step]);

    const startHost = () => {
        setRole('host');
        setStep(1);
        setStatus('Generando código de red...');
        const mp = simplePeerService.createManualConnection(true, (data) => {
            setMySignal(btoa(data)); // Base64 for smaller QR
            setStatus('Escanea este código con el otro teléfono');
        });
        setManualPeer(mp);
    };

    const startGuest = () => {
        setRole('guest');
        setStep(1);
        setStatus('Escanea el código del anfitrión');
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(mySignal);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-white/50 hover:text-white z-50">
                <X size={32} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-2">Conexión Offline (Air-Gapped)</h2>
            <p className="text-white/60 mb-8 text-center max-w-md">
                Conecta dos dispositivos sin internet ni servidores.
            </p>

            {/* SELECTION SCREEN */}
            {!role && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
                    <button
                        onClick={startHost}
                        className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 p-8 rounded-xl flex flex-col items-center gap-4 transition-all"
                    >
                        <Smartphone size={48} className="text-purple-400" />
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white">Soy el Anfitrión</h3>
                            <p className="text-white/50 text-sm mt-2">Crear una nueva red</p>
                        </div>
                    </button>

                    <button
                        onClick={startGuest}
                        className="bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/50 p-8 rounded-xl flex flex-col items-center gap-4 transition-all"
                    >
                        <Camera size={48} className="text-cyan-400" />
                        <div className="text-center">
                            <h3 className="text-xl font-bold text-white">Soy el Invitado</h3>
                            <p className="text-white/50 text-sm mt-2">Unirme a una red</p>
                        </div>
                    </button>
                </div>
            )}

            {/* HOST FLOW */}
            {role === 'host' && (
                <div className="flex flex-col items-center gap-6 w-full max-w-md">
                    {step === 1 && mySignal ? (
                        <>
                            <div className="bg-white p-4 rounded-xl">
                                <QRCode value={mySignal} size={256} />
                            </div>
                            <div className="text-center">
                                <p className="text-purple-300 font-bold mb-2">Paso 1: Muestra este código</p>
                                <p className="text-white/50 text-sm">El invitado debe escanear esto.</p>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="mt-4 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold w-full"
                            >
                                Ya lo escanearon → Escanear Respuesta
                            </button>
                        </>
                    ) : step === 2 ? (
                        <div className="w-full flex flex-col items-center">
                            <div id="reader" className="w-[300px] bg-black border border-white/20 rounded-lg overflow-hidden"></div>
                            <p className="text-white/50 text-xs mt-2">O pega el código abajo si la cámara falla:</p>
                        </div>
                    ) : (
                        <div className="text-white animate-pulse">Generando oferta...</div>
                    )}
                </div>
            )}

            {/* GUEST FLOW */}
            {role === 'guest' && (
                <div className="flex flex-col items-center gap-6 w-full max-w-md">
                    {step === 1 ? (
                        <div className="w-full flex flex-col items-center">
                            <div id="reader" className="w-[300px] bg-black border border-white/20 rounded-lg overflow-hidden"></div>
                            <p className="text-white/50 text-xs mt-2">O pega el código abajo si la cámara falla:</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded-xl">
                                <QRCode value={mySignal} size={256} />
                            </div>
                            <div className="text-center">
                                <p className="text-cyan-300 font-bold mb-2">Paso 2: Muestra tu respuesta</p>
                                <p className="text-white/50 text-sm">El anfitrión debe escanear esto para finalizar.</p>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* MANUAL FALLBACK INPUT (Always visible in scan steps) */}
            {((role === 'host' && step === 2) || (role === 'guest' && step === 1)) && (
                <textarea
                    placeholder="Pegar código manual aquí..."
                    className="w-full max-w-[300px] h-20 bg-white/5 border border-white/10 rounded-lg mt-4 p-2 text-xs text-white/70 focus:outline-none focus:border-purple-500/50"
                    onChange={(e) => handleScan(e.target.value)}
                />
            )}

            <div className="mt-8 text-white/30 text-xs font-mono max-w-md text-center break-all">
                {status}
            </div>

            {/* COPY BUTTON */}
            {mySignal && (
                <button onClick={copyToClipboard} className="mt-4 flex items-center gap-2 text-white/40 hover:text-white/80 transition-colors">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copiado' : 'Copiar código manual'}
                </button>
            )}
        </div>
    );
}
