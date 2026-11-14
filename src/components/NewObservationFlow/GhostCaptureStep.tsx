import React, { useState, useRef, useEffect } from 'react';
import { Plant, ObservationRecord } from '../../types';
import { SAMPLE_CAPTURE_PHOTOS } from '../../data/demoData';
import { Camera, Upload, Sliders, RotateCcw, ArrowRight } from 'lucide-react';

interface GhostCaptureStepProps {
  plant: Plant;
  previousObservation: ObservationRecord | null;
  onPhotoSelected: (photoUrl: string) => void;
  onCancel: () => void;
}

export const GhostCaptureStep: React.FC<GhostCaptureStepProps> = ({
  plant,
  previousObservation,
  onPhotoSelected,
  onCancel,
}) => {
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [ghostOpacity, setGhostOpacity] = useState<number>(0.4);
  const [isUsingCamera, setIsUsingCamera] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const previousImageUrl = previousObservation?.image || plant.coverImage;

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera is not supported in this preview browser. Please select a sample photo or upload an image.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsUsingCamera(true);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('Camera access unavailable. You can upload any photo or pick a sample milestone below.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsUsingCamera(false);
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 960;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setCapturedPhoto(result);
          stopCamera();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Title & Guidance */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <span className="text-[11px] uppercase tracking-widest text-[#76877A] font-sans font-medium block">
          Ghost Capture Framing
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#16281D] font-normal tracking-tight mt-1.5">
          Match your last observation
        </h2>
        <p className="font-serif italic text-base text-[#4E6153] mt-2 font-light">
          “Try to use a similar angle and distance for a clearer comparison.”
        </p>
      </div>

      {/* Main Viewport Container */}
      <div className="relative rounded-3xl overflow-hidden border border-[#DCD6C9] bg-[#16281D] shadow-sm aspect-[4/3] max-h-[520px] mx-auto flex items-center justify-center">
        {/* Layer 1: Background - Camera stream OR Selected photo */}
        {isUsingCamera ? (
          <video
            ref={videoRef}
            playsInline
            muted
            autoPlay
            className="w-full h-full object-cover"
          />
        ) : capturedPhoto ? (
          <img
            src={capturedPhoto}
            alt="Captured new observation"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="relative w-full h-full">
            {/* Show previous photo as base guide when waiting for user capture */}
            <img
              src={previousImageUrl}
              alt="Previous photo base guide"
              className="w-full h-full object-cover opacity-60 filter contrast-90"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 text-white">
              <span className="text-xs uppercase tracking-widest opacity-75 font-sans mb-1">
                Previous Angle Guide
              </span>
              <p className="font-serif text-xl sm:text-2xl font-light max-w-xs">
                Take or upload today’s photo
              </p>
              <p className="text-xs font-sans text-white/70 mt-1 max-w-xs">
                Align your plant with the reference silhouette above.
              </p>
            </div>
          </div>
        )}

        {/* Layer 2: Translucent Ghost Reference of Previous Image (when capturing) */}
        {(capturedPhoto || isUsingCamera) && previousImageUrl && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-150 overflow-hidden"
            style={{ opacity: ghostOpacity }}
          >
            <img
              src={previousImageUrl}
              alt="Ghost reference"
              className="w-full h-full object-cover mix-blend-screen filter contrast-125"
            />
          </div>
        )}

        {/* Alignment Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none border border-white/10 grid grid-cols-3 grid-rows-3">
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div className="border-r border-b border-white/10" />
          <div />
        </div>

        {/* Viewfinder Badge */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-xs text-[#FAF8F5] text-[11px] font-sans px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#8EAB94]" />
          <span>Ghost Guide: Previous angle</span>
        </div>

        {/* Camera Snapshot Button */}
        {isUsingCamera && (
          <div className="absolute bottom-5 inset-x-0 flex justify-center">
            <button
              onClick={takeSnapshot}
              className="px-6 py-3 bg-white text-[#16281D] hover:bg-[#FAF8F5] rounded-full font-sans font-semibold shadow-lg text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-transform active:scale-95"
            >
              <Camera className="w-4 h-4 text-[#16281D]" />
              <span>Capture Photo</span>
            </button>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="mt-4 p-3 bg-[#FAF0EE] border border-[#EAC7C0] text-[#8C342A] text-xs font-sans rounded-xl text-center max-w-lg mx-auto">
          {cameraError}
        </div>
      )}

      {/* Ghost Transparency Slider */}
      <div className="mt-6 p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2D7] max-w-md mx-auto">
        <div className="flex justify-between text-xs font-sans text-[#566B5C] mb-1.5">
          <span>Today’s view</span>
          <span className="font-sans font-semibold text-[#16281D]">
            Ghost Overlay: {Math.round(ghostOpacity * 100)}%
          </span>
          <span>Previous view</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={ghostOpacity}
          onChange={(e) => setGhostOpacity(parseFloat(e.target.value))}
          className="w-full accent-[#16281D] cursor-pointer"
          aria-label="Ghost overlay transparency slider"
        />
      </div>

      {/* Action Buttons: Upload or Camera */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DDD7CC] hover:border-[#16281D] text-[#16281D] rounded-xl text-xs font-sans font-medium transition-all cursor-pointer shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 text-[#2C4936]" />
          <span>Upload photo</span>
        </button>

        <button
          onClick={startCamera}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#DDD7CC] hover:border-[#16281D] text-[#16281D] rounded-xl text-xs font-sans font-medium transition-all cursor-pointer shadow-xs"
        >
          <Camera className="w-3.5 h-3.5 text-[#2C4936]" />
          <span>{isUsingCamera ? 'Camera active' : 'Open camera'}</span>
        </button>

        {capturedPhoto && (
          <button
            onClick={() => {
              setCapturedPhoto(null);
              stopCamera();
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 text-[#76877A] hover:text-[#8C342A] text-xs font-sans transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake</span>
          </button>
        )}
      </div>

      {/* Instant Milestone Test Photos */}
      <div className="mt-8 pt-6 border-t border-[#E7E2D7] text-center">
        <span className="text-[11px] uppercase tracking-wider text-[#76877A] font-sans block mb-3">
          Or test with a chronological milestone photo:
        </span>
        <div className="flex flex-wrap justify-center gap-3">
          {SAMPLE_CAPTURE_PHOTOS.map((sample, i) => (
            <button
              key={i}
              onClick={() => {
                setCapturedPhoto(sample.url);
                stopCamera();
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-sans text-left transition-all border cursor-pointer ${
                capturedPhoto === sample.url
                  ? 'border-[#16281D] bg-[#EDE8DE] text-[#16281D] font-semibold'
                  : 'border-[#DDD7CC] bg-white text-[#4A5E50] hover:border-[#16281D]/40'
              }`}
            >
              <span className="block font-medium">{sample.label}</span>
              <span className="text-[11px] text-[#76877A] block mt-0.5">{sample.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="mt-10 flex items-center justify-between max-w-md mx-auto pt-4 border-t border-[#E7E2D7]">
        <button
          onClick={onCancel}
          className="px-4 py-2 text-xs font-sans text-[#566B5C] hover:text-[#16281D] cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (capturedPhoto) {
              onPhotoSelected(capturedPhoto);
            }
          }}
          disabled={!capturedPhoto}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-sans font-medium transition-all shadow-xs ${
            capturedPhoto
              ? 'bg-[#16281D] text-[#FAF8F5] hover:bg-[#233F2E] cursor-pointer active:scale-98'
              : 'bg-[#D6CFC3] text-[#867E72] cursor-not-allowed'
          }`}
        >
          <span>Continue to Observe First</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
