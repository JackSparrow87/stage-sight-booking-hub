
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AdminEventList from "@/components/AdminEventList";
import AdminEventForm from "@/components/AdminEventForm";

// Mock API functions (these would connect to your backend)
const fetchEvents = async () => {
  // In production, this would fetch from your actual API
  return [
    {
      id: "1",
      title: "Cape Town Jazz Festival",
      venue: "Cape Town International Convention Centre",
      date: "2025-06-15",
      time: "19:00",
      imageUrl: "/placeholder.svg",
      price: "R850.00",
      category: "Music",
      description: "The premier jazz festival in Africa featuring local and international artists."
    },
    {
      id: "2",
      title: "Soweto Wine Festival",
      venue: "Soweto Theatre",
      date: "2025-07-20",
      time: "14:00",
      imageUrl: "/placeholder.svg",
      price: "R450.00",
      category: "Lifestyle",
      description: "Experience the best South African wines in the heart of Soweto."
    },
    {
      id: "3",
      title: "Johannesburg Art Fair",
      venue: "Sandton Convention Centre",
      date: "2025-08-10",
      time: "10:00",
      imageUrl: "/placeholder.svg",
      price: "R350.00",
      category: "Art",
      description: "Africa's largest contemporary art fair showcasing works from across the continent."
    }
  ];
};

const Admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  // Fetch events data
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-events"],
    queryFn: fetchEvents
  });

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddEvent = (eventData) => {
    // This would be an API call in a real application
    console.log("Adding event:", eventData);
    toast.success("Event added successfully");
    setIsAddingEvent(false);
    refetch();
  };

  const handleUpdateEvent = (eventData) => {
    // This would be an API call in a real application
    console.log("Updating event:", eventData);
    toast.success("Event updated successfully");
    setEditingEvent(null);
    refetch();
  };

  const handleDeleteEvent = (eventId) => {
    // This would be an API call in a real application
    console.log("Deleting event:", eventId);
    toast.success("Event deleted successfully");
    refetch();
  };

  return (
    <div className="container-custom py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Controls */}
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
        isLoading={isLoading}
        onEdit={setEditingEvent}
        onDelete={handleDeleteEvent}
      />

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
