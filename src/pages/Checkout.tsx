
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import PaymentProofUploader from '@/components/PaymentProofUploader';

// Define the schema for our form
const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  birthdate: z.string().min(1, {
    message: "Please enter your birthdate.",
  }),
  paymentReference: z.string().min(5, {
    message: "Payment reference must be at least 5 characters.",
  }),
});

// Type for our form values
type CheckoutFormValues = z.infer<typeof formSchema>;

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [paymentProofUploaded, setPaymentProofUploaded] = useState(false);
  const [eventData, setEventData] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);

  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofUrl, setPaymentProofUrl] = useState<string>('');
  
  // Load event and seat data from sessionStorage
  useEffect(() => {
    const storedEventData = sessionStorage.getItem('eventData');
    const storedSeatsData = sessionStorage.getItem('selectedSeats');
    
    if (!storedEventData || !storedSeatsData) {
      toast.error('No booking information found. Please select seats first.');
      navigate('/events');
      return;
    }
    
    try {
      setEventData(JSON.parse(storedEventData));
      setSelectedSeats(JSON.parse(storedSeatsData));
    } catch (error) {
      console.error('Error parsing stored data:', error);
      toast.error('Error loading booking information.');
      navigate('/events');
    }
  }, [navigate]);
  
  const handlePaymentProofUpload = (file: File, url: string) => {
    setPaymentProofFile(file);
    setPaymentProofUrl(url);
    setPaymentProofUploaded(true);
  };
  
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.user_metadata?.first_name || "",
      lastName: user?.user_metadata?.last_name || "",
      email: user?.email || "",
      birthdate: "",
      paymentReference: "",
    },
  });

  const calculateTotal = () => {
    return selectedSeats.length * 950;
  };

  const handleSubmit = async (data: CheckoutFormValues) => {
    setProcessing(true);
    
    try {
      if (!eventData?.id) {
        throw new Error('No event selected');
      }
      
      if (!selectedSeats.length) {
        throw new Error('No seats selected');
      }
      
      // Ensure eventData.id is a valid UUID
      const eventId = typeof eventData.id === 'string' && 
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventData.id) 
        ? eventData.id 
        : null;
        
      if (!eventId) {
        throw new Error('Invalid event ID format. Expected UUID.');
      }
      
      // Create the booking in Supabase
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user?.id || '00000000-0000-0000-0000-000000000000', // Use a valid UUID fallback
          show_id: eventId,
          seats: selectedSeats.length,
          total_amount: calculateTotal(),
          customer_name: `${data.firstName} ${data.lastName}`,
          customer_email: data.email,
          customer_birthdate: data.birthdate,
          payment_reference: data.paymentReference,
          payment_proof_url: paymentProofUrl
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Save the booking info to session storage for the confirmation page
      const bookingInfo = {
        customerName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        birthdate: data.birthdate,
        paymentReference: data.paymentReference,
        confirmationNumber: `TKT-${Math.floor(100000 + Math.random() * 900000)}`,
        eventTitle: eventData.title,
        eventDate: eventData.date,
        eventTime: eventData.time,
        venue: eventData.venue,
        seats: selectedSeats.map((seat: any) => seat.id),
        totalAmount: `R${calculateTotal().toFixed(2)}`,
        paymentProofUrl: paymentProofUrl
      };
      
      sessionStorage.setItem('bookingInfo', JSON.stringify(bookingInfo));
      
      // Navigate to confirmation page
      navigate('/confirmation');
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(`Payment failed: ${error.message}`);
      setProcessing(false);
    }
  };
  
  return (
    <div className="container-custom max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <p className="text-theater-muted mb-8">
        Enter your details and payment information to complete your booking.
      </p>
      
      {eventData && (
        <div className="bg-white rounded-xl shadow-elevation-1 p-4 mb-6">
          <h2 className="font-bold">Booking Summary</h2>
          <p className="text-sm">{eventData.title} - {eventData.date}</p>
          <p className="text-sm">Selected Seats: {selectedSeats.length}</p>
          <p className="font-bold text-theater-primary mt-2">Total: R{calculateTotal().toFixed(2)}</p>
        </div>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Birthdate</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="paymentReference"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment Reference</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your payment reference" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Proof of Payment */}
          <PaymentProofUploader 
            onUploadComplete={handlePaymentProofUpload}
            isUploaded={paymentProofUploaded}
          />
          
          {/* Submit Button */}
          <div className="mt-8">
            <Button
              className="w-full bg-theater-primary py-6 text-lg"
              type="submit"
              disabled={processing || !paymentProofUploaded}
            >
              {processing ? 'Processing Payment...' : `Complete Booking - R${calculateTotal().toFixed(2)}`}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CheckoutForm;
