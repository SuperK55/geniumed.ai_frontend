import React from 'react';
import { Clock, Phone, MessageSquare, User, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface QueueItem {
  id: string;
  patientName: string;
  phone: string;
  channel: 'whatsapp' | 'phone' | 'web';
  status: 'qualifying' | 'payment_pending' | 'confirmed' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  chiefComplaint: string;
  estimatedValue: number;
  lastMessage: string;
  timestamp: string;
  aiSummary?: string;
}

const AppointmentQueue = () => {
  const queueItems: QueueItem[] = [
    {
      id: '1',
      patientName: 'Maria Silva',
      phone: '+55 11 99999-9999',
      channel: 'whatsapp',
      status: 'payment_pending',
      priority: 'high',
      chiefComplaint: 'Chest pain for 2 days',
      estimatedValue: 350,
      lastMessage: 'Can you generate the payment link?',
      timestamp: '10:30',
      aiSummary: 'Patient with cardiac urgency, already qualified, awaiting payment'
    },
    {
      id: '2',
      patientName: 'João Santos',
      phone: '+55 11 88888-8888',
      channel: 'phone',
      status: 'qualifying',
      priority: 'medium',
      chiefComplaint: 'Preventive check-up',
      estimatedValue: 280,
      lastMessage: 'I have Bradesco health insurance',
      timestamp: '09:15',
      aiSummary: 'Patient interested in preventive consultation, checking coverage'
    },
    {
      id: '3',
      patientName: 'Ana Costa',
      phone: '+55 11 77777-7777',
      channel: 'whatsapp',
      status: 'confirmed',
      priority: 'low',
      chiefComplaint: 'Follow-up - hypertension',
      estimatedValue: 250,
      lastMessage: 'Confirmed for tomorrow at 2 PM',
      timestamp: '08:45',
      aiSummary: 'Patient under follow-up care, appointment confirmed'
    }
  ];

  const getChannelIcon = (channel: QueueItem['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return MessageSquare;
      case 'phone':
        return Phone;
      case 'web':
        return User;
    }
  };

  const getStatusBadge = (status: QueueItem['status']) => {
    switch (status) {
      case 'qualifying':
        return { variant: 'secondary' as const, label: 'Qualifying', icon: Clock };
      case 'payment_pending':
        return { variant: 'destructive' as const, label: 'Awaiting Payment', icon: Clock };
      case 'confirmed':
        return { variant: 'default' as const, label: 'Confirmed', icon: CheckCircle };
      case 'cancelled':
        return { variant: 'outline' as const, label: 'Cancelled', icon: XCircle };
    }
  };

  const getPriorityColor = (priority: QueueItem['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-l-destructive bg-destructive/5';
      case 'medium':
        return 'border-l-warning bg-warning/5';
      case 'low':
        return 'border-l-success bg-success/5';
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Appointment Queue</h3>
            <p className="text-sm text-muted-foreground">Active AI conversations</p>
          </div>
        </div>
        
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {queueItems.length} in progress
        </Badge>
      </div>

      <div className="space-y-4">
        {queueItems.map((item) => {
          const ChannelIcon = getChannelIcon(item.channel);
          const statusInfo = getStatusBadge(item.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div
              key={item.id}
              className={cn(
                "border-l-4 p-4 rounded-lg bg-card transition-all duration-200",
                "hover:shadow-card hover:shadow-md",
                getPriorityColor(item.priority)
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <ChannelIcon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-foreground">{item.patientName}</h4>
                      <Badge variant={statusInfo.variant} className="text-xs">
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusInfo.label}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-1">{item.phone}</p>
                    <p className="text-sm text-foreground font-medium">{item.chiefComplaint}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold text-success">
                    R$ {item.estimatedValue}
                  </div>
                  <div className="text-xs text-muted-foreground">{item.timestamp}</div>
                </div>
              </div>

              {item.aiSummary && (
                <div className="bg-medical-light-blue p-3 rounded-lg mb-3">
                  <div className="flex items-start space-x-2">
                    <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-white font-bold">AI</span>
                    </div>
                    <p className="text-xs text-primary font-medium">{item.aiSummary}</p>
                  </div>
                </div>
              )}

              <div className="bg-muted/50 p-3 rounded-lg mb-3">
                <p className="text-sm text-muted-foreground italic">
                  "{item.lastMessage}"
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    View Conversation
                  </Button>
                  {item.status === 'payment_pending' && (
                    <Button size="sm" className="bg-success hover:bg-success/90">
                      Generate Payment
                    </Button>
                  )}
                  {item.status === 'qualifying' && (
                    <Button size="sm">
                      Continue AI
                    </Button>
                  )}
                </div>
                
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-xs",
                    item.priority === 'high' && "border-destructive text-destructive",
                    item.priority === 'medium' && "border-warning text-warning",
                    item.priority === 'low' && "border-success text-success"
                  )}
                >
                  Priority {item.priority}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex space-x-3">
          <Button className="flex-1" variant="outline">
            View All Conversations
          </Button>
          <Button className="flex-1">
            Configure AI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentQueue;