
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import { events } from '@/lib/utils';

const Index = () => {
  // Get featured events
  const featuredEvents = events.filter(event => event.featured);

  return (
    <div>
      {/* Hero section */}
      <section className="relative h-[80vh] bg-theater-dark flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1493962853295-0fd70327578a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
            alt="South African Landscape"
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="container-custom relative z-10">
          <div className="max-w-2xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Experience the Magic of Live Theater
            </h1>
            <p className="text-lg text-gray-300 mb-8">
              Book your tickets to the most captivating performances in town and immerse yourself in the world of arts and entertainment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button className="bg-theater-primary hover:bg-theater-primary/90 text-white px-8 py-6 text-lg">
                  Explore Events
                </Button>
              </Link>
              <Button className="bg-white hover:bg-gray-100 text-theater-dark px-8 py-6 text-lg flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Performances
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold">Featured Events</h2>
              <p className="text-theater-muted">Discover our handpicked selection of must-see performances</p>
            </div>
            <Link to="/events">
              <Button variant="outline" className="btn-outline">
                View All
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                venue={event.venue}
                date={event.date}
                time={event.time}
                imageUrl={event.imageUrl}
                price={event.price}
                category={event.category}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Performances section */}
      <section className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Upcoming Performances</h2>
            <p className="text-theater-muted max-w-2xl mx-auto">
              Don't miss these limited-time performances. Book early to secure the best seats.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.slice(0, 4).map((event, index) => (
              <div key={event.id} className="bg-white rounded-xl shadow-elevation-1 overflow-hidden flex flex-col sm:flex-row">
                <div className="sm:w-1/3 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="sm:w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <span className="badge badge-accent mb-2">{event.category}</span>
                    <h3 className="font-bold text-lg mb-1">{event.title}</h3>
                    <p className="text-theater-muted text-sm mb-2">{event.venue}</p>
                  </div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{event.date} · {event.time}</span>
                    </div>
                    <Link to={`/events/${event.id}`}>
                      <Button className="bg-theater-primary">Book Now</Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/events">
              <Button className="bg-theater-primary px-8">
                See All Performances
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose StageSight</h2>
            <p className="text-theater-muted max-w-2xl mx-auto">
              We are committed to providing the best booking experience for theater enthusiasts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-elevation-1 text-center">
              <div className="w-16 h-16 bg-theater-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-theater-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Booking</h3>
              <p className="text-theater-muted">
                Book with confidence knowing your transaction is secure and your tickets are guaranteed.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-elevation-1 text-center">
              <div className="w-16 h-16 bg-theater-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-theater-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Best Seat Selection</h3>
              <p className="text-theater-muted">
                Interactive seating charts allow you to choose the perfect spot for your experience.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-elevation-1 text-center">
              <div className="w-16 h-16 bg-theater-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-theater-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">No Hidden Fees</h3>
              <p className="text-theater-muted">
                Transparent pricing ensures you know exactly what you're paying for your tickets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
