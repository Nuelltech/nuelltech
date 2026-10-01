'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Phone,
  MessageSquare,
  Mail,
  QrCode,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  ExternalLink,
  Check,
  Building2,
  MapPin,
  Globe,
} from 'lucide-react';
import { EmployeeData, generateVCardString } from '@/data/employees';

interface VirtualBusinessCardProps {
  employee: EmployeeData;
}

export default function VirtualBusinessCard({ employee }: VirtualBusinessCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrMode, setQrMode] = useState<'vcard' | 'url'>('vcard');
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [hasGyroscope, setHasGyroscope] = useState(false);
  const [needsIosPermission, setNeedsIosPermission] = useState(false);
  const [isIosPermissionGranted, setIsIosPermissionGranted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const gyroActiveRef = useRef(false);

  // Fallback avatar initials
  const initials = employee.fullName
    ? employee.fullName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase();

  // Helper to clamp values
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  // Handle Gyroscope Motion
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.beta === null || e.gamma === null) return;
    gyroActiveRef.current = true;
    setHasGyroscope(true);

    // Subtract 45deg from beta for natural hand holding angle
    const calibratedBeta = e.beta - 45;
    const rotateX = clamp(-calibratedBeta * 0.7, -16, 16);
    const rotateY = clamp(e.gamma * 0.7, -16, 16);

    const glareX = clamp(50 + (e.gamma / 30) * 50, 0, 100);
    const glareY = clamp(50 + (calibratedBeta / 30) * 50, 0, 100);

    setTilt({
      rotateX,
      rotateY,
      glareX,
      glareY,
    });
  }, []);

  // Request iOS permission for device orientation
  const requestIosPermission = async () => {
    try {
      const DeviceOrientationEventAny = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<'granted' | 'denied'>;
      };

      if (typeof DeviceOrientationEventAny.requestPermission === 'function') {
        const response = await DeviceOrientationEventAny.requestPermission();
        if (response === 'granted') {
          setIsIosPermissionGranted(true);
          setNeedsIosPermission(false);
          window.addEventListener('deviceorientation', handleOrientation);
        }
      }
    } catch (err) {
      console.error('Erro ao pedir permissão de giroscópio:', err);
    }
  };

  useEffect(() => {
    const DeviceOrientationEventAny = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };

    if (
      typeof window !== 'undefined' &&
      typeof DeviceOrientationEventAny !== 'undefined' &&
      typeof DeviceOrientationEventAny.requestPermission === 'function'
    ) {
      setNeedsIosPermission(true);
    } else if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
    };
  }, [handleOrientation]);

  // Pointer/Mouse movement fallback
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (gyroActiveRef.current) return; // Prioritize gyroscope if active
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const rotateX = clamp(-percentY * 14, -14, 14);
    const rotateY = clamp(percentX * 14, -14, 14);

    const glareX = clamp((x / rect.width) * 100, 0, 100);
    const glareY = clamp((y / rect.height) * 100, 0, 100);

    setTilt({
      rotateX,
      rotateY,
      glareX,
      glareY,
    });
  };

  const handlePointerLeave = () => {
    if (!gyroActiveRef.current) {
      setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
    }
  };

  // Client-side vCard download
  const handleDownloadVCard = () => {
    setIsDownloading(true);
    try {
      const vcardContent = generateVCardString(employee);
      const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeFileName = `${employee.firstName}_${employee.lastName}.vcf`
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/\s+/g, '_');

      link.href = url;
      link.setAttribute('download', safeFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro ao transferir vCard:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 1200);
    }
  };

  // Web Share or Copy Link
  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : employee.cardUrl;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${employee.fullName || employee.firstName} - ${employee.company}`,
          text: `Cartão de Visita Digital de ${employee.fullName || employee.firstName} (${employee.role})`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // WhatsApp link format
  const whatsappText = encodeURIComponent(
    `Olá ${employee.firstName}, encontrei o teu contacto através do teu cartão virtual Nuelltech.`
  );
  const whatsappUrl = `https://wa.me/${employee.whatsapp}?text=${whatsappText}`;

  // QR Code payload
  const qrCodePayload =
    qrMode === 'vcard'
      ? generateVCardString(employee)
      : typeof window !== 'undefined'
      ? window.location.href
      : employee.cardUrl;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-slate-950 text-white overflow-hidden select-none px-4 py-6 font-sans">
      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/20 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Top action bar: iOS Gyroscope activation & Web Share */}
      <div className="relative z-30 w-full max-w-[360px] flex items-center justify-between mb-4 px-1 text-xs">
        {needsIosPermission && !isIosPermissionGranted ? (
          <button
            onClick={requestIosPermission}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 transition shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>Ativar Efeito 3D</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-medium tracking-wide uppercase text-slate-300">
              Cartão Digital Ativo
            </span>
          </div>
        )}

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition active:scale-95"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copiado!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Partilhar</span>
            </>
          )}
        </button>
      </div>

      {/* 3D Perspective Container */}
      <div
        style={{ perspective: 1200 }}
        className="w-full max-w-[360px] h-[560px] touch-none cursor-grab active:cursor-grabbing relative"
      >
        {/* Layer 1: Exterior Tilt Layer */}
        <div
          ref={cardRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
            transformStyle: 'preserve-3d',
          }}
          className="w-full h-full transition-transform duration-150 ease-out"
        >
          {/* Layer 2: Interior Flip Layer */}
          <div
            style={{
              transform: `rotateY(${isFlipped ? 180 : 0}deg)`,
              transformStyle: 'preserve-3d',
            }}
            className="w-full h-full relative transition-transform duration-700 ease-in-out"
          >
            {/* ======================================================== */}
            {/* FRONT FACE                                               */}
            {/* ======================================================== */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
              className={`absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-white/15 shadow-2xl p-6 flex flex-col justify-between overflow-hidden transition-opacity duration-300 ${
                isFlipped ? 'pointer-events-none opacity-0 z-0' : 'pointer-events-auto opacity-100 z-10'
              }`}
            >
              {/* Dynamic Holographic Glare */}
              <div
                style={{
                  background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`,
                }}
                className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-overlay z-20"
              />

              {/* Front Header */}
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="px-3.5 py-2 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl shadow-cyan-500/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-tight.png"
                      alt={employee.company}
                      className="h-10 sm:h-11 w-auto object-contain brightness-0 invert drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(true);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-xs text-cyan-300 transition active:scale-95 shadow-md cursor-pointer shrink-0"
                  title="Ver QR Code de Partilha"
                >
                  <QrCode className="w-4 h-4" />
                  <span className="font-semibold">QR Code</span>
                </button>
              </div>

              {/* Front Middle (Avatar + Info) */}
              <div className="relative z-10 flex flex-col items-center text-center mt-2">
                {/* Avatar with gradient border and availability dot */}
                <div className="relative group mb-3">
                  <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-cyan-400 via-indigo-500 to-purple-500 shadow-xl shadow-cyan-500/10">
                    <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden flex items-center justify-center">
                      {!imageError && employee.avatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={employee.avatarUrl}
                          alt={employee.fullName || employee.firstName}
                          className="w-full h-full object-cover"
                          onError={() => setImageError(true)}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center text-xl font-bold tracking-wider text-cyan-300">
                          {initials}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Online status indicator */}
                  <span
                    className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-md"
                    title="Disponível"
                  />
                </div>

                {/* Name & Role */}
                <h1 className="text-xl font-bold text-white tracking-tight">
                  {employee.fullName || `${employee.firstName} ${employee.lastName}`}
                </h1>
                <p className="text-sm font-medium text-cyan-400 mt-0.5">{employee.role}</p>

                {/* Location */}
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  <span>{employee.location}</span>
                </div>
              </div>

              {/* Quick Action Grid (4 columns) */}
              <div className="relative z-10 grid grid-cols-4 gap-2.5 my-2">
                <a
                  href={`tel:${employee.phone}`}
                  className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 flex items-center justify-center transition">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-300 mt-1 font-medium">Ligar</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 flex items-center justify-center transition">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-300 mt-1 font-medium">WhatsApp</span>
                </a>

                <a
                  href={`mailto:${employee.email}`}
                  className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-950 flex items-center justify-center transition">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] text-slate-300 mt-1 font-medium">Email</span>
                </a>

                <a
                  href={employee.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition active:scale-95 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 flex items-center justify-center transition">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" />
                    </svg>
                  </div>
                  <span className="text-[10px] text-slate-300 mt-1 font-medium">LinkedIn</span>
                </a>
              </div>

              {/* Front Footer CTA */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  disabled={isDownloading}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition active:scale-[0.98] disabled:opacity-75 cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <Check className="w-4 h-4 animate-bounce text-slate-950" />
                      <span>Contacto Guardado!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>Guardar nos Contactos (.vcf)</span>
                    </>
                  )}
                </button>

                <a
                  href={employee.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition"
                >
                  <Globe className="w-3 h-3" />
                  <span>{employee.website.replace(/^https?:\/\//, '')}</span>
                  <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                </a>
              </div>
            </div>

            {/* ======================================================== */}
            {/* BACK FACE (QR CODE SHARING MODE)                         */}
            {/* ======================================================== */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className={`absolute inset-0 w-full h-full rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-white/15 shadow-2xl p-6 flex flex-col justify-between overflow-hidden transition-opacity duration-300 ${
                isFlipped ? 'pointer-events-auto opacity-100 z-10' : 'pointer-events-none opacity-0 z-0'
              }`}
            >
              {/* Dynamic Holographic Glare */}
              <div
                style={{
                  background: `radial-gradient(circle at ${100 - tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)`,
                }}
                className="absolute inset-0 rounded-3xl pointer-events-none mix-blend-overlay z-20"
              />

              {/* Back Header */}
              <div className="relative z-30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="px-3.5 py-1.5 rounded-2xl bg-white/[0.08] backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl shadow-cyan-500/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/logo-tight.png"
                      alt={employee.company}
                      className="h-8 sm:h-9 w-auto object-contain brightness-0 invert drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFlipped(false);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-xs text-white transition active:scale-90 cursor-pointer shadow-md shrink-0"
                >
                  <RotateCcw className="w-4 h-4 text-cyan-400" />
                  <span className="font-semibold">Voltar</span>
                </button>
              </div>

              {/* Central QR Code Container with High Contrast */}
              <div className="relative z-30 flex flex-col items-center justify-center my-auto">
                <div className="p-4 bg-white rounded-3xl shadow-2xl flex items-center justify-center border-4 border-cyan-400/30">
                  <QRCodeSVG
                    value={qrCodePayload}
                    size={190}
                    level="M"
                    fgColor="#000000"
                    bgColor="#ffffff"
                    marginSize={1}
                  />
                </div>

                <p className="text-[11px] text-slate-300 mt-3 text-center px-4 font-medium">
                  {qrMode === 'vcard'
                    ? 'Grava o contacto na agenda do telemóvel (offline).'
                    : 'Abre o link web do cartão digital 3D.'}
                </p>
              </div>

              {/* Mode Toggle & Direct Link */}
              <div className="relative z-30 flex flex-col gap-2">
                {/* Segmented Control */}
                <div className="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrMode('vcard');
                    }}
                    className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      qrMode === 'vcard'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Gravar Contacto</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrMode('url');
                    }}
                    className={`py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      qrMode === 'url'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Abrir Link Web</span>
                  </button>
                </div>

                <div className="text-center">
                  <span className="text-[10px] text-slate-500 tracking-wider">
                    {employee.company} • Digital Networking
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom indicator */}
      <p className="mt-4 text-[11px] text-slate-500 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-cyan-500/70" />
        <span>Mova o telemóvel ou o rato para interagir em 3D</span>
      </p>
    </div>
  );
}
