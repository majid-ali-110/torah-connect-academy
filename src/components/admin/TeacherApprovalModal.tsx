
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { User, Mail, MapPin, Calendar, Check, X } from 'lucide-react';
import { Profile } from '@/types/auth';
import { useLanguage } from '@/contexts/LanguageContext';

interface TeacherApprovalModalProps {
  teacher: Profile | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove: (teacherId: string, notes?: string) => Promise<void>;
  onReject: (teacherId: string, notes?: string) => Promise<void>;
}

const TeacherApprovalModal: React.FC<TeacherApprovalModalProps> = ({
  teacher,
  isOpen,
  onClose,
  onApprove,
  onReject
}) => {
  const { t } = useLanguage();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!teacher) return;
    setLoading(true);
    try {
      await onApprove(teacher.id, notes);
      setNotes('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!teacher) return;
    setLoading(true);
    try {
      await onReject(teacher.id, notes);
      setNotes('');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" />
            {t('admin.teacher_approval')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Teacher Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-torah-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-torah-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">
                  {teacher.first_name} {teacher.last_name}
                </h3>
                <Badge variant="secondary">{teacher.approval_status}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-gray-500" />
                <span>{teacher.email}</span>
              </div>
              {teacher.location && (
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{teacher.location}</span>
                </div>
              )}
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                <span>{new Date(teacher.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {teacher.bio && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">{t('common.bio')}</h4>
                <p className="text-gray-600 text-sm">{teacher.bio}</p>
              </div>
            )}

            {teacher.subjects && teacher.subjects.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">{t('common.subjects')}</h4>
                <div className="flex flex-wrap gap-2">
                  {teacher.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline">{subject}</Badge>
                  ))}
                </div>
              </div>
            )}

            {teacher.experience && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">{t('common.experience')}</h4>
                <p className="text-gray-600 text-sm">{teacher.experience}</p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              {t('admin.approval_notes')}
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('admin.notes_placeholder')}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={loading}
            >
              <X className="mr-2 h-4 w-4" />
              {t('admin.reject')}
            </Button>
            <Button 
              onClick={handleApprove}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="mr-2 h-4 w-4" />
              {t('admin.approve')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TeacherApprovalModal;
