import React, { useState } from 'react';
import { Mic, MicOff, Play, Pause, Square, FileText, Upload, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ConsultationData {
  chiefComplaint: string;
  physicalExam: string;
  diagnosis: string;
  treatmentPlan: string;
  prescriptions: Array<{
    medication: string;
    dosage: string;
    duration: string;
  }>;
}

const ConsultationRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [consultationData, setConsultationData] = useState<ConsultationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulated consultation data for demo
  const mockConsultationData: ConsultationData = {
    chiefComplaint: 'Patient reports sudden onset chest pain for 2 days, oppressive in nature, radiating to left arm.',
    physicalExam: 'BP: 140/90 mmHg, HR: 92 bpm, normal cardiac auscultation, no murmurs. Clear lungs bilaterally.',
    diagnosis: 'Atypical chest pain - likely muscular origin. Rule out acute coronary syndrome.',
    treatmentPlan: 'Analgesic for 5 days, relative rest, return if worsening. Order ECG and troponin.',
    prescriptions: [
      {
        medication: 'Ibuprofen 600mg',
        dosage: '1 tablet every 8 hours',
        duration: '5 days'
      },
      {
        medication: 'Omeprazole 20mg',
        dosage: '1 capsule on empty stomach',
        duration: '14 days'
      }
    ]
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    // Simulate recording timer
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    setTimeout(() => {
      clearInterval(timer);
      setIsRecording(false);
      setTranscription('45-year-old male patient seeks care due to chest pain that started 2 days ago. Reports oppressive pain radiating to left arm, especially during exertion. Denies dyspnea, palpitations, or syncope. Hypertensive with irregular medication use...');
    }, 5000);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
  };

  const handleProcessWithAI = () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setConsultationData(mockConsultationData);
      setIsProcessing(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Consultation Documentation</h3>
          <p className="text-sm text-muted-foreground">Record or type consultation information</p>
        </div>
      </div>

      {/* Recording Controls */}
      <div className="bg-medical-gray rounded-xl p-6 mb-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <Button
            size="lg"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={cn(
              "w-16 h-16 rounded-full",
              isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
            )}
          >
            {isRecording ? (
              <Square className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-white" />
            )}
          </Button>
          
          {transcription && (
            <>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
              </Button>
              
              <Button size="lg" variant="outline" className="w-12 h-12 rounded-full">
                <Upload className="w-5 h-5" />
              </Button>
            </>
          )}
        </div>

        <div className="text-center">
          <div className="text-2xl font-mono font-bold text-foreground mb-2">
            {formatTime(recordingTime)}
          </div>
          {isRecording && (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
              <span className="text-sm text-destructive font-medium">Recording...</span>
            </div>
          )}
        </div>
      </div>

      {/* Transcription */}
      {transcription && (
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <h4 className="font-medium text-foreground">Transcription</h4>
            <Button size="sm" variant="outline" onClick={handleProcessWithAI} disabled={isProcessing}>
              <Brain className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing AI...' : 'Process with AI'}
            </Button>
          </div>
          
          <Textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="min-h-32"
            placeholder="Transcription will appear here..."
          />
          
          {isProcessing && (
            <div className="mt-3">
              <div className="flex items-center space-x-2 mb-2">
                <Brain className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-sm text-primary">AI analyzing consultation...</span>
              </div>
              <Progress value={66} className="h-2" />
            </div>
          )}
        </div>
      )}

      {/* AI Structured Results */}
      {consultationData && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-success" />
            <span className="text-sm text-success font-medium">Structured by AI</span>
          </div>

          <div className="grid gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Chief Complaint
              </label>
              <Textarea
                value={consultationData.chiefComplaint}
                className="min-h-20"
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  chiefComplaint: e.target.value
                })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Physical Exam
              </label>
              <Textarea
                value={consultationData.physicalExam}
                className="min-h-20"
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  physicalExam: e.target.value
                })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Diagnosis
              </label>
              <Textarea
                value={consultationData.diagnosis}
                className="min-h-20"
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  diagnosis: e.target.value
                })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Treatment Plan
              </label>
              <Textarea
                value={consultationData.treatmentPlan}
                className="min-h-20"
                onChange={(e) => setConsultationData({
                  ...consultationData,
                  treatmentPlan: e.target.value
                })}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Prescriptions
              </label>
              <div className="space-y-3">
                {consultationData.prescriptions.map((prescription, index) => (
                  <div key={index} className="bg-muted/50 p-3 rounded-lg">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Medication</label>
                        <input
                          type="text"
                          value={prescription.medication}
                          className="w-full mt-1 px-2 py-1 text-sm bg-background border border-border rounded"
                          onChange={(e) => {
                            const newPrescriptions = [...consultationData.prescriptions];
                            newPrescriptions[index].medication = e.target.value;
                            setConsultationData({
                              ...consultationData,
                              prescriptions: newPrescriptions
                            });
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Dosage</label>
                        <input
                          type="text"
                          value={prescription.dosage}
                          className="w-full mt-1 px-2 py-1 text-sm bg-background border border-border rounded"
                          onChange={(e) => {
                            const newPrescriptions = [...consultationData.prescriptions];
                            newPrescriptions[index].dosage = e.target.value;
                            setConsultationData({
                              ...consultationData,
                              prescriptions: newPrescriptions
                            });
                          }}
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Duration</label>
                        <input
                          type="text"
                          value={prescription.duration}
                          className="w-full mt-1 px-2 py-1 text-sm bg-background border border-border rounded"
                          onChange={(e) => {
                            const newPrescriptions = [...consultationData.prescriptions];
                            newPrescriptions[index].duration = e.target.value;
                            setConsultationData({
                              ...consultationData,
                              prescriptions: newPrescriptions
                            });
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button className="flex-1" variant="outline">
              Save Draft
            </Button>
            <Button className="flex-1">
              Complete Consultation
            </Button>
            <Button variant="outline">
              Generate Prescription PDF
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationRecorder;