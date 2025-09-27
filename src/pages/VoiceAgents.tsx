import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
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
  agent_name: string;
  agent_role: string;
  service_description: string;
  assistant_name: string;
  script: {
    greeting?: string;
    service_description?: string;
    availability?: string;
  };
  language: string;
  voice_id: string;
  ambient_sound: string;
  is_active: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

const VoiceAgents = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({
    agent_name: '',
    agent_role: '',
    service_description: '',
    assistant_name: '',
    script: {
      greeting: '',
      service_description: '',
      availability: ''
    }
  });

  // Fetch agents from API
  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/agents', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAgents(data.agents || []);
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreateAgent = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('No authentication token found. Please sign in again.');
        return;
      }

      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAgent)
      });

      if (response.ok) {
        const data = await response.json();
        setAgents([...agents, data.agent]);
        resetForm();
        setIsCreateModalOpen(false);
        alert('Agent created successfully!');
      } else {
        const error = await response.json();
        alert(`Error creating agent: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      alert('Error creating agent. Please try again.');
    }
  };

  const resetForm = () => {
    setNewAgent({
      agent_name: '',
      agent_role: '',
      service_description: '',
      assistant_name: '',
      script: {
        greeting: '',
        service_description: '',
        availability: ''
      }
    });
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive 
      ? <Badge className="bg-success/10 text-success border-success/20">Active</Badge>
      : <Badge className="bg-gray-100 text-gray-600 border-gray-200">Inactive</Badge>;
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Create New Voice Agent</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="agent_name">Agent Name</Label>
                <Input
                  id="agent_name"
                  placeholder="Enter agent name..."
                  value={newAgent.agent_name}
                  onChange={(e) => setNewAgent({ ...newAgent, agent_name: e.target.value })}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  style={{ 
                    boxShadow: 'none',
                    WebkitBoxShadow: 'none'
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="agent_role">Agent Role</Label>
                <Input
                  id="agent_role"
                  placeholder="e.g., Medical Assistant, Receptionist..."
                  value={newAgent.agent_role}
                  onChange={(e) => setNewAgent({ ...newAgent, agent_role: e.target.value })}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  style={{ 
                    boxShadow: 'none',
                    WebkitBoxShadow: 'none'
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="service_description">Service Description</Label>
                <Textarea
                  id="service_description"
                  placeholder="Describe the services offered..."
                  value={newAgent.service_description}
                  onChange={(e) => setNewAgent({ ...newAgent, service_description: e.target.value })}
                  rows={3}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  style={{ 
                    boxShadow: 'none',
                    WebkitBoxShadow: 'none'
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assistant_name">Assistant Name</Label>
                <Input
                  id="assistant_name"
                  placeholder="e.g., Clara, Maria..."
                  value={newAgent.assistant_name}
                  onChange={(e) => setNewAgent({ ...newAgent, assistant_name: e.target.value })}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  style={{ 
                    boxShadow: 'none',
                    WebkitBoxShadow: 'none'
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="greeting">Greeting Message</Label>
                <Textarea
                  id="greeting"
                  placeholder="e.g., Olá! Como posso ajudá-lo hoje?"
                  value={newAgent.script.greeting}
                  onChange={(e) => setNewAgent({ 
                    ...newAgent, 
                    script: { ...newAgent.script, greeting: e.target.value }
                  })}
                  rows={2}
                  className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  style={{ 
                    boxShadow: 'none',
                    WebkitBoxShadow: 'none'
                  }}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="availability">Availability Message</Label>
                <Textarea
                  id="availability"
                  placeholder="e.g., Estamos disponíveis de segunda a sexta, das 8h às 18h"
                  value={newAgent.script.availability}
                  onChange={(e) => setNewAgent({ 
                    ...newAgent, 
                    script: { ...newAgent.script, availability: e.target.value }
                  })}
                  rows={2}
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
                disabled={!newAgent.agent_name || !newAgent.service_description}
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
                    <CardTitle className="text-lg text-gray-900">{agent.agent_name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">{agent.agent_role}</CardDescription>
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
                {getStatusBadge(agent.is_active)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Agent Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Assistant Name:</span>
                  <span className="font-medium text-gray-900">{agent.assistant_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="font-medium text-gray-900">{agent.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Voice:</span>
                  <span className="font-medium text-gray-900">{agent.voice_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ambient Sound:</span>
                  <span className="font-medium text-gray-900">{agent.ambient_sound}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Published:</span>
                  <span className="font-medium text-gray-900">{agent.is_published ? 'Yes' : 'No'}</span>
                </div>
              </div>

              {/* Service Description */}
              {agent.service_description && (
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-600 mb-1">Service Description:</div>
                  <div className="text-sm text-gray-900">{agent.service_description}</div>
                </div>
              )}

              {/* Script Preview */}
              {agent.script.greeting && (
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="text-xs text-blue-600 mb-1">Greeting:</div>
                  <div className="text-sm text-blue-900">{agent.script.greeting}</div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                {agent.is_active ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-800 focus:bg-gray-50 focus:text-gray-800 focus:border-gray-400"
                    style={{ backgroundColor: 'white', borderColor: '#d1d5db' }}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-800 focus:bg-gray-50 focus:text-gray-800 focus:border-gray-400"
                    style={{ backgroundColor: 'white', borderColor: '#d1d5db' }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 rounded-xl border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-800 focus:bg-gray-50 focus:text-gray-800 focus:border-gray-400"
                  style={{ backgroundColor: 'white', borderColor: '#d1d5db' }}
                >
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