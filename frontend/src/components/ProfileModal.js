import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import axiosInstance from "../utils/axios";
import { Camera, Mail, Phone, MapPin, Calendar, Activity, User as UserIcon } from "lucide-react";
import { toast } from 'sonner';

export default function ProfileModal({ user, isOpen, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleSave = async () => {
    try {
      await axiosInstance.put('/auth/update-profile', editData);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      onUpdate();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axiosInstance.post('/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Avatar updated successfully!');
      onUpdate();
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error('Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  React.useEffect(() => {
    if (user) {
      setEditData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user, isOpen, isEditing]);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-700" data-testid="profile-modal">
        <DialogHeader>
          <DialogTitle className="text-white">My Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="profile" className="data-[state=active]:bg-slate-700" data-testid="profile-tab">Profile</TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-700" data-testid="activity-tab">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-6 p-6 bg-slate-800/50 rounded-lg">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user.picture} />
                  <AvatarFallback className="bg-purple-600 text-white text-2xl">
                    {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-600 hover:bg-purple-700"
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  data-testid="upload-avatar-button"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{user.name || 'Unnamed User'}</h2>
                <p className="text-slate-400">{user.email}</p>
                <p className="text-sm text-slate-500 mt-1">
                  Member since {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "outline" : "default"}
                className={isEditing ? "border-slate-600" : "bg-purple-600 hover:bg-purple-700"}
                data-testid="edit-profile-button"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>

            {/* Profile Details */}
            {isEditing ? (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Edit Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      data-testid="edit-name-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                    <Input
                      id="email"
                      value={editData.email}
                      className="bg-slate-700 border-slate-600 text-white"
                      disabled
                      data-testid="edit-email-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                    <Input
                      id="phone"
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Your phone number"
                      data-testid="edit-phone-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-slate-300">Location</Label>
                    <Input
                      id="location"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Your location"
                      data-testid="edit-location-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                    <Input
                      id="bio"
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                      placeholder="Tell us about yourself"
                      data-testid="edit-bio-input"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleSave} 
                      className="bg-green-600 hover:bg-green-700"
                      data-testid="save-profile-button"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(false)} 
                      variant="outline" 
                      className="border-slate-600"
                      data-testid="cancel-edit-button"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300" data-testid="profile-email">
                    <Mail className="w-5 h-5 text-slate-500" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-3 text-slate-300" data-testid="profile-phone">
                      <Phone className="w-5 h-5 text-slate-500" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  {user.location && (
                    <div className="flex items-center gap-3 text-slate-300" data-testid="profile-location">
                      <MapPin className="w-5 h-5 text-slate-500" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.bio && (
                    <div className="flex items-start gap-3 text-slate-300" data-testid="profile-bio">
                      <UserIcon className="w-5 h-5 text-slate-500 mt-1" />
                      <p className="flex-1">{user.bio}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-slate-300" data-testid="profile-joined">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span>Joined {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-slate-400">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent activity to show</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
