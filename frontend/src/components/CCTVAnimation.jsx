import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

// ─── Phase Definitions ───────────────────────────────────────────────
// 0: Idle Monitoring  → navy/cyan HUD, scanning grid
// 1: Motion Detected  → yellow highlight, AI callout, shake
// 2: Threat Confirmed → red alert, siren, flashing
// 3: Safe / Branding  → success state

const CCTVAnimation = () => {
    const [phase, setPhase] = useState(0);
    const [scanY, setScanY] = useState(0);        // scanning line position 0-100%
    const [tick, setTick] = useState(0);           // forces re-render for live clock
    const videoRef = useRef(null);
    const alarmRef = useRef(null);

    // Live clock tick
    useEffect(() => {
        const id = setInterval(() => setTick(t => t + 1), 1000);
        return () => clearInterval(id);
    }, []);

    // Scanning line animation
    useEffect(() => {
        const id = setInterval(() => {
            setScanY(y => (y >= 100 ? 0 : y + 0.5));
        }, 20);
        return () => clearInterval(id);
    }, []);

    // Main sequence
    useEffect(() => {
        let cancelled = false;
        const run = async () => {
            while (!cancelled) {
                // Phase 0: Monitoring
                setPhase(0);
                if (videoRef.current) videoRef.current.playbackRate = 1.0;
                await delay(5000);
                if (cancelled) break;

                // Phase 1: Motion Detected
                setPhase(1);
                await delay(2500);
                if (cancelled) break;

                // Phase 2: Alarm
                setPhase(2);
                if (videoRef.current) videoRef.current.playbackRate = 1.3;
                if (alarmRef.current) { alarmRef.current.currentTime = 0; alarmRef.current.play().catch(() => { }); }
                await delay(4000);
                if (cancelled) break;

                if (alarmRef.current) alarmRef.current.pause();
                if (videoRef.current) videoRef.current.playbackRate = 1.0;

                // Phase 3: Safe
                setPhase(3);
                await delay(5000);
                if (cancelled) break;
            }
        };
        run();
        return () => { cancelled = true; };
    }, []);

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden bg-[#0A192F]" style={{ fontFamily: "'Courier New', monospace" }}>

            {/* ══════════════════════════════════════════
                ANIMATED CSS CORRIDOR BACKGROUND (fallback + layer)
            ══════════════════════════════════════════ */}
            <div className="absolute inset-0" style={{
                background: 'linear-gradient(135deg, #0A0F1E 0%, #0D1B2A 40%, #0A192F 70%, #060D1A 100%)',
            }}>
                {/* Simulated corridor depth lines */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 600" preserveAspectRatio="none">
                    {/* Vanishing point perspective lines */}
                    <line x1="500" y1="200" x2="0" y2="600" stroke="#64FFDA" strokeWidth="0.5" />
                    <line x1="500" y1="200" x2="1000" y2="600" stroke="#64FFDA" strokeWidth="0.5" />
                    <line x1="500" y1="200" x2="0" y2="0" stroke="#1E3A5F" strokeWidth="0.3" />
                    <line x1="500" y1="200" x2="1000" y2="0" stroke="#1E3A5F" strokeWidth="0.3" />
                    <line x1="500" y1="200" x2="200" y2="600" stroke="#1E3A5F" strokeWidth="0.3" />
                    <line x1="500" y1="200" x2="800" y2="600" stroke="#1E3A5F" strokeWidth="0.3" />
                    <line x1="500" y1="200" x2="350" y2="600" stroke="#1E3A5F" strokeWidth="0.2" />
                    <line x1="500" y1="200" x2="650" y2="600" stroke="#1E3A5F" strokeWidth="0.2" />
                    {/* Horizontal depth lines (floor/ceiling) */}
                    <line x1="0" y1="420" x2="1000" y2="420" stroke="#1E3A5F" strokeWidth="0.3" />
                    <line x1="0" y1="100" x2="1000" y2="100" stroke="#1E3A5F" strokeWidth="0.3" />
                    <line x1="100" y1="550" x2="900" y2="550" stroke="#64FFDA" strokeWidth="0.2" />
                    {/* Center vanishing glow */}
                    <circle cx="500" cy="200" r="100" fill="url(#corridorGlow)" />
                    <defs>
                        <radialGradient id="corridorGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#64FFDA" stopOpacity="0.08" />
                            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                </svg>
                {/* Ambient floor glow */}
                <div className="absolute bottom-0 left-0 right-0 h-32" style={{ background: 'linear-gradient(0deg, rgba(100,255,218,0.03) 0%, transparent 100%)' }} />
                {/* Ceiling light strip */}
                <div className="absolute top-0 left-1/4 right-1/4 h-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(100,255,218,0.4), transparent)', boxShadow: '0 0 20px rgba(100,255,218,0.2)' }} />
            </div>

            {/* ══════════════════════════════════════════
                1. REAL VIDEO BACKGROUND (place hero_bg.mp4 in /client/public/)
            ══════════════════════════════════════════ */}
            <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                autoPlay muted loop playsInline
                style={{
                    filter: phase === 2
                        ? 'brightness(0.35) contrast(1.4) saturate(0.3) hue-rotate(-10deg)'
                        : 'brightness(0.45) contrast(1.2) saturate(0.75)',
                    transition: 'filter 0.5s ease'
                }}
            >
                {/* High-quality placeholder security HUD video. Replace this URL or put hero_bg.mp4 in /client/public/ */}
                <source src="https://assets.mixkit.co/videos/preview/mixkit-cyber-hud-security-screen-138-large.mp4" type="video/mp4" />
            </video>

            {/* Night-vision tint */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    background: phase === 2
                        ? 'rgba(255, 0, 0, 0.04)'
                        : 'linear-gradient(135deg, rgba(10,25,47,0.3) 0%, rgba(0,255,200,0.02) 100%)',
                    transition: 'background 0.5s ease'
                }}
            />

            {/* ══════════════════════════════════════════
                2. SCANNING GRID OVERLAY
            ══════════════════════════════════════════ */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 10 }}>
                {/* Fine grid lines */}
                <svg width="100%" height="100%" className="absolute inset-0 opacity-10">
                    <defs>
                        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#64FFDA" strokeWidth="0.4" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Horizontal scanning line */}
                <motion.div
                    className="absolute left-0 right-0 h-px"
                    style={{
                        top: `${scanY}%`,
                        background: 'linear-gradient(90deg, transparent, #64FFDA, transparent)',
                        boxShadow: '0 0 12px #64FFDA, 0 0 24px rgba(100,255,218,0.3)',
                        opacity: phase === 2 ? 0.2 : 0.7,
                    }}
                />
            </div>

            {/* ══════════════════════════════════════════
                3. TOP STATUS BAR
            ══════════════════════════════════════════ */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-3"
                style={{
                    zIndex: 30,
                    background: 'linear-gradient(180deg, rgba(10,25,47,0.85) 0%, transparent 100%)',
                    borderBottom: '1px solid rgba(100,255,218,0.12)',
                }}>
                {/* Left: REC + Camera ID */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-2 h-2 rounded-full"
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            style={{ backgroundColor: phase >= 2 ? '#FF0000' : '#FF3B30' }}
                        />
                        <span style={{ color: '#64FFDA', fontSize: '10px', letterSpacing: '0.25em' }}>
                            {phase >= 2 ? 'ALARM ⚠' : 'REC'}
                        </span>
                    </div>
                    <span style={{ color: 'rgba(100,255,218,0.6)', fontSize: '10px', letterSpacing: '0.15em' }}>
                        CAM-07 // CORRIDOR_NORTH
                    </span>
                </div>

                {/* Center: Status */}
                <div className="flex items-center gap-2">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: phase === 0 ? '#00FF85' : phase === 1 ? '#FFD600' : phase === 2 ? '#FF3B30' : '#00FF85',
                            boxShadow: phase === 2 ? '0 0 8px #FF3B30' : '0 0 8px #00FF85',
                            transition: 'all 0.3s ease'
                        }}
                    />
                    <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px', letterSpacing: '0.2em' }}>
                        {phase === 0 ? 'MONITORING' : phase === 1 ? 'MOTION DETECTED' : phase === 2 ? 'INTRUDER ALERT' : 'AREA SECURED'}
                    </span>
                </div>

                {/* Right: Time + Date */}
                <div className="text-right">
                    <div style={{ color: '#64FFDA', fontSize: '13px', letterSpacing: '0.1em', fontWeight: 'bold' }}>{timeStr}</div>
                    <div style={{ color: 'rgba(100,255,218,0.5)', fontSize: '9px', letterSpacing: '0.1em' }}>{dateStr}</div>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                4. VIEWFINDER CORNERS
            ══════════════════════════════════════════ */}
            <div className="absolute inset-10 pointer-events-none" style={{ zIndex: 20 }}>
                {['top-0 left-0 border-t border-l', 'top-0 right-0 border-t border-r', 'bottom-0 left-0 border-b border-l', 'bottom-0 right-0 border-b border-r'].map((c, i) => (
                    <div key={i} className={`absolute w-8 h-8 ${c}`}
                        style={{ borderColor: phase === 2 ? 'rgba(255,60,48,0.8)' : 'rgba(100,255,218,0.5)', transition: 'border-color 0.3s ease' }}
                    />
                ))}
            </div>

            {/* ══════════════════════════════════════════
                5. MOTION DETECTION HUD BOX (Phase 1)
            ══════════════════════════════════════════ */}
            <AnimatePresence>
                {phase === 1 && (
                    <motion.div
                        key="detection-box"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ duration: 0.3 }}
                        className="absolute"
                        style={{
                            zIndex: 25,
                            top: '30%', left: '35%',
                            width: '30%', height: '45%',
                            border: '1.5px solid #FFD600',
                            boxShadow: '0 0 20px rgba(255,214,0,0.3), inset 0 0 20px rgba(255,214,0,0.04)',
                        }}
                    >
                        {/* Corner accents */}
                        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((p, i) => (
                            <div key={i} className={`absolute w-3 h-3 ${p}`}
                                style={{ border: '2px solid #FFD600', margin: '-1px' }}
                            />
                        ))}
                        {/* Label */}
                        <div className="absolute -top-5 left-0"
                            style={{ color: '#FFD600', fontSize: '9px', letterSpacing: '0.2em', background: 'rgba(10,25,47,0.9)', padding: '1px 6px' }}>
                            MOTION DETECTED
                        </div>
                        <div className="absolute -bottom-5 right-0"
                            style={{ color: '#FFD600', fontSize: '9px', letterSpacing: '0.15em', background: 'rgba(10,25,47,0.9)', padding: '1px 6px' }}>
                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                                ● ANALYZING...
                            </motion.span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════════
                6. INTRUDER DETECTED BOX (Phase 2)
            ══════════════════════════════════════════ */}
            <AnimatePresence>
                {phase === 2 && (
                    <motion.div
                        key="alert-box"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.7, 1] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        className="absolute"
                        style={{
                            zIndex: 25,
                            top: '28%', left: '33%',
                            width: '34%', height: '50%',
                            border: '2px solid #FF3B30',
                            boxShadow: '0 0 30px rgba(255,60,48,0.5), inset 0 0 30px rgba(255,60,48,0.06)',
                        }}
                    >
                        {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((p, i) => (
                            <div key={i} className={`absolute w-4 h-4 ${p}`}
                                style={{ border: '2.5px solid #FF3B30', margin: '-1px' }}
                            />
                        ))}
                        <div className="absolute -top-6 left-0"
                            style={{ color: '#FF3B30', fontSize: '10px', letterSpacing: '0.2em', fontWeight: 'bold', background: 'rgba(10,25,47,0.95)', padding: '2px 8px' }}>
                            ⚠ INTRUDER CONFIRMED
                        </div>
                        <div className="absolute -bottom-6 right-0"
                            style={{ color: '#FF3B30', fontSize: '9px', letterSpacing: '0.15em', background: 'rgba(10,25,47,0.95)', padding: '2px 8px' }}>
                            <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>
                                ALERT DISPATCHED ■
                            </motion.span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════════
                7. FULL-SCREEN ALARM FLASH (Phase 2)
            ══════════════════════════════════════════ */}
            <AnimatePresence>
                {phase === 2 && (
                    <motion.div
                        key="alarm-flash"
                        className="absolute inset-0 pointer-events-none"
                        style={{ zIndex: 15 }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.22, 0, 0.18, 0] }}
                        transition={{ duration: 1, repeat: Infinity }}
                    >
                        <div className="w-full h-full" style={{ background: 'radial-gradient(ellipse at center, rgba(255,60,48,0.6) 0%, rgba(255,60,48,0.15) 60%, transparent 100%)' }} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════════
                8. SIDE DATA PANEL (left)
            ══════════════════════════════════════════ */}
            <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-none" style={{ zIndex: 25 }}>
                {[
                    { label: 'ZONE', value: 'SECTOR_7' },
                    { label: 'RESOLUTION', value: '4K UHD' },
                    { label: 'FPS', value: '120' },
                    { label: 'NVR ID', value: 'NVR-04' },
                    { label: 'RANGE', value: '25m' },
                ].map(({ label, value }) => (
                    <div key={label}>
                        <div style={{ color: 'rgba(100,255,218,0.4)', fontSize: '8px', letterSpacing: '0.2em' }}>{label}</div>
                        <div style={{ color: '#64FFDA', fontSize: '11px', letterSpacing: '0.1em', fontWeight: 'bold' }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* ══════════════════════════════════════════
                9. SIDE DATA PANEL (right)
            ══════════════════════════════════════════ */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 pointer-events-none text-right" style={{ zIndex: 25 }}>
                {[
                    { label: 'SENSITIVITY', value: 'HIGH' },
                    { label: 'NIGHT VISION', value: 'ACTIVE' },
                    { label: 'AI ENGINE', value: 'v3.1' },
                    { label: 'ENCRYPT', value: 'AES-256' },
                    { label: 'UPTIME', value: '99.98%' },
                ].map(({ label, value }) => (
                    <div key={label}>
                        <div style={{ color: 'rgba(100,255,218,0.4)', fontSize: '8px', letterSpacing: '0.2em' }}>{label}</div>
                        <div style={{ color: '#64FFDA', fontSize: '11px', letterSpacing: '0.1em', fontWeight: 'bold' }}>{value}</div>
                    </div>
                ))}
            </div>

            {/* ══════════════════════════════════════════
                10. BOTTOM STATUS BAR
            ══════════════════════════════════════════ */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-6 py-3 pointer-events-none"
                style={{
                    zIndex: 30,
                    background: 'linear-gradient(0deg, rgba(10,25,47,0.85) 0%, transparent 100%)',
                    borderTop: '1px solid rgba(100,255,218,0.1)',
                }}>
                <span style={{ color: 'rgba(100,255,218,0.5)', fontSize: '9px', letterSpacing: '0.2em' }}>
                    ONEBEE INTELLIGENT SECURITY™
                </span>
                <div className="flex items-center gap-6">
                    <span style={{ color: 'rgba(100,255,218,0.4)', fontSize: '9px', letterSpacing: '0.15em' }}>LATENCY: 12ms</span>
                    <span style={{ color: 'rgba(100,255,218,0.4)', fontSize: '9px', letterSpacing: '0.15em' }}>SIGNAL: ████░ 80%</span>
                    <span style={{ color: 'rgba(100,255,218,0.4)', fontSize: '9px', letterSpacing: '0.15em' }}>IP: 192.168.1.7</span>
                </div>
            </div>

            {/* ══════════════════════════════════════════
                11. PHASE 3: SAFE / BRANDING
            ══════════════════════════════════════════ */}
            <AnimatePresence>
                {phase === 3 && (
                    <motion.div
                        key="safe-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2 }}
                        className="absolute inset-0 flex flex-col items-center justify-center"
                        style={{ zIndex: 40, background: 'rgba(10,25,47,0.88)', backdropFilter: 'blur(8px)' }}
                    >
                        <motion.div
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-center"
                        >
                            {/* Shield icon using CSS */}
                            <div className="mx-auto mb-6 flex items-center justify-center"
                                style={{ width: 64, height: 64, border: '2px solid #64FFDA', borderRadius: '50%', boxShadow: '0 0 30px rgba(100,255,218,0.3)' }}>
                                <span style={{ color: '#64FFDA', fontSize: '28px' }}>✓</span>
                            </div>
                            <motion.div
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                style={{ color: '#64FFDA', fontSize: '11px', letterSpacing: '0.35em', marginBottom: '12px' }}
                            >
                                AREA SECURED — THREAT NEUTRALIZED
                            </motion.div>
                            <h2 style={{ color: '#FFFFFF', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '0.2em', marginBottom: '8px', fontFamily: 'inherit' }}>
                                SMART<span style={{ color: '#64FFDA' }}>SECURE</span>
                            </h2>
                            <div style={{ height: '2px', width: '120px', background: 'linear-gradient(90deg, transparent, #64FFDA, transparent)', margin: '0 auto 16px' }} />
                            <p style={{ color: 'rgba(100,255,218,0.6)', fontSize: '11px', letterSpacing: '0.4em' }}>
                                AI-POWERED PROTECTION SYSTEMS
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ══════════════════════════════════════════
                12. FILM GRAIN OVERLAY
            ══════════════════════════════════════════ */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
                style={{ zIndex: 50, backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", mixBlendMode: 'overlay' }}
            />

            {/* Audio */}
            <audio ref={alarmRef} src="https://assets.mixkit.co/sfx/preview/mixkit-siren-emergency-alert-2537.mp3" preload="auto" loop />
        </div>
    );
};

const delay = ms => new Promise(r => setTimeout(r, ms));

export default CCTVAnimation;
