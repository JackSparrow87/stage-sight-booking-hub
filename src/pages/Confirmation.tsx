
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Check, Download, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateTicketPDF } from '@/utils/ticketGenerator';
import { toast } from 'sonner';

interface BookingInfo {
  customerName: string;
  email: string;
  birthdate: string;
  paymentReference: string;
}

const Confirmation = () => {
  const navigate = useNavigate();
  const confirmationNumber = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  
  useEffect(() => {
    // Check if we have booking info in session storage
    const storedBookingInfo = sessionStorage.getItem('bookingInfo');
    if (!storedBookingInfo) {
      // If no booking info, redirect to checkout
      toast.error('No booking information found. Please complete the checkout process.');
      navigate('/checkout');
      return;
    }
    
    try {
      const parsedInfo = JSON.parse(storedBookingInfo) as BookingInfo;
      setBookingInfo(parsedInfo);
      
      // Generate PDF ticket
      const ticketPdf = generateTicketPDF({
        eventName: 'Hamlet',
        date: 'April 15, 2025',
        time: '19:30',
        venue: 'Royal Theatre, 123 Main St, New York, NY',
        seats: ['C7', 'C8', 'C9'],
        confirmationNumber,
        customerName: parsedInfo.customerName
      });
      
      setPdfUrl(ticketPdf);
    } catch (error) {
      console.error('Error parsing booking info:', error);
      toast.error('There was an error processing your booking information.');
    }
  }, [confirmationNumber, navigate]);
  
  const handleDownloadTicket = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `Ticket_${confirmationNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Ticket downloaded successfully');
    } else {
      toast.error('Unable to generate ticket. Please try again.');
    }
  };
  
  const handleResendEmail = () => {
    // In a real application, this would call an API to resend the email
    toast.success(`Ticket sent to ${bookingInfo?.email || 'your email'}`);
  };
  
  if (!bookingInfo) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="py-8">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-xl shadow-elevation-1 p-8 text-center mb-8">
          <div className="w-20 h-20 bg-theater-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-10 w-10 text-theater-primary" />
          </div>
          
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-theater-muted mb-6">
            Your tickets have been sent to your email and are also available below.
          </p>
          
          <div className="bg-muted/30 p-4 rounded-lg mb-6">
            <p className="text-sm text-theater-muted mb-1">Confirmation Number</p>
            <p className="text-xl font-bold">{confirmationNumber}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="flex items-center gap-2" onClick={handleDownloadTicket}>
              <Download className="h-4 w-4" />
              Download Tickets
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleResendEmail}>
              <Mail className="h-4 w-4" />
              Resend Email
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-elevation-1 overflow-hidden mb-8">
          <div className="bg-theater-primary text-white p-4">
            <h2 className="font-bold text-xl">Hamlet</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-medium text-theater-muted mb-2">Date & Time</h3>
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 mr-2 text-theater-primary" />
                  <span>April 15, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-theater-primary" />
                  <span>19:30 (Doors open at 19:00)</span>
                </div>
              </div>
              <div>
                <h3 className="font-medium text-theater-muted mb-2">Venue</h3>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-theater-primary mt-1" />
                  <div>
                    <p className="font-medium">Royal Theatre</p>
                    <p className="text-theater-muted">123 Main St, New York, NY</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="font-medium text-theater-muted mb-2">Customer Information</h3>
              <p className="mb-1"><span className="font-medium">Name:</span> {bookingInfo.customerName}</p>
              <p><span className="font-medium">Email:</span> {bookingInfo.email}</p>
              
              <h3 className="font-medium text-theater-muted mb-3 mt-6">Your Seats</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-theater-primary text-white text-sm px-3 py-1 rounded-full">
                  C7
                </span>
                <span className="bg-theater-primary text-white text-sm px-3 py-1 rounded-full">
                  C8
                </span>
                <span className="bg-theater-primary text-white text-sm px-3 py-1 rounded-full">
                  C9
                </span>
              </div>
              
              <div className="bg-muted/30 p-3 rounded-md mb-6">
                <p className="text-sm"><span className="font-medium">Payment Reference:</span> {bookingInfo.paymentReference}</p>
                <p className="text-sm"><span className="font-medium">Payment Method:</span> PayShap</p>
                <p className="text-sm"><span className="font-medium">Payment Status:</span> <span className="text-green-600 font-medium">Confirmed</span></p>
              </div>
              
              <div className="flex justify-between border-t pt-4">
                <span className="font-medium">Total Paid</span>
                <span className="font-bold text-theater-primary">R3850.00</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-elevation-1 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Important Information</h2>
          <ul className="space-y-3 text-theater-muted">
            <li className="flex items-start">
              <span className="bg-theater-primary/10 text-theater-primary h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">1</span>
              <p>Please arrive at least 30 minutes before the show starts. Late arrivals may result in delayed seating or non-admittance until a suitable break.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-theater-primary/10 text-theater-primary h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">2</span>
              <p>Have your tickets ready for scanning, either printed or displayed on your mobile device.</p>
            </li>
            <li className="flex items-start">
              <span className="bg-theater-primary/10 text-theater-primary h-6 w-6 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">3</span>
              <p>Recording of any kind during the performance is strictly prohibited.</p>
            </li>
          </ul>
        </div>
        
        <div className="text-center">
          <Link to="/">
            <Button className="bg-theater-primary">Return to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
