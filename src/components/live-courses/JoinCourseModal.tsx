
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { KeyRound, Users } from 'lucide-react';

interface JoinCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClassJoined: () => void;
}

const JoinCourseModal: React.FC<JoinCourseModalProps> = ({
  isOpen,
  onClose,
  onClassJoined
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [courseKey, setCourseKey] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !courseKey.trim()) return;

    setLoading(true);
    try {
      // D'abord, vérifier si le cours existe
      const { data: liveClass, error: fetchError } = await supabase
        .from('live_classes')
        .select(`
          *,
          profiles!teacher_id (
            first_name,
            last_name
          )
        `)
        .eq('course_key', courseKey.trim().toUpperCase())
        .single();

      if (fetchError || !liveClass) {
        toast({
          title: 'Clé de Cours Invalide',
          description: 'La clé de cours que vous avez saisie n\'existe pas. Veuillez vérifier et réessayer.',
          variant: 'destructive'
        });
        return;
      }

      // Vérifier si l'étudiant est déjà inscrit
      const { data: existingEnrollment } = await supabase
        .from('class_enrollments')
        .select('id')
        .eq('class_id', liveClass.id)
        .eq('student_id', user.id)
        .single();

      if (existingEnrollment) {
        toast({
          title: 'Déjà Inscrit',
          description: 'Vous êtes déjà inscrit à ce cours en direct.',
          variant: 'destructive'
        });
        return;
      }

      // Vérifier le nombre d'inscriptions actuelles
      const { count: currentEnrollments } = await supabase
        .from('class_enrollments')
        .select('*', { count: 'exact' })
        .eq('class_id', liveClass.id);

      if (currentEnrollments && currentEnrollments >= liveClass.max_participants) {
        toast({
          title: 'Cours Complet',
          description: 'Ce cours en direct a atteint sa capacité maximale.',
          variant: 'destructive'
        });
        return;
      }

      // Inscrire l'étudiant
      const { error: enrollError } = await supabase
        .from('class_enrollments')
        .insert({
          class_id: liveClass.id,
          student_id: user.id
        });

      if (enrollError) {
        toast({
          title: 'Erreur',
          description: 'Échec de l\'inscription au cours en direct. Veuillez réessayer.',
          variant: 'destructive'
        });
        return;
      }

      const teacherName = `${liveClass.profiles?.first_name || ''} ${liveClass.profiles?.last_name || ''}`.trim();
      
      toast({
        title: 'Inscription Réussie !',
        description: `Vous avez rejoint "${liveClass.title}" par ${teacherName}`,
      });

      setCourseKey('');
      onClassJoined();
    } catch (error) {
      console.error('Erreur lors de l\'inscription au cours en direct:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur inattendue s\'est produite.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <KeyRound className="mr-2 h-5 w-5" />
            Rejoindre un Cours en Direct
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="courseKey">Clé de Cours *</Label>
            <Input
              id="courseKey"
              value={courseKey}
              onChange={(e) => setCourseKey(e.target.value)}
              placeholder="Entrez la clé de cours fournie par votre professeur"
              className="mt-1"
              required
            />
            <p className="text-sm text-gray-600 mt-2">
              Les clés de cours font généralement 8 caractères (ex: ABC123XY)
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-start">
              <Users className="mr-2 h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm text-green-800 font-medium">Comment obtenir une clé de cours :</p>
                <ul className="text-sm text-green-700 mt-1 list-disc list-inside">
                  <li>Demandez la clé de cours à votre professeur</li>
                  <li>Vérifiez les annonces de classe ou les emails</li>
                  <li>Cherchez-la dans vos matériels de cours</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button 
              type="submit" 
              disabled={loading || !courseKey.trim()}
              className="bg-torah-500 hover:bg-torah-600"
            >
              {loading ? 'Inscription...' : 'Rejoindre le Cours'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default JoinCourseModal;
