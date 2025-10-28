import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';
import { AuthContext } from '../App';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PlusCircle, TrendingUp, Users, DollarSign } from 'lucide-react';

export default function UserDashboard() {
    const { user } = useContext(AuthContext);
    const [campaigns, setCampaigns] = useState([]);
    const [stats, setStats] = useState({ totalCampaigns: 0, totalRaised: 0, totalBackers: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            const response = await axiosInstance.get('/my-campaigns');
            const userCampaigns = response.data;
            setCampaigns(userCampaigns);

            // Calculate stats
            const totalRaised = userCampaigns.reduce((sum, c) => sum + (c.raised_amount || 0), 0);
            const totalBackers = userCampaigns.reduce((sum, c) => sum + (c.backers_count || 0), 0);

            setStats({
                totalCampaigns: userCampaigns.length,
                totalRaised,
                totalBackers
            });
        } catch (error) {
            console.error("Error fetching user dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0B0F19] p-8 text-center text-white" data-testid="user-dashboard-loading">
                Loading Your Dashboard...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0B0F19] p-8 text-center text-white">
                Please log in to view your dashboard.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0B0F19] p-6 md:p-8" data-testid="user-dashboard">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold text-white">My Dashboard</h1>
                        <p className="text-slate-400 mt-1">Welcome back, {user.name || user.email}!</p>
                    </div>
                    <Link to="/create-campaign">
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:opacity-90" data-testid="create-campaign-button">
                            <PlusCircle className="w-5 h-5 mr-2" />
                            Start New Campaign
                        </Button>
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-slate-900/70 border-slate-800 text-white" data-testid="stats-campaigns">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">My Campaigns</CardTitle>
                            <TrendingUp className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/70 border-slate-800 text-white" data-testid="stats-raised">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Total Raised</CardTitle>
                            <DollarSign className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">₹{stats.totalRaised.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/70 border-slate-800 text-white" data-testid="stats-backers">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-400">Total Backers</CardTitle>
                            <Users className="h-4 w-4 text-slate-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalBackers}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Campaigns List */}
                <Card className="bg-slate-900/70 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">My Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {campaigns.length === 0 ? (
                            <div className="text-center py-12 text-slate-400">
                                <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p className="mb-4">You haven't created any campaigns yet.</p>
                                <Link to="/create-campaign">
                                    <Button className="bg-purple-600 hover:bg-purple-700">
                                        Create Your First Campaign
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {campaigns.map((campaign) => (
                                    <div
                                        key={campaign.id}
                                        className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800/70 transition-colors"
                                        data-testid={`campaign-${campaign.id}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-white mb-2">
                                                    <Link to={`/campaign/${campaign.id}`} className="hover:text-purple-400">
                                                        {campaign.title}
                                                    </Link>
                                                </h3>
                                                <div className="flex gap-4 text-sm text-slate-400">
                                                    <span>Category: {campaign.category}</span>
                                                    <span>Status: {campaign.status}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-lg font-bold text-white">
                                                    ₹{campaign.raised_amount?.toLocaleString() || 0}
                                                </div>
                                                <div className="text-sm text-slate-400">
                                                    of ₹{campaign.goal_amount?.toLocaleString()}
                                                </div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    {campaign.backers_count || 0} backers
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <div className="w-full bg-slate-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${Math.min(
                                                            100,
                                                            ((campaign.raised_amount || 0) / campaign.goal_amount) * 100
                                                        )}%`,
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
