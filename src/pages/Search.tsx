
import React, { useState } from 'react';
import { Search as SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import { events } from '@/lib/utils';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(events);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      setSearchResults(events);
      return;
    }

    const filtered = events.filter(event => 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setSearchResults(filtered);
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Search Events</h1>
      
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <div className="relative flex-grow">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search for events, venues, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6"
            />
          </div>
          <Button type="submit" className="bg-theater-primary">Search</Button>
        </div>
      </form>

      <div className="mb-4">
        <p className="text-gray-600">{searchResults.length} results found</p>
      </div>
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((event) => (
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
          <p className="text-xl text-gray-500">No events found matching your search criteria.</p>
          <p className="text-gray-400 mt-2">Try using different keywords or browse all events.</p>
          <Button className="mt-4 bg-theater-primary" onClick={() => setSearchResults(events)}>
            View All Events
          </Button>
        </div>
      )}
    </div>
  );
};

export default Search;
