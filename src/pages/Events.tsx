
import React, { useState, useEffect } from 'react';
import { Search, Calendar, FilterX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    throw error;
  }
  
  return data.map(show => ({
    id: show.id,
    title: show.title,
    venue: show.venue || '',
    date: new Date(show.date).toISOString().split('T')[0],
    time: new Date(show.date).toTimeString().slice(0, 5),
    price: show.price.toString(),
    category: show.category || '',
    imageUrl: show.image_url
  }));
};

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('public:shows')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'shows' }, 
        () => {
          // Refetch data when there's a change
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const categories = [...new Set(events.map(event => event.category).filter(Boolean))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (event.venue && event.venue.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        {/* Hero Banner */}
        <div className="bg-theater-primary rounded-xl p-8 mb-10">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white mb-3">Explore Events</h1>
            <p className="text-white/90 mb-6">
              Discover and book tickets to the most exciting performances in your area
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search for events, venues, or performances..."
                className="pl-10 py-6 bg-white text-theater-dark w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">All Events</h2>
            <p className="text-theater-muted">
              {isLoading ? 'Loading events...' : 
                `${filteredEvents.length} ${filteredEvents.length === 1 ? 'event' : 'events'} found`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className={selectedCategory === category ? "bg-theater-primary" : ""}
                onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
              >
                {category}
              </Button>
            ))}
            
            {(searchTerm || selectedCategory) && (
              <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-1">
                <FilterX className="h-4 w-4" /> Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="text-center py-12">Loading events...</div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
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
        ) : (
          <div className="text-center py-12">
            <div className="bg-muted/30 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-theater-muted" />
            </div>
            <h3 className="text-xl font-medium mb-2">No events found</h3>
            <p className="text-theater-muted mb-4">
              We couldn't find any events matching your search criteria.
            </p>
            <Button onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
