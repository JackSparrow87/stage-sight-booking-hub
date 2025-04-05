
import React from "react";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  price: string;
  category: string;
  imageUrl: string;
}

interface AdminEventListProps {
  events: Event[];
  isLoading: boolean;
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

const AdminEventList: React.FC<AdminEventListProps> = ({
  events,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <p className="text-center py-8">Loading events...</p>;
  }

  if (!events.length) {
    return <p className="text-center py-8">No events found</p>;
  }

  const confirmDelete = (event: Event) => {
    if (window.confirm(`Are you sure you want to delete "${event.title}"?`)) {
      onDelete(event.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">{event.title}</TableCell>
              <TableCell>{event.venue}</TableCell>
              <TableCell>{formatDate(event.date)} at {event.time}</TableCell>
              <TableCell>
                <span className="badge badge-accent">{event.category}</span>
              </TableCell>
              <TableCell>{event.price}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(event)}
                  className="text-theater-primary hover:text-theater-primary/80 hover:bg-theater-primary/10"
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => confirmDelete(event)}
                  className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                >
                  <Trash2 size={16} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminEventList;
