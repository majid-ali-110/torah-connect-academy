
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CourseCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: () => void;
}

const CourseCreationModal: React.FC<CourseCreationModalProps> = ({
  isOpen,
  onClose,
  onCourseCreated
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    audience: '',
    age_range: '',
    price: '',
    max_students: '10',
    is_active: true,
    currency: 'eur'
  });

  const subjects = ['Torah', 'Talmud', 'Mishna', 'Halakha', 'Kabbale', 'Hébreu', 'Histoire Juive', 'Liturgie'];
  const audiences = ['Débutants', 'Intermédiaire', 'Avancé', 'Enfants', 'Adultes', 'Hommes', 'Femmes', 'Tous'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert({
          ...formData,
          teacher_id: user.id,
          price: parseInt(formData.price) * 100, // Convert to cents
          max_students: parseInt(formData.max_students)
        });

      if (error) throw error;

      toast({
        title: 'Course Created',
        description: 'Your course has been created successfully!',
      });

      onCourseCreated();
      onClose();
      setFormData({
        title: '',
        description: '',
        subject: '',
        audience: '',
        age_range: '',
        price: '',
        max_students: '10',
        is_active: true,
        currency: 'eur'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create course.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Course Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Subject *</Label>
              <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Target Audience *</Label>
              <Select value={formData.audience} onValueChange={(value) => setFormData({ ...formData, audience: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  {audiences.map((audience) => (
                    <SelectItem key={audience} value={audience}>{audience}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (€) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="max_students">Max Students</Label>
              <Input
                id="max_students"
                type="number"
                min="1"
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="age_range">Age Range</Label>
              <Input
                id="age_range"
                placeholder="e.g., 18-65"
                value={formData.age_range}
                onChange={(e) => setFormData({ ...formData, age_range: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label htmlFor="is_active">Active (visible to students)</Label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CourseCreationModal;
