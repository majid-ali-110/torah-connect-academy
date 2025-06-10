
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const DatabaseTest: React.FC = () => {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [courseCount, setCourseCount] = useState<number>(0);
  const [profileCount, setProfileCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setConnectionStatus('testing');
    setError(null);
    
    try {
      console.log('Testing database connection...');
      
      // Test basic connection
      const { data: healthData, error: healthError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true });
      
      if (healthError) {
        throw new Error(`Health check failed: ${healthError.message}`);
      }
      
      // Count profiles
      const { count: profileCountResult, error: profileError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      if (profileError) {
        throw new Error(`Profile count failed: ${profileError.message}`);
      }
      
      // Count courses
      const { count: courseCountResult, error: courseError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });
      
      if (courseError) {
        throw new Error(`Course count failed: ${courseError.message}`);
      }
      
      setProfileCount(profileCountResult || 0);
      setCourseCount(courseCountResult || 0);
      setConnectionStatus('connected');
      
      console.log('Database connection successful!', {
        profiles: profileCountResult,
        courses: courseCountResult
      });
      
    } catch (err) {
      console.error('Database connection failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setConnectionStatus('error');
    }
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Database Connection Test
          {connectionStatus === 'testing' && <Loader2 className="w-5 h-5 animate-spin" />}
          {connectionStatus === 'connected' && <CheckCircle className="w-5 h-5 text-green-500" />}
          {connectionStatus === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className={`font-medium ${
              connectionStatus === 'connected' ? 'text-green-600' : 
              connectionStatus === 'error' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {connectionStatus === 'testing' ? 'Testing...' : 
               connectionStatus === 'connected' ? 'Connected' : 'Error'}
            </span>
          </div>
          
          {connectionStatus === 'connected' && (
            <>
              <div className="flex justify-between">
                <span>Profiles:</span>
                <span className="font-medium">{profileCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Courses:</span>
                <span className="font-medium">{courseCount}</span>
              </div>
            </>
          )}
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
        </div>
        
        <Button 
          onClick={testConnection} 
          disabled={connectionStatus === 'testing'}
          className="w-full"
        >
          {connectionStatus === 'testing' ? 'Testing...' : 'Test Again'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DatabaseTest;
