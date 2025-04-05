
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Cart = () => {
  // In a real app, this would be connected to a state management system
  const cartItems = []; // Empty for now, would be populated from state/context
  
  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      
      {cartItems.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow-elevation-1 overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Cart item details would go here */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center mt-8">
            <div>
              <p className="text-lg">Total: <span className="font-bold">$0.00</span></p>
            </div>
            <Button className="bg-theater-primary">Proceed to Checkout</Button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-elevation-1">
          <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any tickets to your cart yet.</p>
          <Link to="/events">
            <Button className="bg-theater-primary">Browse Events</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
