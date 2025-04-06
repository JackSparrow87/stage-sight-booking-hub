import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminEventList from "@/components/AdminEventList";
import AdminEventForm from "@/components/AdminEventForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { supabaseExtended } from "@/integrations/supabase/client-extended";
import {
  TabsContent,
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { createCsv } from "@/utils/reportUtils";

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

const fetchUserLogs = async () => {
  const { data, error } = await supabaseExtended
    .from('user_logs')
    .select(`
      *,
      profiles:user_id (email:username)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data;
};

const fetchBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      profiles:user_id (email:username),
      shows:show_id (title, date, price)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }
  
  return data;
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
    isLoading: isLoadingEvents 
  } = useQuery({
    queryKey: ["admin-events"],
    queryFn: fetchEvents
  });

  // Fetch user logs
  const { 
    data: userLogs = [], 
    isLoading: isLoadingLogs 
  } = useQuery({
    queryKey: ["admin-user-logs"],
    queryFn: fetchUserLogs
  });

  // Fetch bookings
  const { 
    data: bookings = [], 
    isLoading: isLoadingBookings 
  } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchBookings
  });

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

  // Delete mutation
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
    // This would be an API call in a real application
    if (window.confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(eventId);
    }
  };

  // Handle report downloads
  const downloadUserLogsReport = () => {
    const data = userLogs.map((log: any) => ({
      user: log.profiles?.email || log.user_id,
      action: log.action,
      timestamp: new Date(log.created_at).toLocaleString(),
      details: JSON.stringify(log.metadata)
    }));
    
    createCsv(data, 'user-activity-logs.csv');
    toast.success('User logs report downloaded');
  };

  const downloadBookingsReport = () => {
    const data = bookings.map((booking: any) => ({
      user: booking.profiles?.email || booking.user_id,
      event: booking.shows?.title || 'Unknown Event',
      date: booking.shows?.date ? new Date(booking.shows.date).toLocaleString() : 'Unknown',
      seats: booking.seats,
      amount: `R${booking.total_amount}`,
      timestamp: new Date(booking.created_at).toLocaleString()
    }));
    
    createCsv(data, 'bookings-report.csv');
    toast.success('Bookings report downloaded');
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="events" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="user-logs">User Logs</TabsTrigger>
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
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Booking Records</h2>
            <Button 
              onClick={downloadBookingsReport} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download Report
            </Button>
          </div>
          
          {isLoadingBookings ? (
            <p>Loading booking records...</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Event</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Seats</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking: any) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{booking.profiles?.email || 'Unknown'}</td>
                        <td className="px-4 py-2">{booking.shows?.title || 'Unknown'}</td>
                        <td className="px-4 py-2">
                          {booking.shows?.date ? new Date(booking.shows.date).toLocaleDateString() : 'Unknown'}
                        </td>
                        <td className="px-4 py-2">{booking.seats}</td>
                        <td className="px-4 py-2">R{booking.total_amount}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-2 text-center">No bookings found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="user-logs">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">User Activity Logs</h2>
            <Button 
              onClick={downloadUserLogsReport} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download Report
            </Button>
          </div>
          
          {isLoadingLogs ? (
            <p>Loading user logs...</p>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Action</th>
                    <th className="px-4 py-2 text-left">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {userLogs.length > 0 ? (
                    userLogs.map((log: any) => (
                      <tr key={log.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{log.profiles?.email || log.user_id}</td>
                        <td className="px-4 py-2">{log.action}</td>
                        <td className="px-4 py-2">{new Date(log.created_at).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-2 text-center">No user logs found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
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
