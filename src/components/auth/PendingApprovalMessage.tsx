
import React from 'react';
import { motion } from 'framer-motion';
import { Clock, XCircle, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

const PendingApprovalMessage: React.FC = () => {
  const { t } = useLanguage();
  const { profile, signOut } = useAuth();

  if (!profile || profile.role !== 'teacher') return null;

  const isPending = profile.approval_status === 'pending';
  const isRejected = profile.approval_status === 'rejected';

  if (!isPending && !isRejected) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            {isPending ? (
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {isPending ? t('auth.account_pending') : t('auth.account_rejected')}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {isPending ? t('auth.pending_message') : t('auth.contact_admin')}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => window.location.href = 'mailto:support@torahlearn.com'}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            
            <Button
              variant="ghost"
              className="w-full"
              onClick={signOut}
            >
              {t('nav.logout')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PendingApprovalMessage;
