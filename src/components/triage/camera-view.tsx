
'use client';

import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CameraOff, Video, AlertTriangle, X, Camera as CameraIcon } from 'lucide-react'; // Added CameraIcon
import { useToast } from '@/hooks/use-toast';

interface CameraViewProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture?: (imageDataUrl: string) => void;
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
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null); // Ensure stream state is also cleared
         if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // toast removed as it's stable, stream handled via setStream

  const handleCapture = () => {
    if (videoRef.current && onCapture && hasCameraPermission && stream) {
      const canvas = document.createElement('canvas');
      // Ensure video dimensions are available
      if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        toast({ variant: 'destructive', title: 'Error de Captura', description: 'Dimensiones del video no disponibles. Intente de nuevo.'});
        return;
      }
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        onCapture(imageDataUrl);
        // Parent component (TriagePage) will call onClose via setShowCamera(false) in its handleCaptureImage
      } else {
         toast({ variant: 'destructive', title: 'Error de Captura', description: 'No se pudo obtener el contexto del canvas.'});
      }
    } else if (!onCapture) {
      toast({ variant: 'destructive', title: 'Error de Configuración', description: 'Funcionalidad de captura no implementada.'});
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="flex items-center">
            <Video className="mr-2 h-5 w-5" />
            Vista de Cámara
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-4 relative">
          <video 
            ref={videoRef} 
            className={`w-full aspect-video rounded-md bg-muted ${hasCameraPermission === false || hasCameraPermission === null ? 'hidden' : 'block'}`} 
            autoPlay 
            playsInline
            muted 
          />

          {hasCameraPermission === null && (
            <div className="w-full aspect-video flex flex-col items-center justify-center bg-muted rounded-md">
              <CameraOff className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Solicitando acceso a la cámara...</p>
            </div>
          )}

          {hasCameraPermission === false && (
             <Alert variant="destructive" className="mt-0 w-full aspect-video flex flex-col items-center justify-center rounded-md">
              <AlertTriangle className="h-8 w-8 mb-2" />
              <AlertTitle>Acceso a Cámara Denegado</AlertTitle>
              <AlertDescription className="text-center">
                No se pudo acceder a la cámara. Verifique los permisos <br/> en su navegador e inténtelo de nuevo.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="p-4 pt-0 flex flex-col sm:flex-row sm:justify-between gap-2">
          {onCapture && hasCameraPermission && (
            <Button onClick={handleCapture} variant="default" className="w-full sm:w-auto">
              <CameraIcon className="mr-2 h-4 w-4" />
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

    