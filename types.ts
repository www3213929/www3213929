export enum AppMode {
  SINGLE_FRAME = 'SINGLE_FRAME',
  START_END = 'START_END',
  MULTI_REF = 'MULTI_REF',
}

export enum StyleModifier {
  ACTION = 'Action/Fight Choreography',
  VFX = 'Visual Effects (VFX) & Particles',
  ATMOSPHERE = 'Atmosphere & Mood',
  LIGHTING = 'Cinematic Lighting',
  CAMERA = 'Camera Movement',
  GENERAL = 'General Enhancement'
}

export interface ImageReference {
  id: string;
  file: File;
  previewUrl: string;
  name?: string; // Used in Multi-Ref mode
}

export interface EaseOptions {
  easeIn: boolean;
  easeOut: boolean;
}

export interface PromptRequest {
  userPrompt: string;
  images: ImageReference[];
  modifiers: StyleModifier[];
  mode: AppMode;
  easeOptions?: EaseOptions;
}

export interface GenerationResult {
  text: string;
  error?: string;
}