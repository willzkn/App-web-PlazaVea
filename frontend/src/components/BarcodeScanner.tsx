import { useCallback, useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader, IScannerControls } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";

interface BarcodeScannerProps {
  onDetected: (code: string) => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    BarcodeDetector?: {
      new (options?: { formats?: string[] }): BarcodeDetectorInstance;
      getSupportedFormats: () => Promise<string[]>;
    };
  }
}

interface BarcodeDetectorInstance {
  detect: (image: CanvasImageSource) => Promise<{ rawValue: string }[]>;
}

const SCAN_INTERVAL_MS = 200;

export function BarcodeScanner({ onDetected, onError }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | undefined>();
  const detectorRef = useRef<BarcodeDetectorInstance | null>(null);
  const lastScanRef = useRef(0);
  const detectedRef = useRef(false);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const zxingControlsRef = useRef<IScannerControls | null>(null);

  const stopCamera = useCallback(() => {
    if (rafRef.current !== undefined) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (err) {
        console.warn("No se pudo pausar el video", err);
      }
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
    detectedRef.current = false;

    if (zxingControlsRef.current) {
      try {
        zxingControlsRef.current.stop();
      } catch (err) {
        console.warn("Error deteniendo ZXing", err);
      }
      zxingControlsRef.current = null;
    }
    if (zxingReaderRef.current) {
      zxingReaderRef.current.reset();
      zxingReaderRef.current = null;
    }
  }, []);

  useEffect(() => {
    const supportsBarcodeDetector = typeof window !== "undefined" && !!window.BarcodeDetector;

    async function initDetector() {
      if (!supportsBarcodeDetector) {
        throw new Error("El navegador no soporta BarcodeDetector");
      }

      const formats = await window.BarcodeDetector!.getSupportedFormats();
      detectorRef.current = new window.BarcodeDetector!({ formats });
    }

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        throw new Error(
          err instanceof Error ? err.message : "No se pudo acceder a la cámara"
        );
      }
    }

    let isMounted = true;

    async function startWithNativeDetector() {
      await initDetector();
      await initCamera();
      if (!isMounted) return;
      setIsLoading(false);

      const scan = async (time: number) => {
        if (!videoRef.current || !detectorRef.current) {
          rafRef.current = requestAnimationFrame(scan);
          return;
        }

        if (time - lastScanRef.current < SCAN_INTERVAL_MS) {
          rafRef.current = requestAnimationFrame(scan);
          return;
        }
        lastScanRef.current = time;

        try {
          const barcodes = await detectorRef.current.detect(videoRef.current);
          if (barcodes.length > 0 && !detectedRef.current) {
            const code = barcodes[0]?.rawValue;
            if (code) {
              detectedRef.current = true;
              stopCamera();
              onDetected(code);
              return;
            }
          }
        } catch (detectError) {
          console.error("Error detectando código", detectError);
        }

        rafRef.current = requestAnimationFrame(scan);
      };

      rafRef.current = requestAnimationFrame(scan);
    }

    async function startWithZxing() {
      if (!videoRef.current) {
        throw new Error("No se pudo inicializar el video");
      }

      setIsLoading(true);
      const reader = new BrowserMultiFormatReader();
      zxingReaderRef.current = reader;

      try {
        const controls = await reader.decodeFromVideoDevice(
          undefined,
          videoRef.current,
          (result, err, controls) => {
            if (result && !detectedRef.current) {
              detectedRef.current = true;
              controls?.stop();
              stopCamera();
              onDetected(result.getText());
            } else if (err && !(err instanceof NotFoundException)) {
              console.error("ZXing error", err);
            }
          }
        );

        zxingControlsRef.current = controls;
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        throw err instanceof Error ? err : new Error("Error usando ZXing");
      }
    }

    async function startScanning() {
      try {
        setError(null);
        if (supportsBarcodeDetector) {
          await startWithNativeDetector();
        } else {
          await startWithZxing();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error inicializando el lector";
        setError(message);
        setIsLoading(false);
        onError?.(message);
      }
    }

    startScanning();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, [onDetected, onError, stopCamera]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-full overflow-hidden rounded-lg bg-black aspect-[3/4]">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          playsInline
          muted
          autoPlay
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-32 w-32 rounded-xl border-2 border-primary/80" />
        </div>
      </div>
      {isLoading && <p className="text-sm text-muted-foreground">Activando cámara…</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground text-center">
        Apunta el código de barras dentro del recuadro. Permite códigos EAN, UPC y similares.
      </p>
    </div>
  );
}
