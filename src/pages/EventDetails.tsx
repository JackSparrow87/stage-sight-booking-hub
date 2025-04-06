
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { events, formatDate, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';

const EventDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

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

  const handleSelectSeats = () => {
    navigate(`/seating/${id}`);
  };

  const handleShareEvent = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

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
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </div>

        {/* Event Header */}
        <div className="bg-white rounded-xl shadow-elevation-1 overflow-hidden mb-8">
          <div className="relative aspect-video md:aspect-[2.5/1] overflow-hidden">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 md:p-8 text-white w-full">
                <span className="badge badge-accent mb-2">{event.category}</span>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
                <div className="flex flex-wrap gap-4 text-white/80">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{event.time} • {event.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{event.venue}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-elevation-1 p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">About the Event</h2>
              <p className="text-theater-muted mb-6">
                {event.description}
              </p>

              <div className="border-t pt-6">
                <h3 className="text-xl font-bold mb-4">Cast & Creatives</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-theater-muted mb-2">Cast</h4>
                    <ul className="space-y-1">
                      {event.cast.map((cast, index) => (
                        <li key={index} className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-theater-primary" />
                          {cast}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-theater-muted mb-2">Director</h4>
                    <p className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-theater-primary" />
                      {event.director}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-elevation-1 p-6">
              <h2 className="text-2xl font-bold mb-4">Venue Information</h2>
              <div className="flex items-start gap-4">
                <MapPin className="h-5 w-5 text-theater-primary mt-1" />
                <div>
                  <h3 className="font-bold">{event.venue}</h3>
                  <p className="text-theater-muted">{event.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-elevation-1 p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Price & Tickets</h2>
              <div className="mb-4">
                <p className="text-sm text-theater-muted">Price range</p>
                <p className="text-xl font-bold text-theater-primary">
                  {formatCurrency(event.priceRange.min)} - {formatCurrency(event.priceRange.max)}
                </p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                  <span>Standard Seats</span>
                  <span className="font-medium">{formatCurrency(event.priceRange.min)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                  <span>Premium Seats</span>
                  <span className="font-medium">{formatCurrency(Math.floor((event.priceRange.min + event.priceRange.max) / 2))}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted/30 rounded-md">
                  <span>VIP Seats</span>
                  <span className="font-medium">{formatCurrency(event.priceRange.max)}</span>
                </div>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  className="bg-theater-primary w-full py-6 text-lg"
                  onClick={handleSelectSeats}
                >
                  Select Seats
                </Button>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={handleShareEvent}
                >
                  Share Event
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-theater-accent/20 rounded-lg">
                <h3 className="font-bold mb-2">Important Information</h3>
                <ul className="text-sm text-theater-muted space-y-2">
                  <li>• Doors open 30 minutes before showtime</li>
                  <li>• All sales are final, no refunds</li>
                  <li>• Children under 5 are not admitted</li>
                  <li>• Have questions? Contact support</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
