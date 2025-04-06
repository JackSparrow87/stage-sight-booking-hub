
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminEventList from '@/components/AdminEventList';
import BookingList from '@/components/BookingList';

const Admin = () => {
  return (
    <div className="container-custom py-10">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          <AdminEventList />
        </TabsContent>
        
        <TabsContent value="bookings">
          <BookingList />
        </TabsContent>
        
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-sm text-theater-muted mb-2">Total Sales</h3>
              <p className="text-3xl font-bold">R175,250</p>
              <p className="text-xs text-green-600 mt-2">+12% from last month</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-sm text-theater-muted mb-2">Total Bookings</h3>
              <p className="text-3xl font-bold">324</p>
              <p className="text-xs text-green-600 mt-2">+8% from last month</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-sm text-theater-muted mb-2">Upcoming Events</h3>
              <p className="text-3xl font-bold">12</p>
              <p className="text-xs text-theater-muted mt-2">Next 30 days</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold mb-4">Monthly Sales (2025)</h3>
            <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
              <p className="text-theater-muted">Sales chart will appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
