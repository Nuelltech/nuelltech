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
  Camera,
  Loader2,
  UserPlus,
  FileText,
  Send,
  Copy,
} from 'lucide-react';
import { EmployeeData, generateVCardString } from '@/data/employees';

interface ScannedContact {
  firstName: string;
  lastName: string;
  fullName: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  notes: string;
}

interface VirtualBusinessCardProps {
  employee: EmployeeData;
}

export default function VirtualBusinessCard({ employee }: VirtualBusinessCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [qrMode, setQrMode] = useState<'vcard' | 'presentation' | 'url'>('presentation');
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  const [hasGyroscope, setHasGyroscope] = useState(false);
  const [needsIosPermission, setNeedsIosPermission] = useState(false);
  const [isIosPermissionGranted, setIsIosPermissionGranted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPresentation, setCopiedPresentation] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isOfflineReady, setIsOfflineReady] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showIosInstallModal, setShowIosInstallModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Physical Business Card Scanner State
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannedPreview, setScannedPreview] = useState<string | null>(null);
  const [scannedContact, setScannedContact] = useState<ScannedContact | null>(null);
  const [savedScannedVcf, setSavedScannedVcf] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const gyroActiveRef = useRef(false);

  // Register Service Worker for Offline caching & PWA + auto-update check
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          setIsOfflineReady(true);
          // Check for updates in background every time the app opens
          reg.update().catch(() => {});
        })
        .catch((err) => {
          console.warn('Falha no registo do ServiceWorker:', err);
        });
    }

    // Detect if running as standalone app (already installed on homescreen)
    if (
      typeof window !== 'undefined' &&
      (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true)
    ) {
      setIsInstalled(true);
    }

    // Capture Android beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

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

  // Helper to open native Contacts app directly on Android (via Intent) or iOS (via inline vCard stream)
  const openNativeContactsApp = (contact: {
    fullName: string;
    firstName?: string;
    lastName?: string;
    company?: string;
    role?: string;
    phone?: string;
    email?: string;
    website?: string;
    address?: string;
    notes?: string;
  }) => {
    const params = new URLSearchParams();
    if (contact.fullName) params.set('fullName', contact.fullName);
    if (contact.firstName) params.set('firstName', contact.firstName);
    if (contact.lastName) params.set('lastName', contact.lastName);
    if (contact.company) params.set('company', contact.company);
    if (contact.role) params.set('role', contact.role);
    if (contact.phone) params.set('phone', contact.phone);
    if (contact.email) params.set('email', contact.email);
    if (contact.website) params.set('website', contact.website);
    if (contact.address) params.set('address', contact.address);
    if (contact.notes) params.set('notes', contact.notes);

    const vcardStreamUrl = `${window.location.origin}/api/vcard/custom?${params.toString()}`;
    const isAndroid = typeof navigator !== 'undefined' && /Android/i.test(navigator.userAgent);

    if (isAndroid) {
      // On Android: launch the native Contacts app directly via Android Intent (zero files downloaded!)
      const encodeIntentVal = (val: string) => encodeURIComponent(val).replace(/;/g, '%3B');
      const notesCombined = [
        contact.notes,
        contact.website ? `Web: ${contact.website}` : '',
        contact.address ? `Morada: ${contact.address}` : '',
      ]
        .filter(Boolean)
        .join(' | ');

      const intentParts = [
        'intent:#Intent',
        'action=android.intent.action.INSERT',
        'type=vnd.android.cursor.dir/contact',
        contact.fullName ? `S.name=${encodeIntentVal(contact.fullName)}` : '',
        contact.phone ? `S.phone=${encodeIntentVal(contact.phone)}` : '',
        contact.email ? `S.email=${encodeIntentVal(contact.email)}` : '',
        contact.company ? `S.company=${encodeIntentVal(contact.company)}` : '',
        contact.role ? `S.job_title=${encodeIntentVal(contact.role)}` : '',
        notesCombined ? `S.notes=${encodeIntentVal(notesCombined)}` : '',
        `S.browser_fallback_url=${encodeURIComponent(vcardStreamUrl)}`,
        'end',
      ]
        .filter(Boolean)
        .join(';');

      window.location.href = intentParts;
    } else {
      // On iOS / Safari / Desktop: navigate directly to server vCard stream (no 'download' attribute)
      // iOS intercepts text/x-vcard and opens the native Contact sheet immediately.
      window.location.href = vcardStreamUrl;
    }
  };

  // Direct native contact save for the employee's own card
  const handleDownloadVCard = () => {
    setIsDownloading(true);
    try {
      openNativeContactsApp({
        fullName: employee.fullName || `${employee.firstName} ${employee.lastName}`,
        firstName: employee.firstName,
        lastName: employee.lastName,
        company: employee.company,
        role: employee.role,
        phone: employee.phone,
        email: employee.email,
        website: employee.website,
        address: employee.location,
        notes: employee.bio,
      });
    } catch (err) {
      console.error('Erro ao abrir contactos:', err);
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

  // Quick Share for Nuelltech Presentation (Option 2)
  const presentationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/pt/apresentacao` 
    : 'https://nuelltech.com/pt/apresentacao';

  const handleSharePresentation = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareText = 'Olá! Partilho a apresentação executiva da Nuelltech com os nossos casos práticos de IA e automação para PMEs:';
    
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Apresentação Corporativa — Nuelltech',
          text: shareText,
          url: presentationUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(`${shareText} ${presentationUrl}`);
      setCopiedPresentation(true);
      setTimeout(() => setCopiedPresentation(false), 2000);
    }
  };

  // WhatsApp link format
  const whatsappText = encodeURIComponent(
    `Olá ${employee.firstName}, encontrei o teu contacto através do teu cartão virtual Nuelltech.`
  );
  const whatsappUrl = `https://wa.me/${employee.whatsapp}?text=${whatsappText}`;

  // Handle PWA Installation
  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      // Show iOS / general instructions modal
      setShowIosInstallModal(true);
    }
  };

  // Compress photo in browser before sending to Claude Vision (max 1400px JPEG 85%)
  const compressImageToBase64 = (file: File): Promise<{ base64: string; mimeType: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const MAX_DIM = 1400;
          let width = img.width;
          let height = img.height;
          if (width > height && width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas indisponível'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          resolve({ base64: dataUrl, mimeType: 'image/jpeg' });
        };
        img.onerror = () => reject(new Error('Falha ao carregar imagem'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Falha ao ler ficheiro'));
      reader.readAsDataURL(file);
    });
  };

  // Handle photo captured from camera or selected from gallery
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setShowScannerModal(true);
    setIsScanning(true);
    setScanError(null);
    setScannedContact(null);
    setSavedScannedVcf(false);

    try {
      const { base64, mimeType } = await compressImageToBase64(file);
      setScannedPreview(base64);

      const response = await fetch('/api/scan-card', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType,
          scannedBy: employee.slug,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.contact) {
        throw new Error(data.error || 'Erro ao analisar o cartão.');
      }

      setScannedContact(data.contact);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro inesperado ao ler cartão.';
      setScanError(msg);
    } finally {
      setIsScanning(false);
      // Reset input so user can scan another card right away
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Open phone's native Contacts screen directly with all extracted fields pre-filled
  const handleSaveScannedToPhone = () => {
    if (!scannedContact) return;
    const c = scannedContact;
    const fullName = c.fullName || `${c.firstName} ${c.lastName}`.trim() || 'Contacto Cartão';

    openNativeContactsApp({
      fullName,
      firstName: c.firstName,
      lastName: c.lastName,
      company: c.company,
      role: c.role,
      phone: c.phone,
      email: c.email,
      website: c.website,
      address: c.address,
      notes: c.notes,
    });

    setSavedScannedVcf(true);
  };

  // QR Code payload
  const qrCodePayload =
    qrMode === 'vcard'
      ? generateVCardString(employee)
      : qrMode === 'presentation'
      ? presentationUrl
      : typeof window !== 'undefined'
      ? window.location.href
      : employee.cardUrl;

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen w-full bg-slate-950 text-white overflow-hidden select-none px-4 py-6 font-sans">
      {/* Hidden Camera Input for Physical Business Card Scanning */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Dynamic ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-tr from-cyan-600/20 via-indigo-600/20 to-purple-600/20 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Top action bar: iOS Gyroscope activation, Scanner, Add to Home Screen & Share */}
      <div className="relative z-30 w-full max-w-[360px] flex items-center justify-between mb-4 px-1 text-xs gap-1.5">
        {needsIosPermission && !isIosPermissionGranted ? (
          <button
            onClick={requestIosPermission}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30 transition shadow-sm active:scale-95 text-[11px]"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>3D</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-medium tracking-wide uppercase text-slate-300">
              {isOfflineReady ? 'Offline Ready' : 'Digital ID'}
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {/* Physical Card Scanner Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-300 hover:bg-emerald-500/25 transition active:scale-95 text-[11px] font-medium cursor-pointer shadow-sm"
            title="Tirar foto a um cartão físico e guardar contacto no telemóvel"
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ler Cartão</span>
          </button>

          {!isInstalled && (
            <button
              onClick={handleInstallApp}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/25 transition active:scale-95 text-[11px] font-medium cursor-pointer"
              title="Adicionar ao Ecrã Principal do Telemóvel"
            >
              <span>+ App</span>
            </button>
          )}

          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition active:scale-95 text-[11px] cursor-pointer"
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
      </div>

      {/* Physical Card Scanner Modal */}
      {showScannerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/20 p-5 shadow-2xl relative text-left my-auto max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowScannerModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Leitor IA de Cartões</h4>
                <p className="text-[11px] text-slate-400">Extrai e guarda direto na agenda do telemóvel</p>
              </div>
            </div>

            {scannedPreview && (
              <div className="mb-3 rounded-2xl overflow-hidden border border-white/10 bg-slate-950 max-h-32 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={scannedPreview} alt="Cartão digitalizado" className="w-full h-32 object-cover" />
              </div>
            )}

            {isScanning && (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-3">
                <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-xs font-medium text-slate-200">A ler dados do cartão com IA...</p>
                <p className="text-[11px] text-slate-400">Isto demora apenas 2 a 3 segundos</p>
              </div>
            )}

            {scanError && !isScanning && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                  {scanError}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition cursor-pointer"
                >
                  Tentar Nova Fotografia
                </button>
              </div>
            )}

            {scannedContact && !isScanning && (
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    value={scannedContact.fullName}
                    onChange={(e) => setScannedContact({ ...scannedContact, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Empresa</label>
                    <input
                      type="text"
                      value={scannedContact.company}
                      onChange={(e) => setScannedContact({ ...scannedContact, company: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Cargo</label>
                    <input
                      type="text"
                      value={scannedContact.role}
                      onChange={(e) => setScannedContact({ ...scannedContact, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Telefone</label>
                    <input
                      type="tel"
                      value={scannedContact.phone}
                      onChange={(e) => setScannedContact({ ...scannedContact, phone: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={scannedContact.email}
                      onChange={(e) => setScannedContact({ ...scannedContact, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Website</label>
                  <input
                    type="text"
                    value={scannedContact.website}
                    onChange={(e) => setScannedContact({ ...scannedContact, website: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-slate-400 mb-1">Nota (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: Reunião Porto, interessado em IA..."
                    value={scannedContact.notes}
                    onChange={(e) => setScannedContact({ ...scannedContact, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={handleSaveScannedToPhone}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition active:scale-95"
                  >
                    {savedScannedVcf ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Aberto nos Contactos!</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Guardar Contacto no Telemóvel</span>
                      </>
                    )}
                  </button>

                  {/* Option 5: Follow-up instantâneo por WhatsApp com Apresentação */}
                  {scannedContact.phone && (
                    <a
                      href={`https://wa.me/${scannedContact.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Olá ${scannedContact.firstName || scannedContact.fullName.split(' ')[0] || ''}! Foi um gosto conversar hoje. Como falámos, partilho a apresentação executiva da Nuelltech com os nossos casos práticos de IA e automação para PMEs: ${presentationUrl}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-95 text-center cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Enviar Apresentação por WhatsApp</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] text-slate-300 transition cursor-pointer text-center"
                  >
                    Ler Outro Cartão
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* iOS & Mobile Add to Home Screen Instructions Modal */}
      {showIosInstallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-white/20 p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowIosInstallModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-white/10 p-2 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icons/apple-touch-icon.png" alt="Nuell ID" className="w-full h-full object-contain" />
              </div>
              <div>
                <h4 className="font-bold text-base text-white">Adicionar ao Ecrã</h4>
                <p className="text-xs text-cyan-400">Abre sem internet como App nativa</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  1
                </span>
                <p>
                  No Safari (iPhone) toque no botão <strong className="text-white">Partilhar</strong> (ícone com quadrado e seta ⎋) na barra inferior.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  2
                </span>
                <p>
                  Deslize e selecione <strong className="text-white">«Adicionar ao Ecrã Principal»</strong> (➕).
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                  3
                </span>
                <p>
                  Pronto! O ícone <strong className="text-white">Nuell ID</strong> fica no seu ecrã e abre imediatamente a qualquer momento, mesmo sem rede.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowIosInstallModal(false)}
              className="w-full mt-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs uppercase tracking-wide cursor-pointer transition active:scale-95"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

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
                {/* Option 3: Apresentação da Empresa (Destaque Principal) */}
                <div className="w-full flex items-center gap-1.5">
                  <a
                    href="/pt/apresentacao"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-3.5 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-orange-500/10 hover:from-orange-500/30 hover:to-amber-500/20 border border-orange-500/40 text-orange-200 font-bold text-xs flex items-center justify-between transition active:scale-[0.98] shadow-md group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-400 group-hover:scale-110 transition shrink-0" />
                      <span className="tracking-tight text-white">Apresentação Nuelltech</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500 text-slate-950 font-extrabold uppercase tracking-wider shrink-0">
                      Deck
                    </span>
                  </a>

                  {/* Option 2: Botão rápido de partilha da apresentação */}
                  <button
                    type="button"
                    onClick={handleSharePresentation}
                    title="Partilhar Apresentação por WhatsApp ou Redes"
                    className="py-2.5 px-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-slate-200 transition active:scale-95 flex items-center justify-center shrink-0 cursor-pointer"
                  >
                    {copiedPresentation ? (
                      <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                    ) : (
                      <Send className="w-4 h-4 text-orange-400" />
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleDownloadVCard}
                  disabled={isDownloading}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 transition active:scale-[0.98] disabled:opacity-75 cursor-pointer"
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
                  {qrMode === 'presentation'
                    ? 'Abre a Apresentação Executiva da Nuelltech (casos reais e ROI).'
                    : qrMode === 'vcard'
                    ? 'Grava o contacto na agenda do telemóvel (offline).'
                    : 'Abre o link web do cartão digital 3D.'}
                </p>
              </div>

              {/* Mode Toggle & Direct Link */}
              <div className="relative z-30 flex flex-col gap-2">
                {/* 3-way Segmented Control (Option 1) */}
                <div className="grid grid-cols-3 p-1 rounded-2xl bg-white/5 border border-white/10 text-[11px] font-semibold gap-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrMode('presentation');
                    }}
                    className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                      qrMode === 'presentation'
                        ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Apresentação</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrMode('vcard');
                    }}
                    className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                      qrMode === 'vcard'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Contacto</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQrMode('url');
                    }}
                    className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer truncate ${
                      qrMode === 'url'
                        ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>Cartão Web</span>
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
