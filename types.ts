import React from 'react';

export enum WODType {
  BENCHMARK = 'BENCHMARK',
  FOR_TIME = 'FOR TIME',
  EMOM = 'EMOM',
  AMRAP = 'AMRAP',
  STANDARD = 'STANDARD',
  TABATA = 'TABATA'
}

export interface Exercise {
  name: string;
  reps: number | string;
  weight?: string;
}

export interface WOD {
  id: string;
  name: string;
  date: string;
  type: string;
  difficulty: string;
  intensity: string;
  duration: string;
  warmUp: {
    rounds: number;
    intensity: string;
    exercises: Exercise[];
  };
  workout: {
    scheme: string;
    description: string;
    progressIndicator?: string;
    exercises: Exercise[];
  };
  equipment?: string[];
}

export interface HistoryEntry {
  id: string;
  wodName: string;
  date: string;
  time: string;
  isPersonalBest: boolean;
}

export enum AppTab {
  WOD = 'WOD',
  TIMER = 'TIMER',
  HISTORY = 'HISTORY',
  PROFILE = 'PROFILE'
}

// Global declaration for the iconify-icon web component.
// Using 'declare global' ensures we augment the existing global JSX namespace.
// This approach is more resilient than 'declare module "react"' when the module 
// resolution context varies, avoiding "module not found" errors while still 
// properly merging the 'iconify-icon' definition into IntrinsicElements.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        icon?: string;
        class?: string;
      };
    }
  }
}
