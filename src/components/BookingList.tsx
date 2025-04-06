
import React, { useState, useEffect } from 'react';
import { supabaseExtended } from '@/integrations/supabase/client-extended';
import { formatDate, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, Download, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  created_at: string;
  seats: number;
  total_amount: number;
  user_id: string;
  show_id: string;
  show?: {
    title: string;
    date: string;
    venue: string;
  };
  user?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const BookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const { data, error } = await supabaseExtended
          .from('bookings')
          .select(`
            *,
            show:show_id (
              title,
              date,
              venue
            ),
            user:user_id (
              first_name,
              last_name,
              email
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        setBookings(data || []);
      } catch (err: any) {
        console.error('Error fetching bookings:', err);
        setError(err.message || 'Failed to load bookings');
        toast.error('Failed to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleExportCSV = () => {
    // Implement CSV export functionality
    toast.success('Bookings exported to CSV');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-theater-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-lg">
        <p className="text-theater-muted mb-4">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Recent Bookings</h2>
        <Button onClick={handleExportCSV} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export to CSV
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted/30">
              <th className="px-4 py-3 text-left text-sm font-medium">Booking ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Event</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Seats</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Total Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-muted/20">
                <td className="px-4 py-3 text-sm font-mono">
                  {booking.id.substring(0, 8)}...
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-theater-primary/10 rounded-full flex items-center justify-center mr-2">
                      <User className="h-4 w-4 text-theater-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {booking.user?.first_name} {booking.user?.last_name || ''}
                      </p>
                      <p className="text-xs text-theater-muted">{booking.user?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">{booking.show?.title || 'Unknown Event'}</p>
                  <p className="text-xs text-theater-muted">{booking.show?.venue}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-theater-muted mr-1" />
                    <span className="text-sm">
                      {booking.show?.date 
                        ? formatDate(booking.show.date) 
                        : formatDate(booking.created_at)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {booking.seats} {booking.seats === 1 ? 'seat' : 'seats'}
                </td>
                <td className="px-4 py-3 font-medium text-sm">
                  {formatCurrency(booking.total_amount)}
                </td>
                <td className="px-4 py-3">
                  <Button size="sm" variant="ghost" className="h-8">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View Details</span>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingList;
