
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, CreditCard, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.cardNumber.trim() !== '' &&
      formData.expiryDate.trim() !== '' &&
      formData.cvv.trim() !== ''
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/confirmation');
    }, 2000);
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-5xl">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-theater-muted hover:text-theater-dark"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-theater-muted mb-8">Complete your purchase to secure your tickets</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-elevation-1 p-6">
              <h2 className="text-xl font-bold mb-6">Payment Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <Label htmlFor="firstName">First Name*</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name*</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <Label htmlFor="email">Email Address*</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-theater-muted mt-1">
                    Your tickets will be sent to this email address
                  </p>
                </div>
                
                <div className="border-t pt-6 mb-6">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-5 w-5 mr-2 text-theater-primary" />
                    <h3 className="font-bold">Payment Details</h3>
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor="cardNumber">Card Number*</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      placeholder="XXXX XXXX XXXX XXXX"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className="mt-1"
                      maxLength={19}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date*</Label>
                      <Input
                        id="expiryDate"
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="mt-1"
                        maxLength={5}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV*</Label>
                      <Input
                        id="cvv"
                        name="cvv"
                        placeholder="XXX"
                        value={formData.cvv}
                        onChange={handleChange}
                        className="mt-1"
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/30 p-4 rounded-lg flex items-start mb-6">
                  <Info className="h-5 w-5 text-theater-muted mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm text-theater-muted">
                    Your payment information is encrypted and secure. We never store your full credit card details.
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-theater-primary py-6 text-lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing Payment...' : 'Complete Purchase'}
                </Button>
              </form>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-elevation-1 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium">Hamlet</h3>
                <p className="text-sm text-theater-muted">Apr 15, 2025 • 19:30</p>
                <div className="mt-3 bg-muted/30 p-2 rounded-md">
                  <p className="text-sm font-medium">Selected Seats: 3</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="bg-theater-primary text-white text-xs px-2 py-1 rounded-full">
                      C7
                    </span>
                    <span className="bg-theater-primary text-white text-xs px-2 py-1 rounded-full">
                      C8
                    </span>
                    <span className="bg-theater-primary text-white text-xs px-2 py-1 rounded-full">
                      C9
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Tickets (3)</span>
                  <span>$195.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking Fee</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between text-sm text-theater-muted">
                  <span>Taxes</span>
                  <span>$21.00</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-theater-primary">$231.00</span>
                </div>
              </div>
              
              <div className="text-sm text-theater-muted">
                <p>
                  By completing this purchase, you agree to our <Link to="#" className="text-theater-primary underline">Terms of Service</Link> and <Link to="#" className="text-theater-primary underline">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
