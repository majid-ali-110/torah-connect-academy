import { supabase } from '@/integrations/supabase/client';

interface TableValidationResult {
  tableName: string;
  exists: boolean;
  rowCount: number;
  error?: string;
  sampleData?: any;
}

interface DatabaseValidationResult {
  isConnected: boolean;
  tables: TableValidationResult[];
  errors: string[];
  warnings: string[];
}

const EXPECTED_TABLES = [
  'profiles',
  'courses',
  'subjects',
  'teachers',
  'course_sessions',
  'study_groups',
  'study_group_members',
  'rabbis',
  'live_classes',
  'live_class_enrollments',
  'discussion_forums',
  'support_tickets',
  'donations',
  'sponsored_courses',
  'teacher_hours',
  'study_sessions',
  'lesson_bookings',
  'conversations',
  'chat_messages',
  'payments',
  'teacher_earnings',
  'withdrawals',
  'admin_actions',
  'admin_approvals',
  'contact_submissions',
  'course_enrollments',
  'class_enrollments',
  'forum_replies',
  'messages',
  'payment_methods',
  'reviews'
];

export const validateDatabase = async (): Promise<DatabaseValidationResult> => {
  const result: DatabaseValidationResult = {
    isConnected: false,
    tables: [],
    errors: [],
    warnings: []
  };

  try {
    // Test basic connection
    const { error: connectionError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (connectionError) {
      result.errors.push(`Connection failed: ${connectionError.message}`);
      return result;
    }

    result.isConnected = true;

    // Validate each table
    for (const tableName of EXPECTED_TABLES) {
      const tableResult: TableValidationResult = {
        tableName,
        exists: false,
        rowCount: 0
      };

      try {
        const { count, data, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: false })
          .limit(1);

        if (error) {
          tableResult.error = error.message;
          if (error.code === '42P01') {
            result.errors.push(`Table '${tableName}' does not exist`);
          } else {
            result.warnings.push(`Table '${tableName}' query failed: ${error.message}`);
          }
        } else {
          tableResult.exists = true;
          tableResult.rowCount = count || 0;
          if (data && data.length > 0) {
            tableResult.sampleData = data[0];
          }
        }
      } catch (err) {
        tableResult.error = err instanceof Error ? err.message : 'Unknown error';
        result.warnings.push(`Table '${tableName}' validation failed: ${tableResult.error}`);
      }

      result.tables.push(tableResult);
    }

    // Check for critical relationships
    await validateRelationships(result);

  } catch (err) {
    result.errors.push(`Database validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }

  return result;
};

const validateRelationships = async (result: DatabaseValidationResult) => {
  // Check if courses have valid teacher references
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, teacher_id, profiles!courses_teacher_id_fkey(id, email)')
      .limit(5);

    if (error) {
      result.warnings.push(`Course-Teacher relationship check failed: ${error.message}`);
    } else if (courses) {
      const orphanedCourses = courses.filter(course => !course.profiles);
      if (orphanedCourses.length > 0) {
        result.warnings.push(`Found ${orphanedCourses.length} courses with invalid teacher references`);
      }
    }
  } catch (err) {
    result.warnings.push(`Relationship validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
};

export const checkDatabasePolicies = async () => {
  const policies: Record<string, boolean> = {};

  // Test read access for key tables
  const tablesToCheck = ['profiles', 'courses', 'subjects', 'teachers'];

  for (const table of tablesToCheck) {
    try {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      policies[`${table}_read`] = !error;
    } catch {
      policies[`${table}_read`] = false;
    }
  }

  return policies;
};

export const getDatabaseStats = async () => {
  const stats: Record<string, number> = {};

  const tablesToCount = [
    'profiles',
    'courses',
    'subjects',
    'teachers',
    'study_groups',
    'live_classes',
    'rabbis'
  ];

  for (const table of tablesToCount) {
    try {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      stats[table] = count || 0;
    } catch {
      stats[table] = -1;
    }
  }

  return stats;
}; 