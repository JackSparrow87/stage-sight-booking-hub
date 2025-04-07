
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { events, generateTheaterSeating, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const SeatSelection = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);
  
  const [seating, setSeating] = useState<any[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<any[]>([]);
  const [randomReservedSeats] = useState<string[]>(() => {
    // Generate random reserved seats
    const reservedSeats = [];
    for (let i = 0; i < 20; i++) {
      const row = String.fromCharCode(65 + Math.floor(Math.random() * 10));
      const seat = Math.floor(Math.random() * 20) + 1;
      reservedSeats.push(`${row}${seat}`);
    }
    return reservedSeats;
  });

  useEffect(() => {
    // Generate seating layout
    const theaterSeating = generateTheaterSeating(10, 20, randomReservedSeats);
    setSeating(theaterSeating);
  }, [randomReservedSeats]);

  const toggleSeatSelection = (seat: any) => {
    if (seat.status === 'reserved') return;
    
    if (selectedSeats.some(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 10) {
        toast.error('You can only select up to 10 seats.');
        return;
      }
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.some(seat => seat.id === seatId);
  };

  const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to continue.');
      return;
    }
    
    // In a real app, we would store the selected seats and event information
    // in a global state or context. For this demo, we'll just navigate.
    navigate('/checkout');
  };

  if (!event) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
        <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
        <Link to="/events">
          <Button>Browse All Events</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="text-theater-muted hover:text-theater-dark"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Event
          </Button>
        </div>

        <h1 className="text-3xl font-bold mb-2">{event.title} - Select Your Seats</h1>
        <p className="text-theater-muted mb-8">{event.venue} • {event.date} • {event.time}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Seating chart */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-elevation-1 p-6">
              <h2 className="text-xl font-bold mb-6">Seating Chart</h2>
              
              {/* Stage area */}
              <div className="w-full h-16 bg-theater-primary/20 rounded-lg mb-8 flex items-center justify-center">
                <p className="font-medium text-theater-primary">STAGE</p>
              </div>
              
              {/* Seating layout */}
              <div className="flex justify-center mb-8 overflow-x-auto pb-4">
                <div className="inline-block">
                  {seating.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex items-center mb-2">
                      <div className="w-6 text-center font-medium text-theater-muted mr-2">
                        {row[0]?.row}
                      </div>
                      <div className="flex flex-wrap">
                        {row.map((seat: any) => (
                          <div
                            key={seat.id}
                            className={`seat ${
                              seat.status === 'reserved'
                                ? 'seat-reserved'
                                : isSeatSelected(seat.id)
                                ? 'seat-selected'
                                : seat.type === 'vip'
                                ? 'seat-vip'
                                : 'seat-available'
                            }`}
                            onClick={() => toggleSeatSelection(seat)}
                          >
                            {seat.number}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Legend */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <div className="seat-available w-6 h-6 mr-2"></div>
                  <span className="text-sm">Available</span>
                </div>
                <div className="flex items-center">
                  <div className="seat-selected w-6 h-6 mr-2"></div>
                  <span className="text-sm">Selected</span>
                </div>
                <div className="flex items-center">
                  <div className="seat-reserved w-6 h-6 mr-2"></div>
                  <span className="text-sm">Reserved</span>
                </div>
                <div className="flex items-center">
                  <div className="seat-vip w-6 h-6 mr-2"></div>
                  <span className="text-sm">VIP</span>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg flex items-start">
                <Info className="h-5 w-5 text-theater-muted mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm text-theater-muted">
                  For accessibility seating options or special assistance, please contact our customer service.
                </p>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-elevation-1 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="border-b pb-4 mb-4">
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-theater-muted">{event.date} • {event.time}</p>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>Selected Seats:</span>
                  <span className="font-medium">{selectedSeats.length}</span>
                </div>
                
                {selectedSeats.length > 0 ? (
                  <div className="bg-muted/30 p-3 rounded-md">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {selectedSeats.map(seat => (
                        <span key={seat.id} className="bg-theater-primary text-white text-xs px-2 py-1 rounded-full">
                          {seat.id}
                        </span>
                      ))}
                    </div>
                    <div className="text-right text-sm">
                      Total: <span className="font-bold text-theater-primary">{formatCurrency(totalPrice)}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-theater-muted italic">
                    No seats selected yet. Please select from the seating chart.
                  </div>
                )}
              </div>
              
              <Button
                className="w-full bg-theater-primary disabled:bg-theater-muted disabled:cursor-not-allowed"
                disabled={selectedSeats.length === 0}
                onClick={handleProceedToCheckout}
              >
                {selectedSeats.length > 0
                  ? `Proceed to Checkout (${formatCurrency(totalPrice)})`
                  : 'Select Seats to Continue'}
              </Button>
              
              <div className="mt-6 text-sm text-theater-muted">
                <p className="mb-2">
                  <strong>Ticket Policy:</strong> All sales are final. No refunds or exchanges.
                </p>
                <p>
                  Tickets will be sent to your email after purchase completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
