
import React, { useState } from 'react';
import { useDonations } from '@/hooks/useDonations';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Heart, Users, Award, Crown, Star } from 'lucide-react';

interface DonationTier {
  id: string;
  name: string;
  icon: React.ReactNode;
  courses: number;
  amount: number;
  description: string;
}

const donationTiers: DonationTier[] = [
  {
    id: 'silver',
    name: 'Silver Supporter',
    icon: <Award className="w-6 h-6" />,
    courses: 2,
    amount: 20,
    description: 'Enable 2 people to study'
  },
  {
    id: 'gold',
    name: 'Gold Supporter',
    icon: <Star className="w-6 h-6" />,
    courses: 5,
    amount: 50,
    description: 'Enable 5 people to study'
  },
  {
    id: 'platinum',
    name: 'Platinum Supporter',
    icon: <Crown className="w-6 h-6" />,
    courses: 10,
    amount: 100,
    description: 'Enable 10 people to study'
  }
];

export const DonationInterface: React.FC = () => {
  const { donations, createDonation } = useDonations();
  const [selectedTier, setSelectedTier] = useState<DonationTier | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [customCourses, setCustomCourses] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDonation = async (tier: DonationTier | null, isCustom: boolean = false) => {
    setLoading(true);
    try {
      let donationData;
      
      if (isCustom) {
        donationData = {
          amount: parseInt(customAmount) * 100, // Convert to cents
          donation_type: 'custom' as const,
          courses_sponsored: parseInt(customCourses),
          message
        };
      } else if (tier) {
        donationData = {
          amount: tier.amount * 100, // Convert to cents
          donation_type: 'multiple_courses' as const,
          courses_sponsored: tier.courses,
          message
        };
      } else {
        throw new Error('No donation data provided');
      }

      const donation = await createDonation(donationData);
      
      // Here you would integrate with payment processor (Stripe)
      toast.success('Thank you for your generous donation! Payment processing will be implemented.');
      
      // Reset form
      setSelectedTier(null);
      setCustomAmount('');
      setCustomCourses('');
      setMessage('');
      
    } catch (error) {
      console.error('Error processing donation:', error);
      toast.error('Failed to process donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Support Learning for Others</h1>
        <p className="text-lg text-gray-600 mb-2">
          "Pay it Forward" - Help others access quality Jewish education
        </p>
        <p className="text-sm text-gray-500">
          Your donation enables others to study, just as you have benefited. All donations are tax-deductible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {donationTiers.map((tier) => (
          <Card 
            key={tier.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedTier?.id === tier.id ? 'ring-2 ring-torah-500 shadow-lg' : ''
            }`}
            onClick={() => setSelectedTier(tier)}
          >
            <CardHeader className="text-center">
              <div className="flex justify-center mb-2 text-torah-500">
                {tier.icon}
              </div>
              <CardTitle className="text-lg">{tier.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-3">
              <div className="text-2xl font-bold text-torah-600">€{tier.amount}</div>
              <div className="text-sm text-gray-600">{tier.description}</div>
              <Badge variant="secondary" className="w-full">
                {tier.courses} courses sponsored
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Custom Donation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount (€)</label>
              <Input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="50"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Courses to Sponsor</label>
              <Input
                type="number"
                value={customCourses}
                onChange={(e) => setCustomCourses(e.target.value)}
                placeholder="5"
                min="1"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Personal Message (Optional)</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your motivation for supporting others' learning..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-center space-y-4">
        {selectedTier && (
          <Button
            onClick={() => handleDonation(selectedTier)}
            disabled={loading}
            size="lg"
            className="w-full md:w-auto"
          >
            {loading ? 'Processing...' : `Donate €${selectedTier.amount} - ${selectedTier.name}`}
          </Button>
        )}
        
        {customAmount && customCourses && (
          <Button
            onClick={() => handleDonation(null, true)}
            disabled={loading}
            variant="outline"
            size="lg"
            className="w-full md:w-auto"
          >
            {loading ? 'Processing...' : `Donate €${customAmount} - ${customCourses} courses`}
          </Button>
        )}
      </div>

      {donations.length > 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Your Donation History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donations.slice(0, 5).map((donation) => (
                <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <span className="font-medium">€{(donation.amount / 100).toFixed(2)}</span>
                    <span className="text-sm text-gray-600 ml-2">
                      {donation.courses_sponsored} courses sponsored
                    </span>
                  </div>
                  <Badge variant={donation.status === 'completed' ? 'default' : 'secondary'}>
                    {donation.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
