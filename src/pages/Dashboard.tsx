import React, { useState, useEffect } from 'react';
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
  FileText,
  MessageSquare
} from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { notify } from '@/utils/notifications';

interface DashboardStats {
  activeAgents: number;
  totalAgents: number;
  totalCallsToday: number;
  successRate: string;
  totalAgentHours: string;
  trends: {
    calls: { value: number; isPositive: boolean };
    successRate: { value: number; isPositive: boolean };
  };
  recentActivity: Array<{
    id: string;
    type: string;
    status: string;
    title: string;
    agentType: string;
    duration: string;
    timeAgo: string;
  }>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('/api/agents/get/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        const error = await response.json();
        notify.error('Error Loading Dashboard', {
          description: error.error || 'Failed to load dashboard data',
          duration: 4000
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      notify.error('Error Loading Dashboard', {
        description: 'Network error occurred',
        duration: 4000
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Format duration for display
  const formatDuration = (timeAgo: string) => {
    return timeAgo;
  };

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'completed':
        return CheckCircle;
      case 'appointment':
        return Calendar;
      case 'interested':
        return Heart;
      case 'failed':
        return AlertTriangle;
      default:
        return Phone;
    }
  };

  // Get activity color based on status
  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="space-y-8 bg-gray-50">

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Voice Agents"
          value={loading ? "..." : `${stats?.activeAgents || 0}/${stats?.totalAgents || 0}`}
          subtitle={loading ? "Loading..." : `${stats?.activeAgents || 0} active agents`}
          icon={MessageSquare}
          trend={stats?.trends ? { value: stats.trends.calls.value, isPositive: stats.trends.calls.isPositive } : undefined}
          variant="primary"
        />
        <StatsCard
          title="Calls Today"
          value={loading ? "..." : stats?.totalCallsToday || 0}
          subtitle={loading ? "Loading..." : "AI-handled calls"}
          icon={Phone}
          trend={stats?.trends ? { value: stats.trends.calls.value, isPositive: stats.trends.calls.isPositive } : undefined}
          variant="secondary"
        />
        <StatsCard
          title="Success Rate"
          value={loading ? "..." : stats?.successRate || "0%"}
          subtitle={loading ? "Loading..." : "Call completion rate"}
          icon={Heart}
          trend={stats?.trends ? { value: stats.trends.successRate.value, isPositive: stats.trends.successRate.isPositive } : undefined}
          variant="success"
        />
        <StatsCard
          title="Agent Hours"
          value={loading ? "..." : stats?.totalAgentHours || "0h"}
          subtitle={loading ? "Loading..." : "Total call time"}
          icon={Clock}
          variant="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Agent Activity */}
        <div className="lg:col-span-2">
          <Card className="shadow-sm border-gray-200 rounded-xl !bg-white">
            <CardHeader className="pb-4 !bg-white">
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <Activity className="w-5 h-5 text-primary" />
                <span>Recent Agent Activity</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 !bg-white">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="ml-2 text-gray-600">Loading activity...</span>
                </div>
              ) : stats?.recentActivity && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type);
                  const activityColor = getActivityColor(activity.status);
                  
                  return (
                    <div key={activity.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <ActivityIcon className={`w-5 h-5 ${activityColor}`} />
                        <div>
                          <div className="font-medium text-gray-900">{activity.title}</div>
                          <div className="text-sm text-gray-600">{activity.agentType} • {activity.duration}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{activity.timeAgo}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                  <p className="text-gray-600">No calls have been made yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Alerts */}
        <div className="space-y-6">

          {/* Call Performance */}
          <Card className="shadow-sm border-gray-200 rounded-xl !bg-white">
            <CardHeader className="pb-4 !bg-white">
              <CardTitle className="flex items-center space-x-2 text-gray-900">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Call Performance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 !bg-white">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Success Rate</span>
                <span className="font-semibold text-primary">{loading ? "..." : stats?.successRate || "0%"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Calls</span>
                <span className="font-semibold text-secondary">{loading ? "..." : stats?.totalCallsToday || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Agent Hours</span>
                <span className="font-semibold text-success">{loading ? "..." : stats?.totalAgentHours || "0h"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Agents</span>
                <span className="font-semibold text-accent">{loading ? "..." : stats?.activeAgents || 0}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Agents"
          value={loading ? "..." : stats?.totalAgents || 0}
          subtitle="All voice agents"
          icon={MessageSquare}
          variant="default"
        />
        <StatsCard
          title="Call Trends"
          value={loading ? "..." : stats?.trends ? `${stats.trends.calls.isPositive ? '+' : '-'}${stats.trends.calls.value}%` : "0%"}
          subtitle="vs yesterday"
          icon={TrendingUp}
          variant="default"
        />
        <StatsCard
          title="Success Trends"
          value={loading ? "..." : stats?.trends ? `${stats.trends.successRate.isPositive ? '+' : '-'}${stats.trends.successRate.value}%` : "0%"}
          subtitle="vs yesterday"
          icon={Brain}
          variant="default"
        />
        <StatsCard
          title="Recent Activity"
          value={loading ? "..." : stats?.recentActivity?.length || 0}
          subtitle="Last 24 hours"
          icon={Activity}
          variant="default"
        />
      </div>

    </div>
  );
};

export default Dashboard; 