
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard, ChevronRight } from 'lucide-react';

const PaymentStep = ({ step }: { step: number }) => {
  return (
    <div className="mb-8">
      <Progress value={(step / 3) * 100} className="h-2 mb-4" />
      <div className="flex justify-between">
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-torah-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            step >= 1 ? 'bg-torah-100 text-torah-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {step > 1 ? <Check className="h-5 w-5" /> : '1'}
          </div>
          <span className="text-xs">Details</span>
        </div>
        
        <div className={`flex flex-col items-center ${step >= 2 ? 'text-torah-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            step >= 2 ? 'bg-torah-100 text-torah-600' : 'bg-gray-100 text-gray-400'
          }`}>
            {step > 2 ? <Check className="h-5 w-5" /> : '2'}
          </div>
          <span className="text-xs">Payment</span>
        </div>
        
        <div className={`flex flex-col items-center ${step >= 3 ? 'text-torah-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
            step >= 3 ? 'bg-torah-100 text-torah-600' : 'bg-gray-100 text-gray-400'
          }`}>
            3
          </div>
          <span className="text-xs">Confirmation</span>
        </div>
      </div>
    </div>
  );
};

// Payment Details Form
const PaymentDetailsForm = ({ onNext }: { onNext: () => void }) => {
  const [formValid, setFormValid] = useState(false);
  
  // This would normally check all form fields
  const checkFormValidity = () => {
    setFormValid(true);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4">Payment Details</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input 
              id="firstName" 
              placeholder="First Name" 
              className="mt-1" 
              onChange={checkFormValidity} 
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input 
              id="lastName" 
              placeholder="Last Name" 
              className="mt-1" 
              onChange={checkFormValidity} 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            type="email" 
            placeholder="Email Address" 
            className="mt-1" 
            onChange={checkFormValidity} 
          />
        </div>
        
        <div>
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            placeholder="Street Address" 
            className="mt-1" 
            onChange={checkFormValidity} 
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="city">City</Label>
            <Input 
              id="city" 
              placeholder="City" 
              className="mt-1" 
              onChange={checkFormValidity} 
            />
          </div>
          <div>
            <Label htmlFor="state">State/Province</Label>
            <Input 
              id="state" 
              placeholder="State" 
              className="mt-1" 
              onChange={checkFormValidity} 
            />
          </div>
          <div>
            <Label htmlFor="zip">Zip/Postal Code</Label>
            <Input 
              id="zip" 
              placeholder="Zip Code" 
              className="mt-1" 
              onChange={checkFormValidity} 
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            placeholder="Country" 
            className="mt-1" 
            onChange={checkFormValidity} 
          />
        </div>
        
        <div className="pt-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={onNext} 
              disabled={!formValid} 
              className="w-full bg-torah-500 hover:bg-torah-600"
            >
              Continue to Payment <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

// Payment Method Form
const PaymentMethodForm = ({ onNext, onBack }: { onNext: () => void; onBack: () => void }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-bold mb-4">Payment Method</h2>
      
      <div className="space-y-6 mb-6">
        <div>
          <Label className="mb-2 block">Select Payment Method</Label>
          <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod}>
            <div className="flex items-center space-x-2 border rounded-md p-4 mb-2">
              <RadioGroupItem value="credit-card" id="credit-card" />
              <Label htmlFor="credit-card" className="flex-grow flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-torah-600" /> Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-md p-4 mb-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex-grow">PayPal</Label>
            </div>
          </RadioGroup>
        </div>
        
        {paymentMethod === 'credit-card' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input id="cardName" placeholder="Name on Card" className="mt-1" />
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiration Date</Label>
                <Input id="expiry" placeholder="MM/YY" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" placeholder="123" className="mt-1" />
              </div>
            </div>
          </motion.div>
        )}
        
        {paymentMethod === 'paypal' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-center p-4 bg-blue-50 rounded-lg"
          >
            <p className="mb-4">You will be redirected to PayPal to complete your payment.</p>
          </motion.div>
        )}
      </div>
      
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button 
          variant="outline" 
          onClick={onBack} 
          className="w-full"
        >
          Go Back
        </Button>
        <motion.div className="w-full sm:w-auto sm:flex-grow" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={onNext} 
            disabled={!paymentMethod} 
            className="w-full bg-torah-500 hover:bg-torah-600"
          >
            Complete Payment <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Confirmation Screen
const ConfirmationScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-6"
    >
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
      <p className="text-gray-600 mb-6">Thank you for your payment. Your lessons are now ready to begin.</p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
        <h3 className="font-semibold mb-2">Transaction Details</h3>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Transaction ID:</span>
            <span>TXN12345678</span>
          </div>
          <div className="flex justify-between">
            <span>Payment Date:</span>
            <span>May 22, 2023</span>
          </div>
          <div className="flex justify-between">
            <span>Amount:</span>
            <span>$49.99</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button className="bg-torah-500 hover:bg-torah-600">
          View My Schedule
        </Button>
        <Button variant="outline">
          Download Receipt
        </Button>
      </div>
    </motion.div>
  );
};

const Payment = () => {
  const [step, setStep] = useState(1);
  
  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, 3));
  };
  
  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your payment to book your Torah lessons</p>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <PaymentStep step={step} />
            
            <Separator className="my-6" />
            
            {/* Order Summary */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Order Summary</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-medium">Torah Studies Package</h4>
                    <p className="text-sm text-gray-600">4 Weekly Sessions with Rabbi David</p>
                    <Badge className="mt-1 bg-torah-100 text-torah-700 hover:bg-torah-200">Monthly Package</Badge>
                  </div>
                  <span className="font-medium">$49.99</span>
                </div>
                
                <Separator className="my-3" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>$49.99</span>
                </div>
              </div>
            </div>
            
            {step === 1 && <PaymentDetailsForm onNext={handleNext} />}
            {step === 2 && <PaymentMethodForm onNext={handleNext} onBack={handleBack} />}
            {step === 3 && <ConfirmationScreen />}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Payment;
