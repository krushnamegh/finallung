
import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, FileText, Activity, Thermometer, User, Calendar, Clipboard, AlertTriangle, Info, List, Plus, Search, Eye, EyeOff, Sliders } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, RadialBarChart, RadialBar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { analyzeLungScan } from '../services/geminiService';
import { AnalysisResult, PatientDetails, PatientRecord } from '../types';

const Dashboard: React.FC = () => {
  // View State
  const [viewMode, setViewMode] = useState<'analyze' | 'registry'>('analyze');

  // Wizard State
  const [step, setStep] = useState<1 | 2>(1);
  
  // Patient Data & History
  const [patientHistory, setPatientHistory] = useState<PatientRecord[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientDetails>({
    id: `PT-${Math.floor(Math.random() * 10000)}`,
    name: '',
    age: '',
    gender: 'Male',
    symptoms: '',
    history: ''
  });

  // Analysis State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Advanced Heatmap State
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [heatmapOpacity, setHeatmapOpacity] = useState(0.6);
  const [heatmapSpread, setHeatmapSpread] = useState(1.0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePatientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPatientInfo({ ...patientInfo, [e.target.name]: e.target.value });
  };

  const handlePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patientInfo.name && patientInfo.age) {
      setStep(2);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError("Please upload an image file (JPEG, PNG).");
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    if (!navigator.onLine) {
      setError("Offline Mode: Cannot perform AI Analysis. Please check internet connection.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysis = await analyzeLungScan(selectedFile, patientInfo);
      setResult(analysis);
      
      // Save to history
      const newRecord: PatientRecord = {
        ...patientInfo,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        result: analysis
      };
      setPatientHistory(prev => [newRecord, ...prev]);

    } catch (err: any) {
      setError(err.message || "Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAll = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setStep(1);
    setPatientInfo({
      id: `PT-${Math.floor(Math.random() * 10000)}`,
      name: '',
      age: '',
      gender: 'Male',
      symptoms: '',
      history: ''
    });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const resetScan = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // UI Helpers
  const getSeverityColor = (score: number) => {
    if (score <= 3) return 'text-green-500';
    if (score <= 6) return 'text-yellow-500';
    return 'text-red-600';
  };

  const getUrgencyBadge = (urgency: string) => {
    const styles = {
      'Routine': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
      'Semi-Urgent': 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300',
      'Urgent': 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300',
      'Critical': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300'
    };
    return styles[urgency as keyof typeof styles] || styles['Routine'];
  };

  // Radar Chart Data Prep
  const getRadarData = (res: AnalysisResult) => {
    const urgencyMap: Record<string, number> = {
      'Routine': 2, 'Semi-Urgent': 5, 'Urgent': 8, 'Critical': 10
    };
    
    // Normalize derived metrics
    return [
      { subject: 'Confidence', A: res.confidence / 10, fullMark: 10 },
      { subject: 'Severity', A: res.severityScore, fullMark: 10 },
      { subject: 'Urgency', A: urgencyMap[res.urgency] || 5, fullMark: 10 },
      { subject: 'Reliability', A: res.reliabilityScore, fullMark: 10 },
      { subject: 'Risk Factor', A: res.diagnosis === 'Malignant' ? 9 : res.diagnosis === 'Benign' ? 4 : 2, fullMark: 10 },
    ];
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Controls */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Diagnostic Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">AI-Assisted Pulmonary Analysis System</p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('analyze')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'analyze' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <Activity size={16} />
            Analysis
          </button>
          <button
            onClick={() => setViewMode('registry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              viewMode === 'registry' 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
          >
            <List size={16} />
            Patient Registry
          </button>
        </div>
      </div>

      {viewMode === 'registry' ? (
        // PATIENT REGISTRY VIEW
        <div className="glass-card rounded-2xl overflow-hidden dark:bg-slate-800 dark:border-slate-700">
          <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Clipboard className="w-5 h-5 text-blue-500" />
              Patient Registry
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search records..." 
                className="pl-9 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {patientHistory.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">
              <User className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p>No patients analyzed in this session.</p>
              <button onClick={() => setViewMode('analyze')} className="mt-4 text-blue-600 hover:underline">Start an analysis</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-900 text-xs uppercase text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-slate-700">
                    <th className="px-6 py-4 font-semibold">Time</th>
                    <th className="px-6 py-4 font-semibold">Patient ID</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Diagnosis</th>
                    <th className="px-6 py-4 font-semibold">Severity</th>
                    <th className="px-6 py-4 font-semibold">Urgency</th>
                    <th className="px-6 py-4 font-semibold">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                  {patientHistory.map((record, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{record.timestamp}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600 dark:text-gray-300">{record.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{record.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          record.result.diagnosis === 'Normal' || record.result.diagnosis === 'Benign' 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : record.result.diagnosis === 'Malignant'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                          {record.result.diagnosis}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-700 dark:text-gray-300">
                        {record.result.severityScore}/10
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyBadge(record.result.urgency)}`}>
                          {record.result.urgency}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {record.result.confidence}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        // ANALYZE VIEW
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Step 1: Patient Info */}
            {step === 1 && (
              <div className="glass-card rounded-2xl p-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-slate-700 pb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold dark:text-white">Patient Registration</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Step 1 of 2</p>
                  </div>
                </div>
                
                <form onSubmit={handlePatientSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient ID</label>
                      <input name="id" value={patientInfo.id} readOnly className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age</label>
                      <input name="age" type="number" value={patientInfo.age} onChange={handlePatientChange} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required placeholder="e.g. 54" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                    <input name="name" value={patientInfo.name} onChange={handlePatientChange} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" required placeholder="Enter full name" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                    <select name="gender" value={patientInfo.gender} onChange={handlePatientChange} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Symptoms</label>
                    <textarea name="symptoms" value={patientInfo.symptoms} onChange={handlePatientChange} rows={3} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="e.g. Persistent cough, chest pain..." />
                  </div>

                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4">
                    Next: Upload Scan <Activity size={16} />
                  </button>
                </form>
              </div>
            )}

            {/* Step 2: Upload Scan */}
            {step === 2 && (
              <>
                {/* Mini Patient Summary */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-100 dark:border-slate-700">
                      {patientInfo.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{patientInfo.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{patientInfo.gender}, {patientInfo.age} yrs • ID: {patientInfo.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setStep(1)} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Edit</button>
                </div>

                {/* Upload Card */}
                <div className="glass-card rounded-2xl p-6 dark:bg-slate-800 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold dark:text-white">Scan Upload</h3>
                    <div className="flex gap-2">
                       {result && (
                         <button onClick={resetAll} className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1">
                           <Plus size={14} /> New
                         </button>
                       )}
                       {previewUrl && !isAnalyzing && (
                         <button onClick={resetScan} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
                           <X size={14} /> Clear
                         </button>
                       )}
                    </div>
                  </div>

                  {!previewUrl ? (
                    <div 
                      className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-gray-50/50 dark:bg-slate-900/50"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 dark:text-gray-300 font-medium">Click to upload or drag & drop</p>
                      <p className="text-sm text-gray-400 mt-2">DICOM, JPEG, PNG supported</p>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileSelect}
                      />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative rounded-xl overflow-hidden bg-black aspect-square group">
                        <img 
                          src={previewUrl} 
                          alt="Scan Preview" 
                          className="w-full h-full object-contain" 
                        />
                        {isAnalyzing && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                            <div className="scan-line top-0"></div>
                            <Activity className="w-12 h-12 text-blue-500 animate-pulse mb-3" />
                            <p className="text-blue-400 font-medium animate-pulse">Analyzing tissue patterns...</p>
                          </div>
                        )}
                        
                        {/* Heatmap Layer */}
                        {result && showHeatmap && result.affectedAreaCoordinates && (
                          <div 
                            className="absolute pointer-events-none transition-all duration-300 ease-in-out"
                            style={{
                              left: `${result.affectedAreaCoordinates.x}%`,
                              top: `${result.affectedAreaCoordinates.y}%`,
                              width: `${(result.affectedAreaCoordinates.r * 2) * heatmapSpread}%`,
                              height: `${(result.affectedAreaCoordinates.r * 2) * heatmapSpread}%`,
                              transform: 'translate(-50%, -50%)',
                              background: `radial-gradient(circle, rgba(255,0,0, ${heatmapOpacity}) 0%, rgba(255,50,0, ${heatmapOpacity * 0.6}) 40%, rgba(255,0,0,0) 70%)`,
                              filter: 'blur(4px)'
                            }}
                          />
                        )}

                        {/* No Coordinates Found Overlay */}
                        {result && showHeatmap && !result.affectedAreaCoordinates && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full border border-white/20 whitespace-nowrap">
                            No specific focal point detected
                          </div>
                        )}
                      </div>

                      {/* Heatmap Controls */}
                      {result && (
                        <div className="bg-gray-50 dark:bg-slate-900 rounded-lg p-3 border border-gray-200 dark:border-slate-700">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Thermometer size={12} /> Heatmap Settings
                            </span>
                            <button 
                              onClick={() => setShowHeatmap(!showHeatmap)}
                              className={`text-xs px-2 py-1 rounded transition-colors ${
                                showHeatmap 
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                                  : 'bg-gray-200 text-gray-600 dark:bg-slate-700 dark:text-gray-400'
                              }`}
                            >
                              {showHeatmap ? <span className="flex items-center gap-1"><Eye size={12}/> Visible</span> : <span className="flex items-center gap-1"><EyeOff size={12}/> Hidden</span>}
                            </button>
                          </div>
                          
                          <div className={`space-y-3 transition-opacity ${showHeatmap ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 w-16">Opacity</span>
                              <input 
                                type="range" 
                                min="0.2" 
                                max="1" 
                                step="0.1" 
                                value={heatmapOpacity} 
                                onChange={(e) => setHeatmapOpacity(parseFloat(e.target.value))}
                                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-blue-600"
                              />
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-500 w-16">Intensity</span>
                              <input 
                                type="range" 
                                min="0.5" 
                                max="2" 
                                step="0.1" 
                                value={heatmapSpread} 
                                onChange={(e) => setHeatmapSpread(parseFloat(e.target.value))}
                                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-red-600"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  {!result && previewUrl && (
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isAnalyzing ? 'Processing...' : 'Run ML Diagnostics'}
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-7">
            {result ? (
              <div className="glass-card rounded-2xl p-6 md:p-8 animate-in slide-in-from-bottom-4 duration-700 dark:bg-slate-800 dark:border-slate-700 h-full">
                
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white">Analysis Report</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Generated by Enterprise ML Vision</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border ${
                    result.diagnosis === 'Normal' || result.diagnosis === 'Benign' 
                      ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400' 
                      : result.diagnosis === 'Uncertain'
                      ? 'bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                      : 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'
                  }`}>
                    <div className="text-xs uppercase tracking-wider font-semibold opacity-70">Diagnosis</div>
                    <div className="text-xl font-bold">{result.diagnosis}</div>
                  </div>
                </div>

                {/* Safety/Reliability Warning */}
                {result.reliabilityScore < 7 && (
                  <div className="mb-6 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-orange-800 dark:text-orange-300">Low Image Quality Detected</h4>
                      <p className="text-xs text-orange-700 dark:text-orange-400 mt-0.5">
                        The model reported a reliability score of {result.reliabilityScore}/10. Results may be less accurate due to image artifacts, blur, or improper cropping. Please review manually.
                      </p>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   {/* Metrics Grid */}
                   <div className="space-y-4">
                      {/* Confidence */}
                      <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Model Confidence</div>
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-gray-900 dark:text-white">{result.confidence}%</span>
                          <div className="h-1.5 flex-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${result.confidence}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Severity Score */}
                      <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Severity Score</div>
                        <div className="flex items-center justify-between">
                          <span className={`text-2xl font-bold ${getSeverityColor(result.severityScore)}`}>
                            {result.severityScore}<span className="text-sm text-gray-400 font-normal">/10</span>
                          </span>
                          <Activity className={`w-5 h-5 ${getSeverityColor(result.severityScore)}`} />
                        </div>
                      </div>

                       {/* Urgency */}
                       <div className="p-4 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700">
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Recommended Urgency</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getUrgencyBadge(result.urgency)}`}>
                          {result.urgency}
                        </span>
                      </div>
                   </div>
                   
                   {/* Radar Chart */}
                   <div className="bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-700 p-2 flex items-center justify-center min-h-[250px]">
                      <ResponsiveContainer width="100%" height={250}>
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(result)}>
                          <PolarGrid stroke="#94a3b8" strokeOpacity={0.5} />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                          <Radar
                            name="Metrics"
                            dataKey="A"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.3}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            itemStyle={{ color: '#2563eb' }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                   </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="flex items-center gap-2 text-md font-semibold text-gray-900 dark:text-white mb-2">
                      <FileText className="w-4 h-4 text-blue-500" /> Summary
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30 text-sm">
                      {result.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="flex items-center gap-2 text-md font-semibold text-gray-900 dark:text-white mb-3">
                        <CheckCircle className="w-4 h-4 text-green-500" /> Findings
                      </h3>
                      <ul className="space-y-2">
                        {result.findings.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 mt-1.5 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="flex items-center gap-2 text-md font-semibold text-gray-900 dark:text-white mb-3">
                        <Clipboard className="w-4 h-4 text-purple-500" /> Recommendations
                      </h3>
                      <ul className="space-y-2">
                        {result.recommendations.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-300 dark:bg-purple-900 mt-1.5 flex-shrink-0"></span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {result.stage && (
                     <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Estimated Staging</span>
                        <span className="font-mono font-bold text-gray-900 dark:text-white">{result.stage}</span>
                     </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="h-full flex items-center justify-center min-h-[400px] glass-card rounded-2xl p-8 text-center dark:bg-slate-800 dark:border-slate-700">
                <div className="max-w-md">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Ready for Analysis</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Complete the patient form and upload a scan to receive AI-powered diagnostic insights, heatmaps, and detailed pathology reports.
                  </p>
                  {!navigator.onLine && (
                     <p className="mt-4 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">
                       Network Unavailable. Please connect to the internet to access AI models.
                     </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
