
import React from 'react';
import { Trash2, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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

interface BookingListProps {
  bookings: Booking[];
  isLoading: boolean;
  onDelete: (bookingId: string) => void;
  onRefresh: () => void;
}

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  isLoading,
  onDelete,
  onRefresh,
}) => {
  const [selectedPaymentProof, setSelectedPaymentProof] = React.useState<string | null>(null);

  if (isLoading) {
    return <p className="text-center py-8">Loading bookings...</p>;
  }

  if (!bookings.length) {
    return <p className="text-center py-8">No bookings found</p>;
  }

  const confirmDelete = (booking: Booking) => {
    if (window.confirm(`Are you sure you want to delete booking for "${booking.customer_name}"?`)) {
      onDelete(booking.id);
    }
  };

  const handleDownloadReport = () => {
    const headers = [
      'Customer Name', 
      'Email', 
      'Event', 
      'Date', 
      'Seats', 
      'Amount', 
      'Payment Reference', 
      'Booking Date'
    ];
    
    const rows = bookings.map(booking => [
      booking.customer_name,
      booking.customer_email,
      booking.show?.title || 'Unknown event',
      booking.show?.date ? new Date(booking.show.date).toLocaleDateString() : 'Unknown',
      booking.seats.toString(),
      `R${booking.total_amount.toFixed(2)}`,
      booking.payment_reference,
      new Date(booking.created_at).toLocaleDateString()
    ]);
    
    let csvContent = headers.join(',') + '\n' + 
      rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `bookings_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Bookings report downloaded successfully');
  };

  const viewPaymentProof = async (booking: Booking) => {
    if (booking.payment_proof_url) {
      setSelectedPaymentProof(booking.payment_proof_url);
    } else {
      toast.error('No payment proof available for this booking');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Booking Records</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            Refresh
          </Button>
          <Button 
            onClick={handleDownloadReport} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download size={16} />
            Download Report
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Ref</TableHead>
            <TableHead>Proof</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{booking.customer_name}</p>
                  <p className="text-sm text-theater-muted">{booking.customer_email}</p>
                </div>
              </TableCell>
              <TableCell>{booking.show?.title || 'Unknown event'}</TableCell>
              <TableCell>
                {booking.show?.date 
                  ? new Date(booking.show.date).toLocaleDateString() 
                  : 'Unknown'}
              </TableCell>
              <TableCell>{booking.seats}</TableCell>
              <TableCell>R{booking.total_amount.toFixed(2)}</TableCell>
              <TableCell className="max-w-[120px] truncate" title={booking.payment_reference}>
                {booking.payment_reference}
              </TableCell>
              <TableCell>
                {booking.payment_proof_url ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => viewPaymentProof(booking)}
                        className="text-theater-primary"
                      >
                        <Eye size={16} />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Payment Proof</DialogTitle>
                      </DialogHeader>
                      <div className="mt-4">
                        {selectedPaymentProof && (
                          <img 
                            src={selectedPaymentProof} 
                            alt="Payment proof" 
                            className="max-w-full h-auto rounded-md"
                          />
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <span className="text-theater-muted text-sm">None</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => confirmDelete(booking)}
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

export default BookingList;
