'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Device } from '@twilio/voice-sdk';

interface Call {
    id: string;
    direction: 'inbound' | 'outbound';
    from: string;
    to: string;
    status: 'connecting' | 'ringing' | 'in-progress' | 'completed';
    duration: number;
    startTime: Date;
}

const FlexCallCenter: React.FC = () => {
    const [device, setDevice] = useState<Device | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [currentCall, setCurrentCall] = useState<any>(null);
    const [callStatus, setCallStatus] = useState<string>('Iniciando...');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [callHistory, setCallHistory] = useState<Call[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [agentStatus, setAgentStatus] = useState<'available' | 'busy' | 'offline'>('offline');
    const [error, setError] = useState<string>('');
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const initDevice = async () => {
            try {
                console.log('Inicializando Twilio Device...');
                const response = await fetch('/api/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ identity: 'agent' }),
                });

                const data = await response.json();

                if (data.error) {
                    console.error('Error getting token:', data.error);
                    setCallStatus('Error: Configuración de Twilio requerida');
                    setError(data.error);
                    return;
                }

                console.log(' Token obtenido correctamente');
                const newDevice = new Device(data.token, {
                    logLevel: 1,
                    codecPreferences: ['opus' as any, 'pcmu' as any],
                });

                newDevice.on('registered', () => {
                    console.log('Device registered - Listo para recibir llamadas');
                    setIsReady(true);
                    setAgentStatus('available');
                    setCallStatus('Listo para recibir llamadas');
                    setError('');
                });

                newDevice.on('error', (error) => {
                    console.error(' Device error:', error);
                    setCallStatus(`Error: ${error.message}`);
                    setError(error.message);
                });

                newDevice.on('incoming', (call) => {
                    console.log('Llamada entrante de:', call.parameters.From);
                    setCurrentCall(call);
                    setCallStatus(`LLAMADA ENTRANTE de ${call.parameters.From}`);
                    setAgentStatus('busy');

                    console.log(' Aceptando llamada automáticamente...');
                    setTimeout(() => {
                        call.accept();
                    }, 500);
                    call.on('accept', () => {
                        console.log(' Llamada aceptada');
                        setCallStatus('EN LLAMADA');
                        startCallDuration();
                        addToCallHistory({
                            id: Date.now().toString(),
                            direction: 'inbound',
                            from: call.parameters.From,
                            to: call.parameters.To || 'Agent',
                            status: 'in-progress',
                            duration: 0,
                            startTime: new Date(),
                        });
                    });

                    call.on('disconnect', () => {
                        console.log(' Llamada desconectada');
                        handleCallEnd();
                    });

                    call.on('cancel', () => {
                        console.log(' Llamada cancelada');
                        handleCallEnd();
                    });

                    call.on('reject', () => {
                        console.log(' Llamada rechazada');
                        handleCallEnd();
                    });
                });

                newDevice.register();
                setDevice(newDevice);
            } catch (error) {
                console.error(' Error initializing device:', error);
                setCallStatus('Error al inicializar');
                setError(String(error));
            }
        };

        initDevice();

        return () => {
            if (device) {
                device.destroy();
            }
            if (durationIntervalRef.current) {
                clearInterval(durationIntervalRef.current);
            }
        };
    }, []);

    const startCallDuration = () => {
        setCallDuration(0);
        durationIntervalRef.current = setInterval(() => {
            setCallDuration((prev) => prev + 1);
        }, 1000);
    };

    const stopCallDuration = () => {
        if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
        }
    };

    const handleCallEnd = () => {
        setCurrentCall(null);
        setCallStatus('Llamada finalizada');
        setAgentStatus('available');
        setIsMuted(false);
        stopCallDuration();

        setCallHistory((prev) =>
            prev.map((call, index) =>
                index === prev.length - 1
                    ? { ...call, status: 'completed', duration: callDuration }
                    : call
            )
        );

        setCallDuration(0);
        setTimeout(() => {
            setCallStatus('Listo para recibir llamadas');
        }, 2000);
    };

    const addToCallHistory = (call: Call) => {
        setCallHistory((prev) => [...prev, call]);
    };

    const hangUp = () => {
        if (currentCall) {
            currentCall.disconnect();
        }
    };

    const makeCall = async () => {
        if (!device || !phoneNumber) return;

        try {
            console.log(' Realizando llamada a:', phoneNumber);
            const call = await device.connect({ params: { To: phoneNumber } });
            setCurrentCall(call);
            setCallStatus(` Llamando a ${phoneNumber}...`);
            setAgentStatus('busy');

            call.on('accept', () => {
                setCallStatus('EN LLAMADA');
                startCallDuration();
                addToCallHistory({
                    id: Date.now().toString(),
                    direction: 'outbound',
                    from: 'Agent',
                    to: phoneNumber,
                    status: 'in-progress',
                    duration: 0,
                    startTime: new Date(),
                });
            });

            call.on('disconnect', () => {
                handleCallEnd();
            });
        } catch (error) {
            console.error('Error making call:', error);
            setCallStatus('Error al realizar llamada');
            setAgentStatus('available');
        }
    };

    const toggleMute = () => {
        if (currentCall) {
            currentCall.mute(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getStatusColor = () => {
        switch (agentStatus) {
            case 'available':
                return '#10b981';
            case 'busy':
                return '#ef4444';
            default:
                return '#6b7280';
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Simple Header */}
            <div style={{
                backgroundColor: '#1f2937',
                color: 'white',
                padding: '20px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>
                        Centro de Llamadas
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: getStatusColor(),
                                animation: agentStatus === 'available' ? 'pulse 2s infinite' : 'none'
                            }}></div>
                            <span style={{ fontSize: '14px' }}>
                                {agentStatus === 'available' ? 'Disponible' : agentStatus === 'busy' ? 'En llamada' : 'Desconectado'}
                            </span>
                        </div>
                        <a href="/" style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            backgroundColor: '#374151',
                            borderRadius: '6px',
                            fontSize: '14px'
                        }}>
                            Inicio
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>

                {/* Status Card */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '40px',
                    marginBottom: '30px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '80px', marginBottom: '20px' }}>
                        {currentCall ? 'CALL' : isReady ? 'READY' : 'LOADING'}
                    </div>
                    <h2 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '10px'
                    }}>
                        {callStatus}
                    </h2>
                    {currentCall && (
                        <div style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: '#3b82f6',
                            fontFamily: 'monospace',
                            marginTop: '20px'
                        }}>
                            {formatDuration(callDuration)}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div style={{
                            marginTop: '20px',
                            padding: '15px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '8px',
                            color: '#991b1b',
                            fontSize: '14px'
                        }}>
                            WARNING: {error}
                        </div>
                    )}

                    {/* Call Controls */}
                    {currentCall && (
                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center',
                            marginTop: '30px',
                            flexWrap: 'wrap'
                        }}>
                            <button
                                onClick={toggleMute}
                                style={{
                                    padding: '15px 30px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: isMuted ? '#fbbf24' : '#6b7280',
                                    color: 'white'
                                }}
                            >
                                {isMuted ? 'Unmute' : 'Mute'}
                            </button>
                            <button
                                onClick={hangUp}
                                style={{
                                    padding: '15px 30px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: '#ef4444',
                                    color: 'white'
                                }}
                            >
                                Hang Up
                            </button>
                        </div>
                    )}
                </div>

                {/* Make Call Card */}
                {!currentCall && isReady && (
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        padding: '30px',
                        marginBottom: '30px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                            Make Call
                        </h3>
                        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                            <input
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="+1234567890"
                                style={{
                                    flex: '1',
                                    minWidth: '200px',
                                    padding: '12px 16px',
                                    fontSize: '16px',
                                    border: '2px solid #d1d5db',
                                    borderRadius: '8px',
                                    outline: 'none'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
                            />
                            <button
                                onClick={makeCall}
                                disabled={!phoneNumber}
                                style={{
                                    padding: '12px 30px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: phoneNumber ? 'pointer' : 'not-allowed',
                                    backgroundColor: phoneNumber ? '#3b82f6' : '#9ca3af',
                                    color: 'white'
                                }}
                            >
                                Call
                            </button>
                        </div>
                        <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '10px' }}>
                            Ingresa un número con código de país (ej: +1234567890)
                        </p>
                    </div>
                )}

                {/* Configuration Notice */}
                {!isReady && agentStatus === 'offline' && (
                    <div style={{
                        backgroundColor: '#fef3c7',
                        borderRadius: '12px',
                        padding: '30px',
                        border: '2px solid #fbbf24'
                    }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'start' }}>
                            <div style={{ fontSize: '40px' }}>!</div>
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400e', marginBottom: '10px' }}>
                                    Configuración Requerida
                                </h3>
                                <p style={{ color: '#78350f', marginBottom: '15px' }}>
                                    Para recibir y realizar llamadas, necesitas configurar tus credenciales de Twilio.
                                </p>
                                <ol style={{ color: '#78350f', paddingLeft: '20px' }}>
                                    <li>Crea un archivo <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px' }}>.env.local</code></li>
                                    <li>Agrega tus credenciales de Twilio (ver <code style={{ backgroundColor: '#fff', padding: '2px 6px', borderRadius: '4px' }}>.env.example</code>)</li>
                                    <li>Reinicia el servidor de desarrollo</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                )}

                {/* Call History */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '30px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '20px', color: '#1f2937' }}>
                        Call History
                    </h3>
                    {callHistory.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>-</div>
                            <p>No hay llamadas registradas</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {callHistory.map((call) => (
                                <div
                                    key={call.id}
                                    style={{
                                        padding: '15px',
                                        backgroundColor: '#f9fafb',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                        <span style={{ fontSize: '24px' }}>
                                            {call.direction === 'inbound' ? 'IN' : 'OUT'}
                                        </span>
                                        <div>
                                            <p style={{ fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                                                {call.direction === 'inbound' ? call.from : call.to}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                                                {call.startTime.toLocaleTimeString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <span style={{
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backgroundColor: call.status === 'completed' ? '#d1fae5' : '#dbeafe',
                                            color: call.status === 'completed' ? '#065f46' : '#1e40af'
                                        }}>
                                            {call.status === 'completed' ? 'Completada' : 'En progreso'}
                                        </span>
                                        {call.status === 'completed' && (
                                            <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>
                                                {formatDuration(call.duration)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
        </div>
    );
};

export default FlexCallCenter;
