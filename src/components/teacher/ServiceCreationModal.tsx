
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceCreationModalProps {
  onServiceCreated?: () => void;
}

const ServiceCreationModal: React.FC<ServiceCreationModalProps> = ({ onServiceCreated }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: '',
    audience: '',
    age_range: '',
    price: '',
    max_students: '10'
  });

  const subjects = [
    'Torah Study', 'Talmud', 'Mishnah', 'Hebrew Language', 'Jewish History',
    'Jewish Philosophy', 'Kabbalah', 'Jewish Law (Halakha)', 'Prayer Services',
    'Jewish Holidays', 'Lifecycle Events', 'Ethics and Morality'
  ];

  const audiences = ['men', 'women', 'children'];
  const ageRanges = ['5-10', '11-15', '16-20', '21-30', '31-40', '41-50', '50+'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to create a service');
      return;
    }

    if (!formData.title || !formData.subject || !formData.audience || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('courses')
        .insert([{
          teacher_id: user.id,
          title: formData.title,
          description: formData.description,
          subject: formData.subject,
          audience: formData.audience,
          age_range: formData.age_range || null,
          price: parseInt(formData.price),
          max_students: parseInt(formData.max_students)
        }]);

      if (error) throw error;

      toast.success('Service created successfully!');
      setIsOpen(false);
      setFormData({
        title: '',
        description: '',
        subject: '',
        audience: '',
        age_range: '',
        price: '',
        max_students: '10'
      });
      onServiceCreated?.();
    } catch (error) {
      console.error('Error creating service:', error);
      toast.error('Failed to create service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-torah-500 hover:bg-torah-600 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Service
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Teaching Service</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Service Title *
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Beginner Torah Study"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your teaching service..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Target Audience *
            </label>
            <Select value={formData.audience} onValueChange={(value) => setFormData({ ...formData, audience: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select audience" />
              </SelectTrigger>
              <SelectContent>
                {audiences.map((audience) => (
                  <SelectItem key={audience} value={audience}>
                    {audience.charAt(0).toUpperCase() + audience.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age Range
            </label>
            <Select value={formData.age_range} onValueChange={(value) => setFormData({ ...formData, age_range: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select age range (optional)" />
              </SelectTrigger>
              <SelectContent>
                {ageRanges.map((range) => (
                  <SelectItem key={range} value={range}>
                    {range}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price per Hour *
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
                value={formData.max_students}
                onChange={(e) => setFormData({ ...formData, max_students: e.target.value })}
                min="1"
                max="50"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-torah-500 hover:bg-torah-600"
            >
              {isSubmitting ? 'Creating...' : 'Create Service'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCreationModal;
