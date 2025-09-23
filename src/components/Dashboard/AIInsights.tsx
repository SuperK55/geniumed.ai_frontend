import React from 'react';
import { Brain, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AIInsight {
  id: string;
  type: 'opportunity' | 'alert' | 'suggestion' | 'success';
  title: string;
  description: string;
  action?: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact?: string;
}

const AIInsights = () => {
  const insights: AIInsight[] = [
    {
      id: '1',
      type: 'alert',
      title: '15 patients without return for +3 months',
      description: 'Patients who may need follow-up care. Retention rate dropped 12% this month.',
      action: 'Send reminders',
      priority: 'high',
      estimatedImpact: '+$4,500 potential'
    },
    {
      id: '2',
      type: 'opportunity',
      title: '8 vacant slots this week',
      description: 'Available slots during prime hours. Suggestion: express booking campaign.',
      action: 'Create campaign',
      priority: 'medium',
      estimatedImpact: '+$2,400 revenue'
    },
    {
      id: '3',
      type: 'suggestion',
      title: 'Automatic follow-up working well',
      description: '89% of patients respond positively to 48-hour follow-ups.',
      action: 'Expand strategy',
      priority: 'low',
      estimatedImpact: 'Improved satisfaction'
    },
    {
      id: '4',
      type: 'success',
      title: 'Documentation goal achieved',
      description: '95% of consultations documented in under 5 minutes with AI.',
      priority: 'low'
    }
  ];

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'alert':
        return AlertTriangle;
      case 'opportunity':
        return TrendingUp;
      case 'suggestion':
        return Brain;
      case 'success':
        return CheckCircle;
    }
  };

  const getInsightStyle = (type: AIInsight['type'], priority: AIInsight['priority']) => {
    const baseStyle = "border-l-4";
    
    switch (type) {
      case 'alert':
        return `${baseStyle} border-destructive bg-destructive/5`;
      case 'opportunity':
        return `${baseStyle} border-warning bg-warning/5`;
      case 'suggestion':
        return `${baseStyle} border-primary bg-primary/5`;
      case 'success':
        return `${baseStyle} border-success bg-success/5`;
    }
  };

  const getPriorityBadge = (priority: AIInsight['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive';
      case 'medium':
        return 'bg-warning/10 text-warning';
      case 'low':
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="stats-card bg-none border border-border/50 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <div className="gradient-secondary p-3 rounded-xl shadow-lg">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground">AI Insights</h3>
          <p className="text-sm text-muted-foreground/80">Intelligent suggestions to optimize your practice</p>
        </div>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          
          return (
            <div
              key={insight.id}
              className={cn(
                "p-4 rounded-xl transition-all duration-300 hover:scale-[1.01] backdrop-blur-sm",
                "bg-muted/15 border border-border/30",
                getInsightStyle(insight.type, insight.priority)
              )}
            >
              <div className="flex items-start space-x-4">
                <div className={cn(
                  "p-2 rounded-lg shadow-sm",
                  insight.type === 'alert' && "bg-destructive/20",
                  insight.type === 'opportunity' && "bg-warning/20",
                  insight.type === 'suggestion' && "bg-primary/20",
                  insight.type === 'success' && "bg-success/20"
                )}>
                  <Icon className={cn(
                    "w-5 h-5",
                    insight.type === 'alert' && "text-destructive",
                    insight.type === 'opportunity' && "text-warning",
                    insight.type === 'suggestion' && "text-primary",
                    insight.type === 'success' && "text-success"
                  )} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-foreground">{insight.title}</h4>
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full backdrop-blur-sm",
                      getPriorityBadge(insight.priority)
                    )}>
                      {insight.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground/90 mb-4 leading-relaxed">
                    {insight.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    {insight.estimatedImpact && (
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {insight.estimatedImpact}
                      </span>
                    )}
                    
                    {insight.action && (
                      <Button
                        size="sm"
                        className="ml-auto bg-primary text-primary-foreground font-medium shadow-lg hover:shadow-xl"
                      >
                        {insight.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-border/50">
        <Button className="w-full bg-secondary text-secondary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
          View All AI Suggestions
        </Button>
      </div>
    </div>
  );
};

export default AIInsights;