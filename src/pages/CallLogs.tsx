import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { notify } from '@/utils/notifications';
import { 
  Phone, 
  Clock, 
  User, 
  MapPin, 
  Calendar,
  Filter,
  Search,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CallLog {
  id: string;
  callId: string;
  leadName: string;
  leadPhone: string;
  leadCity: string;
  leadSpecialty: string;
  agentName: string;
  agentRole: string;
  doctorName: string;
  doctorSpecialty: string;
  outcome: string;
  disposition: string;
  attemptNo: number;
  startedAt: string;
  endedAt: string;
  duration: number;
  transcript: string;
  summary: string;
  callAnalysis: any;
}

interface CallLogDetails extends CallLog {
  leadReason: string;
  doctorBio: string;
  callAnalysis: any;
  analysis: any;
  meta: any;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const CallLogs = () => {
  const { user } = useAuth();
  const [callLogs, setCallLogs] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all',
    agent_id: '',
    date_from: '',
    date_to: ''
  });
  
  // Modal state
  const [selectedLog, setSelectedLog] = useState<CallLogDetails | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Fetch call logs
  const fetchCallLogs = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...Object.fromEntries(Object.entries(filters).filter(([_, value]) => value && value !== 'all'))
      });

      const response = await fetch(`/api/agents/call-logs?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCallLogs(data.data);
        setPagination(data.pagination);
      } else {
        const error = await response.json();
        notify.error('Error Loading Call Logs', {
          description: error.error || 'Failed to load call logs',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error fetching call logs:', error);
      notify.error('Error Loading Call Logs', {
        description: 'Network error occurred',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch call log details
  const fetchCallLogDetails = async (id: string) => {
    try {
      setDetailsLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch(`/api/agents/call-logs/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedLog(data.data);
        setIsDetailsModalOpen(true);
      } else {
        const error = await response.json();
        notify.error('Error Loading Call Details', {
          description: error.error || 'Failed to load call details',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error fetching call log details:', error);
      notify.error('Error Loading Call Details', {
        description: 'Network error occurred',
        duration: 4000
      });
    } finally {
      setDetailsLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    fetchCallLogs(1);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: 'all',
      agent_id: '',
      date_from: '',
      date_to: ''
    });
    fetchCallLogs(1);
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge
  const getStatusBadge = (outcome: string) => {
    switch (outcome) {
      case 'completed':
      case 'qualified':
        return <Badge className="bg-green-100 text-green-600 border-green-200">Completed</Badge>;
      case 'no_answer':
      case 'voicemail':
        return <Badge className="bg-yellow-100 text-yellow-600 border-yellow-200">No Answer</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-600 border-red-200">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">{outcome}</Badge>;
    }
  };

  // Get disposition badge
  const getDispositionBadge = (disposition: string) => {
    if (!disposition) return null;
    
    switch (disposition) {
      case 'interested':
        return <Badge className="bg-blue-100 text-blue-600 border-blue-200">Interested</Badge>;
      case 'scheduled':
        return <Badge className="bg-green-100 text-green-600 border-green-200">Scheduled</Badge>;
      case 'not_interested':
        return <Badge className="bg-red-100 text-red-600 border-red-200">Not Interested</Badge>;
      case 'callback':
        return <Badge className="bg-orange-100 text-orange-600 border-orange-200">Callback</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-600 border-gray-200">{disposition}</Badge>;
    }
  };

  useEffect(() => {
    fetchCallLogs();
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Call Logs</h1>
          <p className="text-gray-600 mt-2">View and manage all call attempts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="no_answer">No Answer</SelectItem>
                  <SelectItem value="voicemail">Voicemail</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="date_from">From Date</Label>
              <Input
                id="date_from"
                type="date"
                value={filters.date_from}
                onChange={(e) => handleFilterChange('date_from', e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="date_to">To Date</Label>
              <Input
                id="date_to"
                type="date"
                value={filters.date_to}
                onChange={(e) => handleFilterChange('date_to', e.target.value)}
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <Button onClick={applyFilters} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Apply
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                Clear
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Call Logs</CardTitle>
          <CardDescription>
            Showing {callLogs.length} of {pagination.total} calls
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-gray-600">Loading call logs...</span>
            </div>
          ) : callLogs.length === 0 ? (
            <div className="text-center py-8">
              <Phone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No call logs found</h3>
              <p className="text-gray-600">No calls have been made yet or no calls match your filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Agent</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.leadName}</div>
                          <div className="text-sm text-gray-600">{log.leadPhone}</div>
                          <div className="text-sm text-gray-500">{log.leadCity}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.agentName}</div>
                          <div className="text-sm text-gray-600">{log.agentRole}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.doctorName}</div>
                          <div className="text-sm text-gray-600">{log.doctorSpecialty}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(log.outcome)}
                          {getDispositionBadge(log.disposition)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1 text-gray-500" />
                          {formatDuration(log.duration)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(log.startedAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => fetchCallLogDetails(log.id)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchCallLogs(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchCallLogs(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Call Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Call Details</DialogTitle>
            <DialogDescription>
              Detailed information about this call attempt
            </DialogDescription>
          </DialogHeader>
          
          {detailsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-gray-600">Loading details...</span>
            </div>
          ) : selectedLog ? (
            <div className="space-y-6">
              {/* Call Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lead Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {selectedLog.leadName}</div>
                    <div><strong>Phone:</strong> {selectedLog.leadPhone}</div>
                    <div><strong>City:</strong> {selectedLog.leadCity}</div>
                    <div><strong>Specialty:</strong> {selectedLog.leadSpecialty}</div>
                    <div><strong>Reason:</strong> {selectedLog.leadReason}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Call Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Call ID:</strong> {selectedLog.callId}</div>
                    <div><strong>Attempt:</strong> {selectedLog.attemptNo}</div>
                    <div><strong>Started:</strong> {formatDate(selectedLog.startedAt)}</div>
                    <div><strong>Ended:</strong> {selectedLog.endedAt ? formatDate(selectedLog.endedAt) : 'N/A'}</div>
                    <div><strong>Duration:</strong> {formatDuration(selectedLog.duration)}</div>
                    <div className="flex items-center space-x-2">
                      <strong>Status:</strong>
                      {getStatusBadge(selectedLog.outcome)}
                    </div>
                    {selectedLog.disposition && (
                      <div className="flex items-center space-x-2">
                        <strong>Disposition:</strong>
                        {getDispositionBadge(selectedLog.disposition)}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Agent & Doctor Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Agent Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {selectedLog.agentName}</div>
                    <div><strong>Role:</strong> {selectedLog.agentRole}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Doctor Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div><strong>Name:</strong> {selectedLog.doctorName}</div>
                    <div><strong>Specialty:</strong> {selectedLog.doctorSpecialty}</div>
                    {selectedLog.doctorBio && (
                      <div><strong>Bio:</strong> {selectedLog.doctorBio}</div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Transcript */}
              {selectedLog.transcript && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Call Transcript
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm">{selectedLog.transcript}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Summary */}
              {selectedLog.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Call Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm">{selectedLog.summary}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Call Analysis */}
              {selectedLog.callAnalysis && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Call Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-green-50 p-4 rounded-lg space-y-3">
                      {selectedLog.callAnalysis.call_summary && (
                        <div>
                          <strong className="text-sm text-gray-700">Summary:</strong>
                          <p className="text-sm mt-1">{selectedLog.callAnalysis.call_summary}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        {selectedLog.callAnalysis.in_voicemail !== undefined && (
                          <div>
                            <strong className="text-sm text-gray-700">Voicemail:</strong>
                            <Badge className={`ml-2 ${selectedLog.callAnalysis.in_voicemail ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                              {selectedLog.callAnalysis.in_voicemail ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        )}
                        
                        {selectedLog.callAnalysis.user_sentiment && (
                          <div>
                            <strong className="text-sm text-gray-700">Sentiment:</strong>
                            <Badge className={`ml-2 ${
                              selectedLog.callAnalysis.user_sentiment === 'Positive' ? 'bg-green-100 text-green-600' :
                              selectedLog.callAnalysis.user_sentiment === 'Negative' ? 'bg-red-100 text-red-600' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {selectedLog.callAnalysis.user_sentiment}
                            </Badge>
                          </div>
                        )}
                        
                        {selectedLog.callAnalysis.call_successful !== undefined && (
                          <div>
                            <strong className="text-sm text-gray-700">Successful:</strong>
                            <Badge className={`ml-2 ${selectedLog.callAnalysis.call_successful ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {selectedLog.callAnalysis.call_successful ? 'Yes' : 'No'}
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      {selectedLog.callAnalysis.custom_analysis_data && (
                        <div>
                          <strong className="text-sm text-gray-700">Custom Data:</strong>
                          <div className="mt-1 text-sm">
                            <pre className="bg-white p-2 rounded border text-xs overflow-x-auto">
                              {JSON.stringify(selectedLog.callAnalysis.custom_analysis_data, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallLogs;
