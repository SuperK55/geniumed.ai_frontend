import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notify } from '@/utils/notifications';
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
  Eye,
  Info,
  TestTube
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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

interface AgentActivity {
  id: string;
  type: string;
  status: 'success' | 'error';
  title: string;
  agentType: string;
  duration: string;
  timeAgo: string;
}

interface AgentStats {
  activeAgents: number;
  totalAgents: number;
  totalCallsToday: number;
  successRate: string;
  totalAgentHours: string;
  trends: {
    calls: {
      value: number;
      isPositive: boolean;
    };
    successRate: {
      value: number;
      isPositive: boolean;
    };
  };
  recentActivity: AgentActivity[];
}

const VoiceAgents = () => {
  const { user } = useAuth();
  const [agents, setAgents] = useState<VoiceAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [defaultAgent, setDefaultAgent] = useState<VoiceAgent | null>(null);

  // Modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false);
  const [selectedAgentForTest, setSelectedAgentForTest] = useState<VoiceAgent | null>(null);
  const [selectedAgentForDetails, setSelectedAgentForDetails] = useState<VoiceAgent | null>(null);
  const [selectedAgentForEdit, setSelectedAgentForEdit] = useState<VoiceAgent | null>(null);
  const [testLead, setTestLead] = useState({
    name: 'Test',
    phone: '+55....',
    city: 'São Paulo',
    specialty: 'Neurocirurgia de Coluna',
    reason: 'Dor nas costas e formigamento nas pernas',
    whatsapp: 'whatsapp:+55....',
    preferred_channel: 'call'
  });
  const [isTesting, setIsTesting] = useState(false);
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
  const [editAgent, setEditAgent] = useState({
    agent_name: '',
    agent_role: '',
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
        
        // Fetch default agent after agents are loaded
        if (data.agents && data.agents.length > 0) {
          await fetchDefaultAgentAfterAgents(data.agents);
        }
      }
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch default agent
  const fetchDefaultAgent = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/agents/get/default', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.defaultAgent) {
          // Find the agent in our agents list
          const agent = agents.find(a => a.id === data.defaultAgent.id);
          setDefaultAgent(agent || null);
        } else {
          setDefaultAgent(null);
        }
      }
    } catch (error) {
      console.error('Error fetching default agent:', error);
    }
  };

  // Fetch default agent after agents are loaded
  const fetchDefaultAgentAfterAgents = async (agentsList: VoiceAgent[]) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/agents/get/default', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.defaultAgent) {
          // Find the agent in the provided agents list
          const agent = agentsList.find(a => a.id === data.defaultAgent.id);
          setDefaultAgent(agent || null);
        } else {
          setDefaultAgent(null);
        }
      }
    } catch (error) {
      console.error('Error fetching default agent:', error);
    }
  };

  // Set default agent
  const setDefaultAgentHandler = async (agentId: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`/api/agents/default/${agentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const agent = agents.find(a => a.id === agentId);
        setDefaultAgent(agent || null);
        notify.success('Default Agent Updated', {
          description: `${data.defaultAgent.name} is now your default agent.`,
          duration: 4000
        });
      } else {
        const errorData = await response.json();
        notify.error('Failed to Set Default Agent', {
          description: errorData.error || 'Unknown error occurred.',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error setting default agent:', error);
      notify.error('Failed to Set Default Agent', {
        description: 'Network error occurred.',
        duration: 4000
      });
    }
  };

  // Remove default agent
  const removeDefaultAgent = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/agents/default', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setDefaultAgent(null);
        notify.success('Default Agent Removed', {
          description: 'No default agent is set.',
          duration: 4000
        });
      } else {
        const errorData = await response.json();
        notify.error('Failed to Remove Default Agent', {
          description: errorData.error || 'Unknown error occurred.',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error removing default agent:', error);
      notify.error('Failed to Remove Default Agent', {
        description: 'Network error occurred.',
        duration: 4000
      });
    }
  };

  // Fetch statistics from API
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('api/agents/get/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    fetchStats();
  }, []);


  const handleCreateAgent = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        notify.error('Authentication Required', {
          description: 'No authentication token found. Please sign in again.',
          duration: 5000
        });
        return;
      }

      const response = await fetch('/agents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAgent)
      });

      if (response.ok) {
        const data = await response.json();
        const updatedAgents = [...agents, data.agent];
        setAgents(updatedAgents);
        
        // If this is the first agent, it will be set as default automatically
        // Check if this agent should be the default
        if (agents.length === 0) {
          setDefaultAgent(data.agent);
        }
        
        resetForm();
        setIsCreateModalOpen(false);
        // Refresh stats after creating an agent
        fetchStats();
        notify.success('Agent Created Successfully!', {
          description: 'Your voice agent has been created and is ready to use.',
          duration: 4000
        });
      } else {
        const error = await response.json();
        notify.error('Error Creating Agent', {
          description: error.error || 'An unexpected error occurred while creating the agent.',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      notify.error('Error Creating Agent', {
        description: 'Network error occurred. Please check your connection and try again.',
        duration: 6000
      });
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

  const handleUpdateAgent = async () => {
    if (!selectedAgentForEdit) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        notify.error('Authentication Required', {
          description: 'No authentication token found. Please sign in again.',
          duration: 5000
        });
        return;
      }

      const response = await fetch(`/api/agents/${selectedAgentForEdit.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editAgent)
      });

      if (response.ok) {
        const data = await response.json();
        // Update the agent in the list
        setAgents(agents.map(agent => 
          agent.id === selectedAgentForEdit.id ? data.agent : agent
        ));
        setIsEditModalOpen(false);
        setSelectedAgentForEdit(null);
        // Refresh stats after updating an agent
        fetchStats();
        notify.success('Agent Updated Successfully!', {
          description: 'Your voice agent configuration has been updated.',
          duration: 4000
        });
      } else {
        const error = await response.json();
        notify.error('Error Updating Agent', {
          description: error.error || 'An unexpected error occurred while updating the agent.',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error updating agent:', error);
      notify.error('Error Updating Agent', {
        description: 'Network error occurred. Please check your connection and try again.',
        duration: 6000
      });
    }
  };

  const handleTestAgent = async () => {
    if (!selectedAgentForTest) return;
    
    // Validate test data
    if (!testLead.name.trim()) {
      notify.warning('Patient Name Required', {
        description: 'Please enter a patient name for testing.',
        duration: 4000
      });
      return;
    }
    
    if (!testLead.phone.trim() || testLead.phone.includes('...')) {
      notify.warning('Valid Phone Number Required', {
        description: 'Please enter a valid phone number for testing.',
        duration: 4000
      });
      return;
    }
    
    setIsTesting(true);
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        notify.error('Authentication Required', {
          description: 'No authentication token found. Please sign in again.',
          duration: 5000
        });
        return;
      }

      // Generate unique test data (use input phone number)
      const testData = {
        ...testLead,
        name: testLead.name,
        phone: testLead.phone, // Use the phone number from the form
        whatsapp: `whatsapp:${testLead.phone}`, // Use the same phone number for WhatsApp
        test_mode: true,
        owner_id: user?.id // Use the current user's ID to find their agents
      };

      const response = await fetch('/api/lead/submit', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      if (response.ok) {
        const data = await response.json();
        notify.success('Test Call Initiated!', {
          description: `Call ID: ${data.call?.call_id || 'N/A'}. The test call has been started successfully.`,
          duration: 5000
        });
        setIsTestModalOpen(false);
      } else {
        const error = await response.json();
        notify.error('Test Call Failed', {
          description: error.error || 'Unknown error occurred during the test call.',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error testing agent:', error);
      notify.error('Error Testing Agent', {
        description: 'Network error occurred. Please check your connection and try again.',
        duration: 6000
      });
    } finally {
      setIsTesting(false);
    }
  };

  const openTestModal = (agent: VoiceAgent) => {
    setSelectedAgentForTest(agent);
    setIsTestModalOpen(true);
  };

  // Handler functions for dropdown menu actions
  const handleViewDetails = (agent: VoiceAgent) => {
    setSelectedAgentForDetails(agent);
    setIsViewDetailsModalOpen(true);
  };

  const handleEditAgent = (agent: VoiceAgent) => {
    // Set the agent for editing
    setSelectedAgentForEdit(agent);
    
    // Set the edit form with current agent data
    setEditAgent({
      agent_name: agent.agent_name,
      agent_role: agent.agent_role,
      assistant_name: (agent as any).assistant_name || 'Clara',
      script: {
        greeting: agent.script?.greeting || '',
        service_description: agent.script?.service_description || '',
        availability: agent.script?.availability || ''
      }
    });
    
    // Open the edit modal
    setIsEditModalOpen(true);
  };


  const handleDeleteAgent = async (agent: VoiceAgent) => {
    if (window.confirm(`Are you sure you want to delete "${agent.agent_name}"? This action cannot be undone.`)) {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          notify.error('Authentication Required', {
          description: 'No authentication token found. Please sign in again.',
          duration: 5000
        });
          return;
        }

        const response = await fetch(`/api/agents/${agent.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
        notify.success('Agent Deleted Successfully!', {
          description: 'The voice agent has been permanently removed.',
          duration: 4000
        });
          fetchAgents(); // Refresh the list
          fetchStats(); // Refresh stats
        } else {
          const errorData = await response.json();
          notify.error('Failed to Delete Agent', {
            description: errorData.message || 'Unknown error occurred while deleting the agent.',
            duration: 6000
          });
        }
      } catch (error) {
        console.error('Error deleting agent:', error);
        notify.error('Failed to Delete Agent', {
          description: 'Network error occurred. Please check your connection and try again.',
          duration: 6000
        });
      }
    }
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
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-gray-200 overflow-visible pr-2">
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
                <div className="flex items-center gap-2">
                  <Label htmlFor="greeting">Greeting</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent 
                        className="max-w-md w-max" 
                        side="top"
                        align="start"
                        sideOffset={8}
                        avoidCollisions={true}
                        collisionPadding={16}
                      >
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">Sample Greetings Sentences:</p>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>Olá {`{{name}}`}, eu sou a Clara, assistente no consultório do {`{{doctor_name}}`}. Como você está hoje?</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="greeting"
                  placeholder="Describe the greeting"
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
                <div className="flex items-center gap-2">
                  <Label htmlFor="availability">Availability</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent 
                        className="max-w-md w-max" 
                        side="top"
                        align="start"
                        sideOffset={8}
                        avoidCollisions={true}
                        collisionPadding={16}
                      >
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">Sample Availability Sentences:</p>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>O {`{{doctor_name}}`} é muito procurado, e por isso a agenda dele está bastante concorrida. Atualmente, o primeiro horário disponível é apenas {`{{initial_appointment_date}}`}. Você gostaria que eu reservasse essa vaga para você?</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="availability"
                  placeholder="Describe the availability"
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
              <div className="grid gap-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="service_description">How the service works</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent 
                        className="max-w-md w-max" 
                        side="top"
                        align="start"
                        sideOffset={8}
                        avoidCollisions={true}
                        collisionPadding={16}
                      >
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">Sample How the service works Sentences:</p>
                          <ul className="text-sm space-y-1 text-gray-700">
                            <li>A consulta do {`{{doctor_name}}`} é diferenciada, com duração média de 1 hora e meia, para avaliar seu caso com calma. Ela inclui um retorno dentro de 30 dias, sem custo adicional. E, caso você precise, emitimos nota fiscal para solicitação de reembolso no seu plano de saúde. O valor da primeira consulta é de {`{{consultation_price}}`}. Posso confirmar sua consulta, ou você tem alguma dúvida? • Se o usuário achar caro: "Entendo. Temos a opção de parcelar em até quatro vezes no seu cartão."</li>
                          </ul>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Textarea
                  id="service_description"
                  placeholder="Describe how the service works"
                  value={newAgent.script.service_description}
                  onChange={(e) => setNewAgent({
                    ...newAgent, 
                    script: { ...newAgent.script, service_description: e.target.value }
                  })}
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
                disabled={!newAgent.agent_name || !newAgent.script.service_description}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Create Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Test Agent Modal */}
        <Dialog open={isTestModalOpen} onOpenChange={setIsTestModalOpen}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white border-gray-200 overflow-visible pr-2">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Test Voice Agent</DialogTitle>
              <DialogDescription>
                Test your agent with sample lead data to verify it works correctly.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Agent Info */}
              {selectedAgentForTest && (
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="text-sm font-medium text-blue-900">Testing Agent:</div>
                  <div className="text-sm text-blue-700">{selectedAgentForTest.agent_name} ({selectedAgentForTest.agent_role})</div>
                </div>
              )}

              {/* Test Lead Data */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="test_name">Patient Name</Label>
                  <Input
                    id="test_name"
                    value={testLead.name}
                    onChange={(e) => setTestLead({ ...testLead, name: e.target.value })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="test_phone">Phone Number</Label>
                  <Input
                    id="test_phone"
                    value={testLead.phone}
                    onChange={(e) => setTestLead({ ...testLead, phone: e.target.value, whatsapp: `whatsapp:${e.target.value}` })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="test_city">City</Label>
                  <Input
                    id="test_city"
                    value={testLead.city}
                    onChange={(e) => setTestLead({ ...testLead, city: e.target.value })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="test_specialty">Specialty</Label>
                  <Input
                    id="test_specialty"
                    value={testLead.specialty}
                    onChange={(e) => setTestLead({ ...testLead, specialty: e.target.value })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="test_reason">Reason/Need</Label>
                  <Textarea
                    id="test_reason"
                    value={testLead.reason}
                    onChange={(e) => setTestLead({ ...testLead, reason: e.target.value })}
                    rows={2}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none"
                  />
                </div>
              </div>

              {/* Test Info */}
              <div className="p-3 bg-blue-50 rounded-xl">
                <div className="text-sm text-blue-800">
                  <strong>Note:</strong> This will create a test lead and initiate a real call to the phone number you specify above. 
                  The system will generate a unique test name to avoid conflicts.
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsTestModalOpen(false)}
                className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-800"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleTestAgent}
                disabled={isTesting || !testLead.name || !testLead.phone}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                {isTesting ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <TestTube className="w-4 h-4 mr-2" />
                    Start Test Call
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Details Modal */}
        <Dialog open={isViewDetailsModalOpen} onOpenChange={setIsViewDetailsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-gray-200 pr-2">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Agent Details</DialogTitle>
              <DialogDescription>
                View detailed information about this voice agent.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {selectedAgentForDetails && (
                <>
                  {/* Basic Information */}
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Agent Name</Label>
                        <div className="text-sm text-gray-900 mt-1">{selectedAgentForDetails.agent_name}</div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <div className="text-sm text-gray-900 mt-1">{selectedAgentForDetails.agent_role}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Status</Label>
                        <div className="mt-1">
                          {selectedAgentForDetails.is_active ? (
                            <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-600 border-gray-200">Inactive</Badge>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Assistant Name</Label>
                        <div className="text-sm text-gray-900 mt-1">{(selectedAgentForDetails as any).assistant_name || 'Clara'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Script Information */}
                  {selectedAgentForDetails.script && (
                    <div className="grid gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Greeting Script</Label>
                        <div className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                          {selectedAgentForDetails.script.greeting || 'No greeting script'}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Availability Script</Label>
                        <div className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                          {selectedAgentForDetails.script.availability || 'No availability script'}
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Service Description Script</Label>
                        <div className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-lg">
                          {selectedAgentForDetails.script.service_description || 'No service description script'}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Technical Information */}
                  <div className="grid gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Agent ID</Label>
                      <div className="text-sm text-gray-600 mt-1 font-mono">{selectedAgentForDetails.id}</div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Retell Agent ID</Label>
                      <div className="text-sm text-gray-600 mt-1 font-mono">
                        {(selectedAgentForDetails as any).retell_agent_id || 'Not configured'}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Created At</Label>
                      <div className="text-sm text-gray-600 mt-1">
                        {selectedAgentForDetails.created_at ? new Date(selectedAgentForDetails.created_at).toLocaleString() : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsViewDetailsModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Agent Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] bg-white border-gray-200 overflow-visible">
            <DialogHeader>
              <DialogTitle className="text-gray-900">Edit Voice Agent</DialogTitle>
              <DialogDescription>
                Update your voice agent configuration and scripts.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pr-2">
              <div className="grid gap-6 py-4">

              {/* Agent Configuration */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit_agent_name">Agent Name</Label>
                  <Input
                    id="edit_agent_name"
                    placeholder="Enter agent name..."
                    value={editAgent.agent_name}
                    onChange={(e) => setEditAgent({ ...editAgent, agent_name: e.target.value })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_agent_role">Agent Role</Label>
                  <Input
                    id="edit_agent_role"
                    placeholder="e.g., Medical Assistant, Receptionist..."
                    value={editAgent.agent_role}
                    onChange={(e) => setEditAgent({ ...editAgent, agent_role: e.target.value })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_assistant_name">Assistant Name</Label>
                  <Input
                    id="edit_assistant_name"
                    placeholder="e.g., Clara, Maria..."
                    value={editAgent.assistant_name}
                    onChange={(e) => setEditAgent({ ...editAgent, assistant_name: e.target.value })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Script Configuration */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="edit_greeting">Greeting</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md w-max" side="top" align="start" sideOffset={8} avoidCollisions={true} collisionPadding={16}>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">Sample greeting sentences:</p>
                            <ul className="text-sm space-y-1 text-gray-700">
                              <li>• &quot;Olá {`{{name}}`}, eu sou a Clara, assistente no consultório do {`{{doctor_name}}`}. Como você está hoje?&quot;</li>
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="edit_greeting"
                    placeholder="Describe the greeting"
                    value={editAgent.script.greeting}
                    onChange={(e) => setEditAgent({ 
                      ...editAgent, 
                      script: { ...editAgent.script, greeting: e.target.value }
                    })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="edit_availability">Availability</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md w-max" side="top" align="start" sideOffset={8} avoidCollisions={true} collisionPadding={16}>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">Sample availability sentences:</p>
                            <ul className="text-sm space-y-1 text-gray-700">
                              <li>A agenda dele está bem cheia no momento, mas tenho uma vaga disponível para {`{{initial_appointment_date}}`}. Gostaria que eu reservasse essa vaga para você?</li>
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="edit_availability"
                    placeholder="Describe the availability"
                    value={editAgent.script.availability}
                    onChange={(e) => setEditAgent({ 
                      ...editAgent, 
                      script: { ...editAgent.script, availability: e.target.value }
                    })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="edit_service_script">How the service works</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-md w-max" side="top" align="start" sideOffset={8} avoidCollisions={true} collisionPadding={16}>
                          <div className="space-y-2">
                            <p className="font-medium text-gray-900">Sample service description sentences:</p>
                            <ul className="text-sm space-y-1 text-gray-700">
                              <li>A consulta com o {`{{doctor_name}}`} tem duração média de 1,5 hora para um atendimento atencioso e personalizado. O valor é de {`{{price_first}}`} e inclui um retorno em 30 dias. Se você tiver plano de saúde, emitiremos uma nota para reembolso.</li>
                            </ul>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <Textarea
                    id="edit_service_script"
                    placeholder="Describe how the service works"
                    value={editAgent.script.service_description}
                    onChange={(e) => setEditAgent({ 
                      ...editAgent, 
                      script: { ...editAgent.script, service_description: e.target.value }
                    })}
                    className="bg-white border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-0 focus:outline-none placeholder:text-gray-500"
                    rows={4}
                  />
                </div>
              </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
                className="border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-800 focus:ring-2 focus:ring-gray-500/20 focus:border-gray-500 focus:text-gray-800 focus:bg-gray-50"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleUpdateAgent}
                disabled={!editAgent.agent_name || !editAgent.agent_role || !editAgent.assistant_name || !editAgent.script.greeting || !editAgent.script.service_description}
                className="bg-blue-600 hover:bg-blue-700 text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:text-white focus:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Update Agent
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Active Agents"
          value={statsLoading ? "..." : stats?.activeAgents || 0}
          subtitle="Currently handling calls"
          icon={Bot}
          variant="success"
        />
        <StatsCard
          title="Total Calls Today"
          value={statsLoading ? "..." : stats?.totalCallsToday || 0}
          subtitle="Across all agents"
          icon={Phone}
          trend={statsLoading ? undefined : stats?.trends.calls}
          variant="primary"
        />
        <StatsCard
          title="Average Success Rate"
          value={statsLoading ? "..." : stats?.successRate || "0%"}
          subtitle="Call completion rate"
          icon={CheckCircle}
          trend={statsLoading ? undefined : stats?.trends.successRate}
          variant="success"
        />
        <StatsCard
          title="Total Agent Hours"
          value={statsLoading ? "..." : stats?.totalAgentHours || "0h"}
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
                    <DropdownMenuItem 
                      className="rounded-lg cursor-pointer"
                      onClick={() => handleViewDetails(agent)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="rounded-lg cursor-pointer"
                      onClick={() => handleEditAgent(agent)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Configuration
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="text-red-600 rounded-lg cursor-pointer"
                      onClick={() => handleDeleteAgent(agent)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Agent
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                {getStatusBadge(agent.is_active)}
                {defaultAgent?.id === agent.id && (
                  <Badge className="bg-blue-100 text-blue-600 border-blue-200">
                    Default
                  </Badge>
                )}
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
              </div>

              {/* Script Preview */}
              {agent.script.greeting && (
                <>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="text-xs text-blue-600 mb-1">Greeting:</div>
                  <div className="text-sm text-blue-900">{agent.script.greeting}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="text-xs text-blue-600 mb-1">How the service works:</div>
                  <div className="text-sm text-blue-900">{agent.script.service_description}</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl">
                  <div className="text-xs text-blue-600 mb-1">Availability:</div>
                  <div className="text-sm text-blue-900">{agent.script.availability}</div>
                </div>
                </>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openTestModal(agent)}
                  className="flex-1 rounded-xl border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:border-blue-400"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test
                </Button>
                {defaultAgent?.id === agent.id ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl border-orange-300 text-orange-700 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 focus:bg-orange-100 focus:text-orange-800 focus:border-orange-400"
                    style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}
                    onClick={() => removeDefaultAgent()}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Remove Default
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 rounded-xl border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 hover:text-blue-800 focus:bg-blue-100 focus:text-blue-800 focus:border-blue-400"
                    style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}
                    onClick={() => setDefaultAgentHandler(agent.id)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Set as Default
                  </Button>
                )}
                {/* <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 rounded-xl border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-800 focus:bg-gray-50 focus:text-gray-800 focus:border-gray-400"
                  style={{ backgroundColor: 'white', borderColor: '#d1d5db' }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  Monitor
                </Button> */}
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
            {statsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl animate-pulse">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                      <div>
                        <div className="h-4 bg-gray-300 rounded w-48 mb-1"></div>
                        <div className="h-3 bg-gray-300 rounded w-32"></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="h-4 bg-gray-300 rounded w-12 mb-1"></div>
                      <div className="h-3 bg-gray-300 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : stats?.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-medium text-gray-900">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.agentType}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">{activity.duration}</div>
                    <div className="text-xs text-gray-600">{activity.timeAgo}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No recent activity</p>
                <p className="text-xs">Agent activities will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VoiceAgents;