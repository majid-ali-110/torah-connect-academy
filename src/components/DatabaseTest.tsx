import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DatabaseTest: React.FC = () => {
  const { user, profile } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  const [courseCount, setCourseCount] = useState<number>(0);
  const [profileCount, setProfileCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

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

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testChatFunctionality = async () => {
    if (!user || !profile) {
      addResult('❌ User not authenticated');
      return;
    }

    setLoading(true);
    addResult('🧪 Starting chat functionality test...');

    try {
      // Test 1: Create a conversation
      addResult('📝 Testing conversation creation...');
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert([{
          student_id: profile.role === 'student' ? user.id : 'test-teacher-id',
          teacher_id: profile.role === 'teacher' ? user.id : 'test-student-id'
        }])
        .select()
        .single();

      if (convError) {
        addResult(`❌ Conversation creation failed: ${convError.message}`);
        return;
      }
      addResult(`✅ Conversation created: ${conversation.id}`);

      // Test 2: Send a message
      addResult('💬 Testing message sending...');
      const { data: message, error: msgError } = await supabase
        .from('chat_messages')
        .insert([{
          conversation_id: conversation.id,
          sender_id: user.id,
          content: 'Test message from chat functionality test',
          message_type: 'text'
        }])
        .select()
        .single();

      if (msgError) {
        addResult(`❌ Message sending failed: ${msgError.message}`);
        return;
      }
      addResult(`✅ Message sent: ${message.id}`);

      // Test 3: Retrieve messages
      addResult('📥 Testing message retrieval...');
      const { data: messages, error: retrieveError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversation.id)
        .order('created_at', { ascending: true });

      if (retrieveError) {
        addResult(`❌ Message retrieval failed: ${retrieveError.message}`);
        return;
      }
      addResult(`✅ Retrieved ${messages?.length || 0} messages`);

      // Test 4: Retrieve conversations
      addResult('📋 Testing conversation retrieval...');
      const { data: conversations, error: convRetrieveError } = await supabase
        .from('conversations')
        .select('*')
        .or(`student_id.eq.${user.id},teacher_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (convRetrieveError) {
        addResult(`❌ Conversation retrieval failed: ${convRetrieveError.message}`);
        return;
      }
      addResult(`✅ Retrieved ${conversations?.length || 0} conversations`);

      // Test 5: Update conversation timestamp
      addResult('🕒 Testing conversation update...');
      const { error: updateError } = await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversation.id);

      if (updateError) {
        addResult(`❌ Conversation update failed: ${updateError.message}`);
        return;
      }
      addResult('✅ Conversation timestamp updated');

      // Test 6: Mark messages as read
      addResult('👁️ Testing message read status...');
      const { error: readError } = await supabase
        .from('chat_messages')
        .update({ read_at: new Date().toISOString() })
        .eq('conversation_id', conversation.id)
        .neq('sender_id', user.id)
        .is('read_at', null);

      if (readError) {
        addResult(`❌ Message read status update failed: ${readError.message}`);
        return;
      }
      addResult('✅ Message read status updated');

      addResult('🎉 Chat functionality test completed successfully!');

    } catch (error) {
      addResult(`❌ Chat test failed with error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
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

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Chat Functionality Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <Button 
                onClick={testChatFunctionality} 
                disabled={loading || !user}
                className="bg-torah-500 hover:bg-torah-600"
              >
                {loading ? 'Testing...' : 'Test Chat Functionality'}
              </Button>
              <Button onClick={clearResults} variant="outline">
                Clear Results
              </Button>
            </div>

            {!user && (
              <p className="text-red-500">Please log in to test chat functionality</p>
            )}

            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              {testResults.length === 0 ? (
                <p className="text-gray-500">No test results yet. Click the test button to start.</p>
              ) : (
                <div className="space-y-1">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono">
                      {result}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DatabaseTest;
