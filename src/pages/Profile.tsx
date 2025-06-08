import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Save, User, Globe, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user, profile, loading, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    gender: profile?.gender || '',
    preferred_language: profile?.preferred_language || 'en',
    subjects: profile?.subjects || [],
    languages: profile?.languages || [],
    hourly_rate: profile?.hourly_rate || 0,
  });
  const [newSubject, setNewSubject] = useState('');
  const [newLanguage, setNewLanguage] = useState('');

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-torah-500"></div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()]
      }));
      setNewSubject('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s !== subject)
    }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !formData.languages.includes(newLanguage.trim())) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, newLanguage.trim()]
      }));
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l !== lang)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      
      // Update app language if preferred language changed
      if (formData.preferred_language !== language) {
        await setLanguage(formData.preferred_language);
      }
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      bio: profile?.bio || '',
      location: profile?.location || '',
      gender: profile?.gender || '',
      preferred_language: profile?.preferred_language || 'en',
      subjects: profile?.subjects || [],
      languages: profile?.languages || [],
      hourly_rate: profile?.hourly_rate || 0,
    });
    setIsEditing(false);
  };

  return (
    <Layout>
      <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4 max-w-4xl">
        {/* Profile Header - Improved alignment */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* User Info Section */}
            <div className="flex items-center space-x-4 flex-1">
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20">
                <AvatarImage src={profile?.avatar_url} alt={profile?.email} />
                <AvatarFallback className="text-lg font-semibold bg-torah-100 text-torah-700">
                  {profile?.first_name?.[0] || 'U'}{profile?.last_name?.[0] || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                  {profile?.first_name && profile?.last_name 
                    ? `${profile.first_name} ${profile.last_name}`
                    : 'User Profile'
                  }
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base truncate">{profile?.email}</p>
                <Badge variant="outline" className="mt-2 bg-torah-50 text-torah-700 border-torah-200">
                  {profile?.role === 'teacher' ? 'Teacher' : 'Student'}
                </Badge>
              </div>
            </div>
            
            {/* Action Buttons Section */}
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              {!isEditing ? (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-torah-500 hover:bg-torah-600 text-white w-full sm:w-auto"
                  size="lg"
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button 
                    onClick={handleCancel} 
                    variant="outline" 
                    className="w-full sm:w-auto"
                    size="lg"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving} 
                    className="bg-torah-500 hover:bg-torah-600 text-white w-full sm:w-auto"
                    size="lg"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-torah-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name" className="text-sm font-medium">First Name</Label>
                  {isEditing ? (
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {profile?.first_name || 'Not set'}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-sm font-medium">Last Name</Label>
                  {isEditing ? (
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {profile?.last_name || 'Not set'}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                {isEditing ? (
                  <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {profile?.gender || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                {isEditing ? (
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="City, Country"
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {profile?.location || 'Not set'}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded min-h-[60px]">
                    {profile?.bio || 'No bio added yet'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Globe className="w-5 h-5 mr-2 text-torah-600" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="preferred_language" className="text-sm font-medium">Preferred Language</Label>
                {isEditing ? (
                  <Select 
                    value={formData.preferred_language} 
                    onValueChange={(value) => handleInputChange('preferred_language', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {profile?.preferred_language === 'en' ? 'English' : 
                     profile?.preferred_language === 'fr' ? 'Français' : 
                     profile?.preferred_language === 'de' ? 'Deutsch' : 'English'}
                  </p>
                )}
              </div>

              {profile?.role === 'teacher' && (
                <div>
                  <Label htmlFor="hourly_rate" className="text-sm font-medium">Hourly Rate ($)</Label>
                  {isEditing ? (
                    <Input
                      id="hourly_rate"
                      type="number"
                      min="0"
                      value={formData.hourly_rate}
                      onChange={(e) => handleInputChange('hourly_rate', parseInt(e.target.value) || 0)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      ${profile?.hourly_rate || 0}/hour
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Subjects */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <BookOpen className="w-5 h-5 mr-2 text-torah-600" />
                Subjects
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.subjects.map((subject, index) => (
                  <Badge key={index} variant="secondary" className="bg-torah-100 text-torah-700 border-torah-200">
                    {subject}
                    {isEditing && (
                      <button
                        onClick={() => removeSubject(subject)}
                        className="ml-2 text-torah-500 hover:text-torah-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.subjects.length === 0 && (
                  <p className="text-sm text-muted-foreground">No subjects added yet</p>
                )}
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Add a subject..."
                    onKeyPress={(e) => e.key === 'Enter' && addSubject()}
                    className="flex-1"
                  />
                  <Button onClick={addSubject} size="sm" className="bg-torah-500 hover:bg-torah-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Languages */}
          <Card className="shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Globe className="w-5 h-5 mr-2 text-torah-600" />
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {formData.languages.map((lang, index) => (
                  <Badge key={index} variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                    {lang}
                    {isEditing && (
                      <button
                        onClick={() => removeLanguage(lang)}
                        className="ml-2 text-blue-500 hover:text-blue-700 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
                {formData.languages.length === 0 && (
                  <p className="text-sm text-muted-foreground">No languages added yet</p>
                )}
              </div>
              {isEditing && (
                <div className="flex space-x-2">
                  <Input
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Add a language..."
                    onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                    className="flex-1"
                  />
                  <Button onClick={addLanguage} size="sm" className="bg-torah-500 hover:bg-torah-600">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
