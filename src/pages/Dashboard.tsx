import React from 'react';
import { 
  Calendar, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  Brain, 
  AlertTriangle, 
  CheckCircle,
  Stethoscope,
  Heart,
  Phone,
  FileText
} from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const Dashboard = () => {
  return (
    <div className="space-y-8 bg-gray-50">

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Appointments"
          value={24}
          subtitle="8 confirmed, 16 scheduled"
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="Active Patients"
          value={1247}
          subtitle="89 new this month"
          icon={Users}
          trend={{ value: 8, isPositive: true }}
          variant="secondary"
        />
        <StatsCard
          title="Follow-up Rate"
          value="94%"
          subtitle="Patient compliance"
          icon={Heart}
          trend={{ value: 3, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Revenue Today"
          value="$8,450"
          subtitle="Goal: $10,000"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
          variant="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-gray-200 rounded-xl !bg-white">
            <CardHeader className="pb-4 !bg-white">
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Today's Schedule</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 !bg-white">
              {[
                { time: '09:00', patient: 'Sarah Johnson', type: 'Consultation', status: 'confirmed' },
                { time: '09:30', patient: 'Michael Davis', type: 'Follow-up', status: 'confirmed' },
                { time: '10:00', patient: 'Emma Wilson', type: 'Check-up', status: 'pending' },
                { time: '10:30', patient: 'James Brown', type: 'Consultation', status: 'confirmed' },
                { time: '11:00', patient: 'Lisa Garcia', type: 'Follow-up', status: 'confirmed' },
              ].map((appointment, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium text-gray-900 w-16">{appointment.time}</div>
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">{appointment.patient}</div>
                      <div className="text-sm text-gray-600">{appointment.type}</div>
                    </div>
                  </div>
                  <Badge 
                    className={
                      appointment.status === 'confirmed' 
                        ? 'bg-success/10 text-success border-success/20' 
                        : 'bg-accent/10 text-accent border-accent/20'
                    }
                  >
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">

          {/* Quick Stats */}
          <Card className="shadow-sm border-gray-200 rounded-xl !bg-white">
            <CardHeader className="pb-4 !bg-white">
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Activity className="w-5 h-5 text-primary" />
                <span>Quick Stats</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 !bg-white">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">AI Consultations</span>
                <span className="font-semibold text-primary">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-secondary">2.3 min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Satisfaction</span>
                <span className="font-semibold text-success">9.2/10</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Voice Calls Today"
          value={156}
          subtitle="AI-handled consultations"
          icon={Phone}
          variant="default"
        />
        <StatsCard
          title="Documents Generated"
          value={89}
          subtitle="Auto-transcribed notes"
          icon={FileText}
          variant="default"
        />
        <StatsCard
          title="AI Accuracy"
          value="97.8%"
          subtitle="Documentation precision"
          icon={Brain}
          variant="default"
        />
        <StatsCard
          title="Time Saved"
          value="4.5h"
          subtitle="Daily automation benefit"
          icon={Clock}
          variant="default"
        />
      </div>

      {/* Recent Activity */}
      <Card className="shadow-sm border-gray-200 rounded-xl !bg-white">
        <CardHeader className="pb-4 !bg-white">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <Activity className="w-5 h-5 text-primary" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="!bg-white">
          <div className="space-y-4">
            {[
              { icon: Stethoscope, action: 'Consultation completed with Sarah Johnson', time: '5 minutes ago', color: 'text-primary' },
              { icon: Heart, action: 'Follow-up response received from Mike Davis', time: '12 minutes ago', color: 'text-secondary' },
              { icon: Calendar, action: 'New appointment scheduled for tomorrow', time: '23 minutes ago', color: 'text-accent' },
              { icon: FileText, action: 'Medical report generated for Emma Wilson', time: '1 hour ago', color: 'text-gray-600' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50">
                <activity.icon className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{activity.action}</div>
                  <div className="text-sm text-gray-600">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 