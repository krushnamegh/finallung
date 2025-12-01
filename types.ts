
export interface User {
  id: string;
  name: string;
  role: 'doctor' | 'admin';
  email: string;
}

export interface PatientDetails {
  id: string;
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  symptoms: string;
  history: string;
}

export interface AnalysisResult {
  diagnosis: 'Normal' | 'Benign' | 'Malignant' | 'Uncertain';
  confidence: number;
  severityScore: number; // 1-10
  urgency: 'Routine' | 'Semi-Urgent' | 'Urgent' | 'Critical';
  reliabilityScore: number; // 1-10, assessment of image quality
  stage?: string;
  summary: string;
  findings: string[];
  recommendations: string[];
  affectedAreaCoordinates?: { x: number; y: number; r: number };
}

export interface PatientRecord extends PatientDetails {
  timestamp: string;
  result: AnalysisResult;
}

export enum AppView {
  LANDING = 'LANDING',
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
}
