import * as THREE from 'three';

export enum AppMode {
  TREE = 'TREE',       // Fist: Coalesce into tree
  SCATTER = 'SCATTER', // Open Hand: Floating particles
  FOCUS = 'FOCUS',     // Pinch/Grab: Focus on specific photo
}

export type ParticleType = 'sphere' | 'cube' | 'photo' | 'candy';

export interface ParticleData {
  id: string;
  type: ParticleType;
  positionTree: THREE.Vector3;
  positionScatter: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  color: string;
  texture?: THREE.Texture; // For photos
}

export interface HandGestureState {
  isDetected: boolean;
  gesture: 'FIST' | 'OPEN' | 'PINCH' | 'NONE';
  position: { x: number; y: number }; // Normalized -1 to 1
  rotation: number; // Hand rotation logic
}
