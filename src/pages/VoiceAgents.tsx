import React, { useState } from 'react';
import { 
  Bot, 
  Plus, 
  Settings, 
  Play, 
  Pause, 
  MoreHorizontal,
  Phone,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Activity,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import StatsCard from '@/components/Dashboard/StatsCard';

interface VoiceAgent {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'training';
  type: 'appointment' | 'follow-up' | 'screening' | 'general';
  callsToday: number;
  totalCalls: number;
  successRate: number;
  avgDuration: string;
  lastActive: string;
  language: string;
  specialty: string;
}

const VoiceAgents = () => {
  const [agents] = useState<VoiceAgent[]>([
    {
      id: '1',
      name: 'Appointment Scheduler',
      description: 'Handles appointment bookings and confirmations',
      status: 'active',
      type: 'appointment',
      callsToday: 23,
      totalCalls: 1247,
      successRate: 89,
      avgDuration: '3:45',
      lastActive: '2 minutes ago',
      language: 'English',
      specialty: 'General Practice'
    },
    {
      id: '2',
      name: 'Follow-up Assistant',
      description: 'Post-consultation follow-up calls and monitoring',
      status: 'active',
      type: 'follow-up',
      callsToday: 15,
      totalCalls: 892,
      successRate: 94,
      avgDuration: '5:12',
      lastActive: '5 minutes ago',
      language: 'English',
      specialty: 'Cardiology'
    }
  ]);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    aboutMe: ''
  });

  const handleCreateAgent = () => {
    // TODO: Implement agent creation logic here
    console.log('Creating new agent:', newAgent);
    
    // Reset form and close modal
    setNewAgent({ name: '', aboutMe: '' });
    setIsCreateModalOpen(false);
  };

  const getStatusBadge = (status: VoiceAgent['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">Inactive</Badge>;
      case 'training':
        return <Badge className="bg-accent/10 text-accent border-accent/20">Training</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getTypeBadge = (type: VoiceAgent['type']) => {
    const badges = {
      appointment: { label: 'Appointment', className: 'bg-primary/10 text-primary border-primary/20' },
      'follow-up': { label: 'Follow-up', className: 'bg-secondary/10 text-secondary border-secondary/20' },
      screening: { label: 'Screening', className: 'bg-accent/10 text-accent border-accent/20' },
      general: { label: 'General', className: 'bg-gray-100 text-gray-600 border-gray-200' }
    };
    
    const badge = badges[type];
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Voice Agents</h1>
          <p className="text-gray-600">Create, configure, and monitor AI voice agents for patient calls</p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary/90 rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Create New Voice Agent</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Enter agent name..."
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  style={{ 
                    boxShadow: 'none',
                    WebkitBoxShadow: 'none'
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="aboutMe">Role Description</Label>
                <Textarea
                  id="aboutMe"
                  placeholder="Describe the agent's role and capabilities..." 
                  value={newAgent.aboutMe}
                  onChange={(e) => setNewAgent({ ...newAgent, aboutMe: e.target.value })}
                  rows={3}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  style={{ 
                    boxShadow: 'none',
                    WebkitBoxShadow: 'none'
                  }}
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateModalOpen(false)}
                className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-800 focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 focus:text-gray-800 focus:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleCreateAgent}
                disabled={!newAgent.name || !newAgent.aboutMe}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Create Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Agents"
          value={2}
          subtitle="Currently handling calls"
          icon={Bot}
          variant="success"
        />
        <StatsCard
          title="Total Calls Today"
          value={38}
          subtitle="Across all agents"
          icon={Phone}
          trend={{ value: 15, isPositive: true }}
          variant="primary"
        />
        <StatsCard
          title="Average Success Rate"
          value="88%"
          subtitle="Call completion rate"
          icon={CheckCircle}
          trend={{ value: 3, isPositive: true }}
          variant="success"
        />
        <StatsCard
          title="Total Agent Hours"
          value="12.5h"
          subtitle="Active time today"
          icon={Clock}
          variant="secondary"
        />
      </div>

      {/* Voice Agents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow rounded-xl bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Bot className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">{agent.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">{agent.description}</CardDescription>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem className="rounded-lg">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Configuration
                    </DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600 rounded-lg">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                {getStatusBadge(agent.status)}
                {getTypeBadge(agent.type)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Agent Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{agent.callsToday}</div>
                  <div className="text-xs text-gray-600">Calls Today</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-2xl font-bold text-gray-900">{agent.successRate}%</div>
                  <div className="text-xs text-gray-600">Success Rate</div>
                </div>
              </div>

              {/* Agent Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Calls:</span>
                  <span className="font-medium text-gray-900">{agent.totalCalls.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Avg Duration:</span>
                  <span className="font-medium text-gray-900">{agent.avgDuration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium text-gray-900">{agent.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialty:</span>
                  <span className="font-medium text-gray-900">{agent.specialty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Active:</span>
                  <span className="font-medium text-gray-900">{agent.lastActive}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                {agent.status === 'active' ? (
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                )}
                <Button variant="outline" size="sm" className="flex-1 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                  <Activity className="w-4 h-4 mr-2" />
                  Monitor
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="border border-gray-200 shadow-sm rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-primary" />
            <span>Recent Agent Activity</span>
          </CardTitle>
          <CardDescription>Latest voice agent interactions and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                agent: 'Appointment Scheduler',
                action: 'Completed call with Sarah Johnson',
                time: '2 minutes ago',
                status: 'success',
                duration: '3:45'
              },
              {
                agent: 'Follow-up Assistant',
                action: 'Post-consultation follow-up with Mike Davis',
                time: '8 minutes ago',
                status: 'success',
                duration: '5:12'
              },
              {
                agent: 'Appointment Scheduler',
                action: 'Failed to connect with Emma Wilson',
                time: '15 minutes ago',
                status: 'failed',
                duration: '0:45'
              },
              {
                agent: 'Follow-up Assistant',
                action: 'Collected health data from Tom Brown',
                time: '23 minutes ago',
                status: 'success',
                duration: '6:30'
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' : 'bg-red-500'
                  }`} />
                  <div>
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.agent}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{activity.duration}</div>
                  <div className="text-xs text-gray-600">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAgents;