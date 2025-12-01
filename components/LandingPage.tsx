
import React from 'react';
import { ArrowRight, Brain, ShieldCheck, Zap } from 'lucide-react';
import { AppView } from '../types';

interface LandingPageProps {
  onNavigate: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen pt-16 flex flex-col">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-900 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(0,0,0,0),rgba(0,0,0,0.5))] -z-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-7xl">
            Early Detection Saves Lives with{' '}
            <span className="relative whitespace-nowrap text-blue-600 dark:text-blue-400">
              <span className="relative">ML Precision</span>
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700 dark:text-slate-300">
            PulmoScan leverages advanced Computer Vision and Neural Networks to analyze chest X-rays and CT scans, providing doctors with instant second opinions, risk heatmaps, and detailed pathology reports.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <button
              onClick={() => onNavigate(AppView.LOGIN)}
              className="group inline-flex items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 bg-blue-600 text-white hover:bg-blue-700 hover:text-slate-100 active:bg-blue-800 active:text-blue-100 transition-all shadow-xl shadow-blue-200 dark:shadow-blue-900/40"
            >
              Start Analysis
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group inline-flex ring-1 ring-slate-200 dark:ring-slate-700 items-center justify-center rounded-full py-3 px-8 text-sm font-semibold focus:outline-none bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 hover:ring-slate-300 transition-all">
              View Research
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="bg-slate-50 dark:bg-slate-900 py-24 sm:py-32 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600 dark:text-blue-400">Faster Diagnosis</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Everything you need to detect anomalies
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  Advanced ML Models
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Powered by state-of-the-art Generative AI, capable of detecting subtle patterns in radiological imaging that might be missed by the human eye.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  Real-time Heatmaps
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Visual localization of potential tumors or nodules helps radiologists focus on the most critical areas immediately.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-gray-100">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  Secure & Compliant
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600 dark:text-gray-400">
                  Built with security first. Patient data is processed ephemerally and encrypted in transit.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
