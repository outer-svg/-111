import React, { useState, useEffect, useCallback } from 'react';
import { Scene } from './components/Scene';
import { HandRecognizer } from './components/HandRecognizer';
import { Interface } from './components/Interface';
import { AppMode, HandGestureState, ParticleData } from './types';
import { generateParticles } from './utils/geometry';

// Helper to convert Files to Data URLs
const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.readAsDataURL(file);
  });
};

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.TREE);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  
  const [gestureState, setGestureState] = useState<HandGestureState>({
    isDetected: false,
    gesture: 'NONE',
    position: { x: 0, y: 0 },
    rotation: 0,
  });

  // Initialize Particles (re-run when photos change)
  useEffect(() => {
    // Generate around 250 particles for good performance and density
    const newParticles = generateParticles(250, uploadedPhotos);
    setParticles(newParticles);
  }, [uploadedPhotos]);

  // Logic to handle state transitions based on Gestures
  useEffect(() => {
    if (!gestureState.isDetected) return;

    // Debounce/Transition logic could be added here for smoother feel
    // For now, we use direct mapping for responsiveness
    
    if (gestureState.gesture === 'FIST') {
      setMode(AppMode.TREE);
    } else if (gestureState.gesture === 'OPEN') {
      setMode(AppMode.SCATTER);
    } else if (gestureState.gesture === 'PINCH') {
       // Only allow focus if we are already scattered, or allow direct transition
       if (mode === AppMode.SCATTER || mode === AppMode.FOCUS) {
         setMode(AppMode.FOCUS);
       }
    }
    
    // If gesture releases from PINCH to OPEN, it stays in scatter/focus until Fist
    if (mode === AppMode.FOCUS && gestureState.gesture === 'OPEN') {
        setMode(AppMode.SCATTER);
    }

  }, [gestureState.gesture, gestureState.isDetected, mode]);

  const handlePhotosUploaded = async (files: FileList) => {
    const urls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const url = await fileToDataUrl(files[i]);
      urls.push(url);
    }
    setUploadedPhotos(prev => [...prev, ...urls]);
  };

  const handleGestureUpdate = useCallback((newState: HandGestureState) => {
    setGestureState(newState);
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Scene 
            mode={mode} 
            particles={particles} 
            gestureState={gestureState}
        />
      </div>

      {/* UI Overlay Layer */}
      <Interface 
        mode={mode}
        gestureState={gestureState}
        onPhotosUploaded={handlePhotosUploaded}
      />

      {/* Camera/Vision Layer (Fixed Bottom Left) */}
      <HandRecognizer onUpdate={handleGestureUpdate} />

    </div>
  );
};

export default App;
