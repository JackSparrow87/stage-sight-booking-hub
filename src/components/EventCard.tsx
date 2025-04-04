
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  imageUrl: string;
  price: string;
  category: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  venue,
  date,
  time,
  imageUrl,
  price,
  category,
}) => {
  return (
    <div className="card-event group hover:african-border transition-all duration-300">
      <div className="relative overflow-hidden aspect-[3/2]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="badge badge-accent">{category}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-lora font-bold text-lg truncate">{title}</h3>
        <p className="text-theater-muted text-sm mb-3 flex items-center">
          <MapPin className="h-3 w-3 mr-1" /> {venue}
        </p>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-1 text-theater-primary" />
            <span>{formatDate(date)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-theater-primary" />
            <span>{time}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs text-theater-muted">Starting from</span>
            <p className="font-bold text-theater-primary">{price}</p>
          </div>
          <Link to={`/events/${id}`}>
            <Button className="rounded-full bg-theater-primary hover:bg-theater-secondary">Book</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
