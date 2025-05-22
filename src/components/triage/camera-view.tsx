
'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraOff, Video, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CameraViewProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture?: (imageDataUrl: string) => void; // Optional: if you want to add capture functionality
}

export function CameraView({ isOpen, onClose, onCapture }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
      }
      setHasCameraPermission(null); // Reset permission status when closed
      return;
    }

    const getCameraPermission = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "environment" } // Prioritize rear camera
        });
        setStream(mediaStream);
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        setStream(null);
        toast({
          variant: 'destructive',
          title: 'Acceso a Cámara Denegado',
          description: 'Por favor, habilite los permisos de cámara en la configuración de su navegador.',
        });
      }
    };

    getCameraPermission();

    return () => {
      // Cleanup stream when component unmounts or isOpen becomes false
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
         if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, toast]); // stream dependency removed to prevent loop, handled internally

  const handleCapture = () => {
    if (videoRef.current && onCapture && hasCameraPermission) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        onCapture(imageDataUrl);
      }
    }
  };
  
  // The Dialog's open state is controlled by the `isOpen` prop passed from the parent.
  // The DialogClose component or calling onClose() will trigger the parent to set isOpen to false.

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center">
            <Video className="mr-2 h-5 w-5" />
            Vista de Cámara
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 relative">
          {/* Video element is always rendered to satisfy hydration and race conditions */}
          <video 
            ref={videoRef} 
            className={`w-full aspect-video rounded-md bg-muted ${hasCameraPermission === false ? 'hidden' : ''}`} 
            autoPlay 
            playsInline // Important for iOS
            muted // Muting is often required for autoplay without user interaction
          />

          {hasCameraPermission === null && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-md">
              <CameraOff className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Solicitando acceso a la cámara...</p>
            </div>
          )}

          {hasCameraPermission === false && (
             <Alert variant="destructive" className="mt-0">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Acceso a Cámara Denegado</AlertTitle>
              <AlertDescription>
                No se pudo acceder a la cámara. Verifique los permisos en su navegador e inténtelo de nuevo.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="p-4 pt-0 flex flex-col sm:flex-row sm:justify-between gap-2">
          {onCapture && hasCameraPermission && (
            <Button onClick={handleCapture} variant="default" className="w-full sm:w-auto">
              <Camera className="mr-2 h-4 w-4" />
              Capturar Foto
            </Button>
          )}
          <DialogClose asChild>
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
               <X className="mr-2 h-4 w-4" />
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
