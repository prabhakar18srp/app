import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../App';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { BarChart, Users, DollarSign, Target, Activity, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// AdminCampaigns Component (integrated)
const AdminCampaigns = ({ campaigns, isLoading, onDelete, onView, onEdit }) => {
  const statusColors = {
    'draft': 'bg-slate-700',
    'active': 'bg-blue-600',
    'successful': 'bg-green-600',
    'failed': 'bg-red-600',
    'cancelled': 'bg-yellow-600',
  };

  return (
    <Card className="bg-slate-900/70 border-slate-800 text-white">
      <CardHeader>
        <CardTitle>All Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-slate-300">Campaign</TableHead>
              <TableHead className="text-slate-300">Goal</TableHead>
              <TableHead className="text-slate-300">Creator</TableHead>
              <TableHead className="text-slate-300">Status</TableHead>
              <TableHead className="text-slate-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan="5" className="text-center py-4 text-slate-400">
                  No campaigns found
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-slate-800">
                  <TableCell className="font-medium">{campaign.title}</TableCell>
                  <TableCell className="text-slate-400">
                    ₹{campaign.goal_amount?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {campaign.creator_name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[campaign.status] || 'bg-slate-700'} text-white`}>
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-slate-800">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                        <DropdownMenuItem 
                          onClick={() => onView(campaign.id)}
                          className="cursor-pointer hover:bg-slate-700 text-white"
                        >
                          <Eye className="mr-2 h-4 w-4" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onEdit(campaign.id)}
                          className="cursor-pointer hover:bg-slate-700 text-white"
                        >
                          <Edit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onDelete(campaign.id)}
                          className="text-red-400 cursor-pointer hover:bg-slate-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// AdminUsers Component (integrated)
const AdminUsers = ({ users, isLoading }) => {
  return (
    <Card className="bg-slate-900/70 border-slate-800 text-white">
      <CardHeader>
        <CardTitle>All Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="text-slate-300">User</TableHead>
              <TableHead className="text-slate-300">Role</TableHead>
              <TableHead className="text-slate-300">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan="3" className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan="3" className="text-center py-4 text-slate-400">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id} className="border-slate-800">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.picture} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500">
                          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name || 'N/A'}</div>
                        <div className="text-sm text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.is_admin ? 'default' : 'secondary'} 
                      className={user.is_admin ? 'bg-purple-600' : 'bg-slate-700'}
                    >
                      {user.is_admin ? 'admin' : 'user'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-400">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Main AdminDashboard Component
export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ 
    totalCampaigns: 0, 
    totalUsers: 0, 
    totalPledged: 0,
    activeCampaigns: 0 
  });
  const [campaigns, setCampaigns] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminAndFetchData();
  }, []);

  const checkAdminAndFetchData = async () => {
    try {
      // Check if user is admin using AuthContext
      if (!user || !user.is_admin) {
        toast.error('Admin access required');
        navigate('/');
        return;
      }
      
      fetchStats();
    } catch (error) {
      console.error('Auth check failed:', error);
      toast.error('Please login as admin');
      navigate('/');
    }
  };

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      // Get Supabase session token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expired. Please login again.');
        navigate('/');
        return;
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      };

      const [campaignsResp, usersResp, statsResp] = await Promise.all([
        axios.get(`${API}/admin/campaigns`, config),
        axios.get(`${API}/admin/users`, config),
        axios.get(`${API}/admin/stats`, config)
      ]);

      setCampaigns(campaignsResp.data);
      setUsers(usersResp.data);
      
      setStats({
        totalCampaigns: statsResp.data.total_campaigns,
        activeCampaigns: statsResp.data.active_campaigns,
        totalUsers: statsResp.data.total_users,
        totalPledged: statsResp.data.total_raised,
      });
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await axios.delete(`${API}/campaigns/${campaignId}`);
      setCampaigns(campaigns.filter(c => c.id !== campaignId));
      toast.success('Campaign deleted successfully');
      fetchStats(); // Refresh stats
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      toast.error('Could not delete campaign');
    }
  };

  const handleView = (campaignId) => {
    navigate(`/campaign/${campaignId}`);
  };

  const handleEdit = (campaignId) => {
    navigate(`/campaign/${campaignId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] p-8 text-center text-white">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] p-6 md:p-8" data-testid="admin-dashboard">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-900/70 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Campaigns
              </CardTitle>
              <Target className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/70 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Users
              </CardTitle>
              <Users className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/70 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Total Pledged
              </CardTitle>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ₹{stats.totalPledged.toLocaleString()}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/70 border-slate-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">
                Live Activity
              </CardTitle>
              <Activity className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">Online</div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns and Users Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AdminCampaigns 
            campaigns={campaigns}
            isLoading={isLoading}
            onDelete={handleDelete}
            onView={handleView}
            onEdit={handleEdit}
          />
          <AdminUsers 
            users={users}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
