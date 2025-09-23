import React, { useState } from 'react';
import { Clock, MessageSquare, AlertTriangle, CheckCircle, TrendingUp, Brain, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface FollowUpItem {
  id: string;
  patientName: string;
  consultationDate: string;
  followUpType: 'automatic' | 'critical' | 'manual';
  scheduledDate: string;
  status: 'pending' | 'sent' | 'responded' | 'requires_attention';
  priority: 'high' | 'medium' | 'low';
  patientResponse?: string;
  aiAnalysis?: {
    sentiment: 'positive' | 'neutral' | 'negative' | 'critical';
    adherence: 'good' | 'partial' | 'poor';
    symptoms: 'improved' | 'stable' | 'worsened';
    summary: string;
  };
  messageTemplate: string;
}

const FollowUpMonitor = () => {
  const [selectedFollowUp, setSelectedFollowUp] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');

  const followUps: FollowUpItem[] = [
    {
      id: '1',
      patientName: 'Maria Silva',
      consultationDate: '2024-01-20',
      followUpType: 'critical',
      scheduledDate: '2024-01-22',
      status: 'requires_attention',
      priority: 'high',
      patientResponse: 'The chest pain came back this morning, it\'s stronger than before. I\'m worried.',
      aiAnalysis: {
        sentiment: 'critical',
        adherence: 'good',
        symptoms: 'worsened',
        summary: 'Patient reports worsening cardiac symptoms. Requires immediate medical attention.'
      },
      messageTemplate: 'Hi Maria! How are you feeling after the consultation? Are you taking your medications correctly?'
    },
    {
      id: '2',
      patientName: 'João Santos',
      consultationDate: '2024-01-19',
      followUpType: 'automatic',
      scheduledDate: '2024-01-21',
      status: 'responded',
      priority: 'low',
      patientResponse: 'I\'m much better! The medication is working and I no longer feel pain.',
      aiAnalysis: {
        sentiment: 'positive',
        adherence: 'good',
        symptoms: 'improved',
        summary: 'Excellent progress. Patient adherent to treatment with complete symptom improvement.'
      },
      messageTemplate: 'Hello João! How is your treatment going? Do you need any clarification?'
    },
    {
      id: '3',
      patientName: 'Ana Costa',
      consultationDate: '2024-01-18',
      followUpType: 'automatic',
      scheduledDate: 'Today',
      status: 'pending',
      priority: 'medium',
      messageTemplate: 'Hi Ana! How are you? How is your hypertension progressing? Are you measuring your blood pressure regularly?'
    }
  ];

  const getStatusBadge = (status: FollowUpItem['status']) => {
    switch (status) {
      case 'pending':
        return { variant: 'secondary' as const, label: 'Pending', icon: Clock };
      case 'sent':
        return { variant: 'outline' as const, label: 'Sent', icon: Send };
      case 'responded':
        return { variant: 'default' as const, label: 'Responded', icon: MessageSquare };
      case 'requires_attention':
        return { variant: 'destructive' as const, label: 'Requires Attention', icon: AlertTriangle };
    }
  };

  const getPriorityColor = (priority: FollowUpItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-destructive bg-destructive/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      case 'low':
        return 'border-l-success bg-success/5';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-success bg-success/10';
      case 'neutral':
        return 'text-muted-foreground bg-muted';
      case 'negative':
        return 'text-warning bg-warning/10';
      case 'critical':
        return 'text-destructive bg-destructive/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getAdherenceIcon = (adherence: string) => {
    switch (adherence) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'partial':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'poor':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const sendFollowUp = (id: string) => {
    console.log('Enviando follow-up:', id);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Post-Consultation Monitoring</h3>
          <p className="text-sm text-muted-foreground">Automatic follow-ups and AI analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {followUps.map((followUp) => {
          const statusInfo = getStatusBadge(followUp.status);
          const StatusIcon = statusInfo.icon;
          const isExpanded = selectedFollowUp === followUp.id;
          
          return (
            <div
              key={followUp.id}
              className={cn(
                "border-l-4 p-4 rounded-lg bg-card transition-all duration-200",
                "hover:shadow-card hover:shadow-md cursor-pointer",
                getPriorityColor(followUp.priority)
              )}
              onClick={() => setSelectedFollowUp(isExpanded ? null : followUp.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <StatusIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{followUp.patientName}</h4>
                      <Badge variant={statusInfo.variant} className="text-xs">
                        {statusInfo.label}
                      </Badge>
                      {followUp.followUpType === 'critical' && (
                        <Badge variant="destructive" className="text-xs">
                          Critical
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">
                      Consultation: {followUp.consultationDate} • Follow-up: {followUp.scheduledDate}
                    </p>
                  </div>
                </div>
                
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    followUp.priority === 'high' && "border-destructive text-destructive",
                    followUp.priority === 'medium' && "border-warning text-warning",
                    followUp.priority === 'low' && "border-success text-success"
                  )}
                >
                  {followUp.priority}
                </Badge>
              </div>

              {/* AI Analysis Preview */}
              {followUp.aiAnalysis && (
                <div className="bg-medical-light-blue p-3 rounded-lg mb-3">
                  <div className="flex items-start space-x-2">
                    <Brain className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs text-primary font-medium mb-2">{followUp.aiAnalysis.summary}</p>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {getAdherenceIcon(followUp.aiAnalysis.adherence)}
                          <span className="text-xs text-muted-foreground">Adherence: {followUp.aiAnalysis.adherence}</span>
                        </div>
                        <Badge className={cn("text-xs", getSentimentColor(followUp.aiAnalysis.sentiment))}>
                          {followUp.aiAnalysis.symptoms}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Patient Response */}
              {followUp.patientResponse && (
                <div className="bg-muted/50 p-3 rounded-lg mb-3">
                  <p className="text-sm text-muted-foreground italic">
                    "{followUp.patientResponse}"
                  </p>
                </div>
              )}

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="mb-4">
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Follow-up Message
                    </label>
                    <Textarea
                      value={customMessage || followUp.messageTemplate}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      className="min-h-20"
                      placeholder="Customize the message..."
                    />
                  </div>

                  {followUp.aiAnalysis && (
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-foreground">Detailed AI Analysis</h5>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Sentiment:</span>
                            <Badge className={cn("text-xs", getSentimentColor(followUp.aiAnalysis.sentiment))}>
                              {followUp.aiAnalysis.sentiment}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Adherence:</span>
                            <span className="font-medium">{followUp.aiAnalysis.adherence}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Symptoms:</span>
                            <span className="font-medium">{followUp.aiAnalysis.symptoms}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-foreground">AI Recommendations</h5>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {followUp.status === 'requires_attention' && (
                            <div className="text-destructive font-medium">
                              • Urgent medical contact recommended
                            </div>
                          )}
                          <div>• Maintain follow-up protocol</div>
                          <div>• Next follow-up in 3 days</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    {followUp.status === 'pending' && (
                      <Button 
                        size="sm" 
                        onClick={() => sendFollowUp(followUp.id)}
                        className="bg-success hover:bg-success/90"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Follow-up
                      </Button>
                    )}
                    
                    {followUp.status === 'requires_attention' && (
                      <>
                        <Button size="sm" variant="destructive">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Mark Urgent
                        </Button>
                        <Button size="sm" variant="outline">
                          Call Patient
                        </Button>
                      </>
                    )}
                    
                    <Button size="sm" variant="outline">
                      View History
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-success">89%</div>
            <div className="text-xs text-muted-foreground">Response Rate</div>
          </div>
          <div>
            <div className="text-lg font-bold text-primary">24h</div>
            <div className="text-xs text-muted-foreground">Average Time</div>
          </div>
          <div>
            <div className="text-lg font-bold text-warning">3</div>
            <div className="text-xs text-muted-foreground">Requires Attention</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowUpMonitor;