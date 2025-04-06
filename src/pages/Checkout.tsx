import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { ChevronLeft, CreditCard, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import PaymentProofUploader from '@/components/PaymentProofUploader';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseExtended } from '@/integrations/supabase/client-extended';

// Format currency to Rands
const formatCurrency = (amount: number) => {
  return `R${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    paymentReference: ''
  });

  const eventData = location.state?.event || {
    id: "default-event-id",
    title: "Hamlet",
    date: "Apr 15, 2025",
    time: "19:30",
    venue: "Royal Theatre"
  };
  
  const selectedSeats = location.state?.selectedSeats || ["C7", "C8", "C9"];
  const totalAmount = location.state?.totalAmount || 3850;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if ((name === 'firstName' || name === 'lastName') && formData.birthdate) {
      const fullName = name === 'firstName' 
        ? `${value} ${formData.lastName}` 
        : `${formData.firstName} ${value}`;
      
      if (fullName.trim() !== '' && formData.birthdate) {
        const reference = `${fullName.trim().replace(/\s+/g, '')}${formData.birthdate.replace(/-/g, '')}`;
        setFormData(prev => ({ ...prev, paymentReference: reference }));
      }
    }
    
    if (name === 'birthdate' && formData.firstName && formData.lastName) {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      const reference = `${fullName.trim().replace(/\s+/g, '')}${value.replace(/-/g, '')}`;
      setFormData(prev => ({ ...prev, paymentReference: reference }));
    }
  };
  
  const handlePaymentProofUpload = (file: File) => {
    setPaymentProof(file);
    setPaymentProofUploaded(true);
    toast.success('Proof of payment uploaded successfully');
  };

  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.birthdate.trim() !== '' &&
      paymentProofUploaded
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill in all required fields and upload proof of payment');
      return;
    }
    
    if (!paymentProofUploaded) {
      toast.error('Please upload proof of payment to complete your booking');
      return;
    }

    if (!user) {
      toast.error('You must be logged in to complete a booking');
      navigate('/auth');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      let paymentProofUrl = null;
      if (paymentProof) {
        const fileExt = paymentProof.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabaseExtended.storage
          .from('theater_images')
          .upload(fileName, paymentProof);
        
        if (uploadError) {
          console.error('Error uploading payment proof:', uploadError);
          throw new Error('Failed to upload payment proof');
        }
        
        const { data: urlData } = supabaseExtended.storage
          .from('theater_images')
          .getPublicUrl(fileName);
        
        paymentProofUrl = urlData.publicUrl;
      }
      
      const { data, error } = await supabaseExtended
        .from('bookings')
        .insert({
          user_id: user.id,
          show_id: eventData.id,
          seats: selectedSeats.length,
          total_amount: totalAmount,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error saving booking:', error);
        throw new Error('Failed to save booking information');
      }
      
      sessionStorage.setItem('bookingInfo', JSON.stringify({
        customerName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        birthdate: formData.birthdate,
        paymentReference: formData.paymentReference,
        paymentProofUrl
      }));
      
      navigate('/confirmation');
    } catch (error) {
      console.error('Error processing booking:', error);
      toast.error('There was an error processing your booking. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-8">
      <div className="container-custom max-w-5xl">
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
                
                <div className="mb-6">
                  <Label htmlFor="birthdate">Birthdate*</Label>
                  <Input
                    id="birthdate"
                    name="birthdate"
                    type="date"
                    value={formData.birthdate}
                    onChange={handleChange}
                    className="mt-1"
                    required
                  />
                  <p className="text-xs text-theater-muted mt-1">
                    Required for payment reference
                  </p>
                </div>
                
                <div className="border-t pt-6 mb-6">
                  <div className="flex items-center mb-4">
                    <CreditCard className="h-5 w-5 mr-2 text-theater-primary" />
                    <h3 className="font-bold">PayShap Payment Details</h3>
                  </div>
                  
                  <div className="bg-muted/30 p-4 rounded-lg mb-6">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="h-4 w-4 text-theater-primary mr-2" />
                      <h4 className="font-medium">Payment Instructions</h4>
                    </div>
                    <ol className="text-sm space-y-2 pl-6 list-decimal">
                      <li>Open your banking app and select PayShap as payment method</li>
                      <li>Enter the PayShap ID: <span className="font-medium">0817058446</span></li>
                      <li>Enter the amount: <span className="font-medium">{formatCurrency(totalAmount)}</span></li>
                      <li>Use the reference below when making payment</li>
                      <li>Upload a screenshot of your payment confirmation</li>
                    </ol>
                  </div>
                  
                  <div className="mb-6">
                    <Label htmlFor="paymentReference">Payment Reference*</Label>
                    <Input
                      id="paymentReference"
                      name="paymentReference"
                      value={formData.paymentReference}
                      className="mt-1 font-medium"
                      readOnly
                    />
                    <p className="text-xs text-theater-muted mt-1">
                      Use this reference when making payment to Mr Mahuni via PayShap
                    </p>
                  </div>
                  
                  <PaymentProofUploader 
                    onUploadComplete={handlePaymentProofUpload}
                    isUploaded={paymentProofUploaded}
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-theater-primary py-6 text-lg"
                  disabled={isProcessing || !paymentProofUploaded}
                >
                  {isProcessing ? 'Processing Payment...' : 'Complete Purchase'}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-elevation-1 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium">{eventData.title}</h3>
                <p className="text-sm text-theater-muted">{eventData.date} • {eventData.time}</p>
                <div className="mt-3 bg-muted/30 p-2 rounded-md">
                  <p className="text-sm font-medium">Selected Seats: {selectedSeats.length}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedSeats.map((seat: string) => (
                      <span key={seat} className="bg-theater-primary text-white text-xs px-2 py-1 rounded-full">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Tickets ({selectedSeats.length})</span>
                  <span>{formatCurrency(totalAmount - 550)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Booking Fee</span>
                  <span>R250.00</span>
                </div>
                <div className="flex justify-between text-sm text-theater-muted">
                  <span>Taxes</span>
                  <span>R300.00</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-theater-primary">{formatCurrency(totalAmount)}</span>
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
