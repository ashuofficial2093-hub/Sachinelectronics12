import React, { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!scannerRef.current) return;

    const html5QrCode = new Html5Qrcode("reader");
    html5QrCodeRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
      },
      (decodedText) => {
        // Play beep sound
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
          
          gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
          
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.1);
        } catch (e) {
          console.error("Audio playback failed", e);
        }

        html5QrCode.stop().then(() => {
          onScan(decodedText);
        }).catch(err => {
          console.error("Failed to stop scanner", err);
          onScan(decodedText);
        });
      },
      (errorMessage) => {
        // Ignoring background errors
      }
    ).catch(err => {
      console.error("Error starting scanner", err);
      alert("Error accessing camera: " + err);
    });

    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch(err => console.error("Failed to stop scanner on unmount", err));
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="relative w-full max-w-md bg-black h-full flex flex-col">
        <div className="flex items-center justify-between p-4 bg-black/50 text-white z-10">
          <h3 className="font-bold">Scan Serial Number</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-white/20 hover:bg-white/30">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 relative flex items-center justify-center overflow-hidden">
          <div id="reader" ref={scannerRef} className="w-full h-full" />
          {/* Overlay to hint at scanning area */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
             <p className="text-white bg-black/50 px-4 py-2 rounded-full text-sm mt-48">Point camera at QR Code or Barcode</p>
          </div>
        </div>
      </div>
    </div>
  );
}
