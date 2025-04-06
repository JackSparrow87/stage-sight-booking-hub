
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BookingData {
  showId: string;
  userId: string;
  seats: number;
  totalAmount: number;
  customerInfo: {
    name: string;
    email: string;
    birthdate: string;
    paymentReference: string;
  };
}

export const saveBooking = async (bookingData: BookingData) => {
  try {
    const { error } = await supabase
      .from('bookings')
      .insert({
        show_id: bookingData.showId,
        user_id: bookingData.userId,
        seats: bookingData.seats,
        total_amount: bookingData.totalAmount
      });

    if (error) {
      console.error('Error saving booking:', error);
      toast.error('Failed to save booking information');
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error in saveBooking:', error);
    return false;
  }
};
