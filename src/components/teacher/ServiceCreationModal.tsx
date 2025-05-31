
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ServiceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  teacherId: string;
  onServiceCreated: () => void;
}

const ServiceCreationModal: React.FC<ServiceCreationModalProps> = ({
  isOpen,
  onClose,
  teacherId,
  onServiceCreated
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    audience: '',
    price: '',
    maxStudents: '10',
    ageRange: ''
  });
  const [subjects, setSubjects] = useState<string[]>([]);
  const [audiences, setAudiences] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const availableSubjects = [
    'Torah Study', 'Talmud', 'Hebrew Language', 'Jewish History', 
    'Halacha', 'Mishnah', 'Gemara', 'Jewish Philosophy', 'Prayer Services'
  ];

  const availableAudiences = [
    'Children', 'Teenagers', 'Adults', 'Seniors', 'Beginners', 
    'Intermediate', 'Advanced', 'Women Only', 'Men Only'
  ];

  const addSubject = (subject: string) => {
    if (subject && !subjects.includes(subject)) {
      setSubjects([...subjects, subject]);
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s !== subject));
  };

  const addAudience = (audience: string) => {
    if (audience && !audiences.includes(audience)) {
      setAudiences([...audiences, audience]);
    }
  };

  const removeAudience = (audience: string) => {
    setAudiences(audiences.filter(a => a !== audience));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || subjects.length === 0 || audiences.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert([{
          teacher_id: teacherId,
          title: formData.title,
          description: formData.description,
          subject: subjects[0], // Primary subject
          audience: audiences[0], // Primary audience
          price: parseInt(formData.price) * 100, // Convert to cents
          max_students: parseInt(formData.maxStudents),
          age_range: formData.ageRange || null,
          is_active: true
        }]);

      if (error) throw error;

      // Also update teacher profile with subjects and audiences
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          subjects: [...new Set([...subjects])],
          audiences: [...new Set([...audiences])]
        })
        .eq('id', teacherId);

      if (profileError) {
        console.error('Error updating profile:', profileError);
      }

      toast({
        title: "Service Created",
        description: "Your teaching service has been created successfully.",
      });

      onServiceCreated();
      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        subject: '',
        audience: '',
        price: '',
        maxStudents: '10',
        ageRange: ''
      });
      setSubjects([]);
      setAudiences([]);
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: "Error",
        description: "Failed to create service. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Teaching Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Introduction to Torah Study"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your teaching service, methodology, and what students will learn..."
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subjects * (Select multiple)
            </label>
            <Select value="" onValueChange={addSubject}>
              <SelectTrigger>
                <SelectValue placeholder="Add subjects" />
              </SelectTrigger>
              <SelectContent>
                {availableSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {subjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="flex items-center gap-1">
                  {subject}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeSubject(subject)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience * (Select multiple)
            </label>
            <Select value="" onValueChange={addAudience}>
              <SelectTrigger>
                <SelectValue placeholder="Add target audiences" />
              </SelectTrigger>
              <SelectContent>
                {availableAudiences.map((audience) => (
                  <SelectItem key={audience} value={audience}>
                    {audience}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 mt-2">
              {audiences.map((audience) => (
                <Badge key={audience} variant="secondary" className="flex items-center gap-1">
                  {audience}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeAudience(audience)} />
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Hour ($) *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="25"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Students
              </label>
              <Input
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                min="1"
                max="50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Range (Optional)
            </label>
            <Input
              value={formData.ageRange}
              onChange={(e) => setFormData({ ...formData, ageRange: e.target.value })}
              placeholder="e.g., 18-65, 13+, All ages"
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-torah-500 hover:bg-torah-600"
            >
              {submitting ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCreationModal;
