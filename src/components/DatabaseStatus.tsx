
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface TableStatus {
  name: string;
  exists: boolean;
  rowCount: number;
  error?: string;
}

export const DatabaseStatus = () => {
  const [tables, setTables] = useState<TableStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking');

  const expectedTables = [
    'profiles',
    'subjects',
    'courses',
    'course_sessions',
    'teachers',
    'rabbis',
    'study_groups',
    'study_group_members',
    'live_classes',
    'conversations',
    'chat_messages',
    'donations',
    'sponsored_courses'
  ];

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  const checkDatabaseStatus = async () => {
    setIsLoading(true);
    const tableStatuses: TableStatus[] = [];

    try {
      // Test basic connection
      const { error: connectionError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (connectionError && connectionError.code !== 'PGRST116') {
        setConnectionStatus('disconnected');
        console.error('Connection error:', connectionError);
        setIsLoading(false);
        return;
      }

      setConnectionStatus('connected');

      // Check each expected table
      for (const tableName of expectedTables) {
        try {
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (error) {
            tableStatuses.push({
              name: tableName,
              exists: false,
              rowCount: 0,
              error: error.message
            });
          } else {
            tableStatuses.push({
              name: tableName,
              exists: true,
              rowCount: count || 0
            });
          }
        } catch (err) {
          tableStatuses.push({
            name: tableName,
            exists: false,
            rowCount: 0,
            error: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      }

      setTables(tableStatuses);
    } catch (error) {
      console.error('Database status check failed:', error);
      setConnectionStatus('disconnected');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (table: TableStatus) => {
    if (table.exists) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    } else if (table.error) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    } else {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (table: TableStatus) => {
    if (table.exists) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Exists ({table.rowCount} rows)</Badge>;
    } else {
      return <Badge variant="destructive">Missing</Badge>;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Database Status
          {connectionStatus === 'connected' && <CheckCircle className="h-5 w-5 text-green-500" />}
          {connectionStatus === 'disconnected' && <XCircle className="h-5 w-5 text-red-500" />}
          {connectionStatus === 'checking' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Connection Status: 
            <Badge 
              variant={connectionStatus === 'connected' ? 'default' : 'destructive'}
              className="ml-2"
            >
              {connectionStatus}
            </Badge>
          </p>
        </div>

        {isLoading ? (
          <p>Checking database tables...</p>
        ) : (
          <div className="space-y-2">
            <h3 className="font-semibold mb-3">Table Status:</h3>
            {tables.map((table) => (
              <div key={table.name} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  {getStatusIcon(table)}
                  <span className="font-medium">{table.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(table)}
                  {table.error && (
                    <span className="text-xs text-red-600 max-w-xs truncate" title={table.error}>
                      {table.error}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 rounded">
          <p className="text-sm text-blue-800">
            <strong>Database URL:</strong> https://yfaswdlywcmagmrkhxkx.supabase.co
          </p>
          <p className="text-sm text-blue-600 mt-1">
            Connected to your new Supabase database. If tables are missing, we'll need to create them.
          </p>
        </div>

        <button 
          onClick={checkDatabaseStatus}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Refresh Status
        </button>
      </CardContent>
    </Card>
  );
};
