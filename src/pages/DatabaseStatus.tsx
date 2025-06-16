import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Database, 
  RefreshCw,
  Loader2,
  Table,
  Link,
  Shield
} from 'lucide-react';
import { validateDatabase, checkDatabasePolicies, getDatabaseStats } from '@/utils/databaseValidator';
import { testDatabaseConnection } from '@/integrations/supabase/client';

const DatabaseStatus: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<boolean>(false);
  const [validationResult, setValidationResult] = useState<any>(null);
  const [policies, setPolicies] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<Record<string, number>>({});

  const runFullValidation = async () => {
    setIsLoading(true);
    
    try {
      // Test basic connection
      const isConnected = await testDatabaseConnection();
      setConnectionStatus(isConnected);

      // Run full validation
      const validation = await validateDatabase();
      setValidationResult(validation);

      // Check policies
      const policyResults = await checkDatabasePolicies();
      setPolicies(policyResults);

      // Get statistics
      const statsResults = await getDatabaseStats();
      setStats(statsResults);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runFullValidation();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getTableStatusBadge = (table: any) => {
    if (!table.exists) {
      return <Badge variant="destructive">Missing</Badge>;
    }
    if (table.error) {
      return <Badge variant="secondary">Error</Badge>;
    }
    if (table.rowCount === 0) {
      return <Badge variant="outline">Empty</Badge>;
    }
    return <Badge variant="default">Active ({table.rowCount})</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="w-8 h-8" />
          Database Status
        </h1>
        <Button 
          onClick={runFullValidation} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Refresh
        </Button>
      </div>

      {/* Connection Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Connection Status
            {getStatusIcon(connectionStatus)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Database URL:</span>
              <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                gidsrdkwacpchbswjdho.supabase.co
              </code>
            </div>
            <div className="flex justify-between items-center">
              <span>Connection Status:</span>
              <span className={connectionStatus ? 'text-green-600' : 'text-red-600'}>
                {connectionStatus ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {validationResult && (
        <Tabs defaultValue="tables" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tables">Tables</TabsTrigger>
            <TabsTrigger value="errors">Errors & Warnings</TabsTrigger>
            <TabsTrigger value="policies">Policies</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="tables" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="w-5 h-5" />
                  Database Tables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {validationResult.tables.map((table: any) => (
                    <div 
                      key={table.tableName}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <span className="font-medium">{table.tableName}</span>
                      {getTableStatusBadge(table)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            {validationResult.errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Errors</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2">
                    {validationResult.errors.map((error: string, index: number) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validationResult.warnings.length > 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Warnings</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2">
                    {validationResult.warnings.map((warning: string, index: number) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validationResult.errors.length === 0 && validationResult.warnings.length === 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">All Good!</AlertTitle>
                <AlertDescription className="text-green-700">
                  No errors or warnings detected in the database.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="policies" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Row Level Security Policies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(policies).map(([policy, enabled]) => (
                    <div key={policy} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{policy}</span>
                      {getStatusIcon(enabled)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(stats).map(([table, count]) => (
                    <div key={table} className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold">
                        {count === -1 ? 'Error' : count}
                      </div>
                      <div className="text-sm text-gray-600">{table}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default DatabaseStatus; 