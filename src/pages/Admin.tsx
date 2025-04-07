
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminEventList from "@/components/AdminEventList";
import AdminEventForm from "@/components/AdminEventForm";
import BookingList from "@/components/BookingList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  TabsContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Define the Event type to match what's in the AdminEventForm/AdminEventList components
interface Event {
  id: string;
  title: string;
  venue: string;
  date: string;
  time: string;
  price: string;
  category: string;
  imageUrl: string;
  description: string;
}

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_birthdate: string;
  show_id: string;
  seats: number;
  total_amount: number;
  created_at: string;
  payment_reference: string;
  payment_proof_url?: string;
  show: {
    title: string;
    date: string;
  };
}

// API functions connected to Supabase
const fetchEvents = async () => {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    throw error;
  }
  
  // Transform the data to match our Event interface
  return data.map(show => ({
    id: show.id,
    title: show.title,
    venue: show.venue || '',
    date: new Date(show.date).toISOString().split('T')[0], // Get date part
    time: new Date(show.date).toTimeString().slice(0, 5), // Get time part
    price: show.price.toString(),
    category: show.category || '',
    imageUrl: show.image_url,
    description: show.description
  }));
};

const fetchBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      show:show_id (
        title, 
        date
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data as Booking[];
};

const Admin = () => {
  const { user, isAdmin, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const queryClient = useQueryClient();

  // If not logged in or not an admin, redirect to auth
  if (isLoading) {
    return <div className="container-custom py-8">Loading...</div>;
  }
  
  if (!user || !isAdmin) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch events data
  const { 
    data: events = [], 
    isLoading: isLoadingEvents,
    refetch: refetchEvents 
  } = useQuery({
    queryKey: ["admin-events"],
    queryFn: fetchEvents
  });

  // Fetch bookings
  const { 
    data: bookings = [], 
    isLoading: isLoadingBookings,
    refetch: refetchBookings
  } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchBookings
  });

  // Set up real-time subscriptions
  useEffect(() => {
    // Subscribe to changes in the shows table
    const showsChannel = supabase
      .channel('public:shows')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'shows' }, 
        () => {
          refetchEvents();
        }
      )
      .subscribe();

    // Subscribe to changes in the bookings table
    const bookingsChannel = supabase
      .channel('public:bookings')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' }, 
        () => {
          refetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(showsChannel);
      supabase.removeChannel(bookingsChannel);
    };
  }, [refetchEvents, refetchBookings]);

  // Create mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: Event) => {
      // Combine date and time into a single ISO string
      const dateTime = new Date(`${eventData.date}T${eventData.time}`);
      
      const { error } = await supabase
        .from('shows')
        .insert([{
          title: eventData.title,
          description: eventData.description,
          venue: eventData.venue,
          date: dateTime.toISOString(),
          image_url: eventData.imageUrl || '/placeholder.svg',
          price: parseFloat(eventData.price.replace(/[^0-9.]/g, '')),
          available_seats: 100, // Default value
          category: eventData.category
        }]);

      if (error) throw error;
      return eventData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event added successfully");
      setIsAddingEvent(false);
    },
    onError: (error: any) => {
      toast.error(`Error adding event: ${error.message}`);
    }
  });

  // Update mutation
  const updateEventMutation = useMutation({
    mutationFn: async (eventData: Event) => {
      // Combine date and time into a single ISO string
      const dateTime = new Date(`${eventData.date}T${eventData.time}`);
      
      const { error } = await supabase
        .from('shows')
        .update({
          title: eventData.title,
          description: eventData.description,
          venue: eventData.venue,
          date: dateTime.toISOString(),
          image_url: eventData.imageUrl,
          price: parseFloat(eventData.price.replace(/[^0-9.]/g, '')),
          category: eventData.category
        })
        .eq('id', eventData.id);

      if (error) throw error;
      return eventData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event updated successfully");
      setEditingEvent(null);
    },
    onError: (error: any) => {
      toast.error(`Error updating event: ${error.message}`);
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('shows')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
      return eventId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      toast.success("Event deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Error deleting event: ${error.message}`);
    }
  });

  // Delete booking mutation
  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;
      return bookingId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast.success("Booking deleted successfully");
    },
    onError: (error: any) => {
      toast.error(`Error deleting booking: ${error.message}`);
    }
  });

  // Filter events based on search term
  const filteredEvents = events.filter((event: any) =>
    event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEvent = (eventData: any) => {
    createEventMutation.mutate(eventData);
  };

  const handleUpdateEvent = (eventData: any) => {
    updateEventMutation.mutate(eventData);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };

  const handleDeleteBooking = (bookingId: string) => {
    deleteBookingMutation.mutate(bookingId);
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="events" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          {/* Events Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-between">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={() => setIsAddingEvent(true)}
              className="bg-theater-primary"
            >
              <PlusCircle className="mr-2" size={18} />
              Add New Event
            </Button>
          </div>

          {/* Event List */}
          <AdminEventList
            events={filteredEvents}
            isLoading={isLoadingEvents}
            onEdit={setEditingEvent}
            onDelete={handleDeleteEvent}
          />
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingList
            bookings={bookings}
            isLoading={isLoadingBookings}
            onDelete={handleDeleteBooking}
            onRefresh={refetchBookings}
          />
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal Form */}
      {(isAddingEvent || editingEvent) && (
        <AdminEventForm
          event={editingEvent}
          onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
          onCancel={() => {
            setIsAddingEvent(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default Admin;
