
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
  }).format(amount);
}

// Mock data for the theatre booking system
export const events = [
  {
    id: '1',
    title: 'Hamlet',
    description: 'William Shakespeare\'s tragedy Hamlet, Prince of Denmark is a tale of revenge, contemplation, and madness. The play explores themes of betrayal, revenge, incest, and moral corruption.',
    venue: 'Royal Theatre',
    address: '123 Main St, New York, NY',
    date: '2025-04-15',
    time: '19:30',
    duration: '2h 45m',
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
    price: 'R750.00',
    priceRange: { min: 750, max: 2000 },
    category: 'Drama',
    featured: true,
    cast: ['John Doe', 'Jane Smith', 'Robert Johnson'],
    director: 'Sarah Williams',
  },
  {
    id: '2',
    title: 'The Phantom of the Opera',
    description: 'The Phantom of the Opera is a musical with music by Andrew Lloyd Webber and lyrics by Charles Hart. It tells the story of a disfigured musical genius who haunts the Paris Opera House.',
    venue: 'Grand Opera House',
    address: '456 Broadway, New York, NY',
    date: '2025-04-18',
    time: '20:00',
    duration: '2h 30m',
    imageUrl: 'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    price: 'R1000.00',
    priceRange: { min: 1000, max: 2500 },
    category: 'Musical',
    featured: true,
    cast: ['Michael Brown', 'Jessica Taylor', 'David Wilson'],
    director: 'Thomas Anderson',
  },
  {
    id: '3',
    title: 'Swan Lake',
    description: 'Swan Lake is a ballet composed by Pyotr Ilyich Tchaikovsky. It tells the story of Odette, a princess turned into a swan by an evil sorcerer\'s curse.',
    venue: 'City Ballet Center',
    address: '789 Park Ave, New York, NY',
    date: '2025-04-20',
    time: '19:00',
    duration: '3h',
    imageUrl: 'https://images.unsplash.com/photo-1545167622-3a6ac756afa4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1824&q=80',
    price: 'R900.00',
    priceRange: { min: 900, max: 2200 },
    category: 'Ballet',
    featured: false,
    cast: ['Emma Clark', 'Peter Johnson', 'Sophia Martinez'],
    director: 'Natalia Petrova',
  },
  {
    id: '4',
    title: 'The Lion King',
    description: 'The Lion King is a musical based on the 1994 Disney animated feature film. It follows the adventures of the young lion Simba, who is to succeed his father, Mufasa, as King of the Pride Lands.',
    venue: 'Broadway Theater',
    address: '123 Broadway, New York, NY',
    date: '2025-04-25',
    time: '19:30',
    duration: '2h 30m',
    imageUrl: 'https://images.unsplash.com/photo-1577372970039-2cf8d9be0ec9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    price: 'R1250.00',
    priceRange: { min: 1250, max: 3000 },
    category: 'Musical',
    featured: true,
    cast: ['James Wilson', 'Linda Martinez', 'Carlos Rodriguez'],
    director: 'Julie Richards',
  },
  {
    id: '5',
    title: 'Romeo and Juliet',
    description: 'Romeo and Juliet is a tragedy written by William Shakespeare early in his career about two young star-crossed lovers whose deaths ultimately reconcile their feuding families.',
    venue: 'Shakespeare Theater',
    address: '456 Central Park, New York, NY',
    date: '2025-05-02',
    time: '20:00',
    duration: '2h 15m',
    imageUrl: 'https://images.unsplash.com/photo-1618886470010-800d999bc25c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    price: 'R850.00',
    priceRange: { min: 850, max: 2100 },
    category: 'Drama',
    featured: false,
    cast: ['Ryan Johnson', 'Emily Brown', 'Matthew Davis'],
    director: 'William Thompson',
  },
  {
    id: '6',
    title: 'Wicked',
    description: 'Wicked is a musical with music and lyrics by Stephen Schwartz. It tells the story of an unlikely friendship between two witches: Elphaba, the Wicked Witch of the West, and Glinda, the Good Witch of the North.',
    venue: 'Magic Theater',
    address: '789 Fifth Ave, New York, NY',
    date: '2025-05-05',
    time: '19:00',
    duration: '2h 45m',
    imageUrl: 'https://images.unsplash.com/photo-1511715282680-fbf93a50e721?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    price: 'R1100.00',
    priceRange: { min: 1100, max: 2700 },
    category: 'Musical',
    featured: true,
    cast: ['Sarah Adams', 'Rachel Green', 'Daniel White'],
    director: 'Jennifer Moore',
  }
];

// Generate a theater seating layout
export function generateTheaterSeating(rows: number, seatsPerRow: number, reservedSeats: string[] = []) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const seating = [];
  
  for (let i = 0; i < rows; i++) {
    const row = [];
    const rowLabel = alphabet[i];
    
    for (let j = 1; j <= seatsPerRow; j++) {
      const seatId = `${rowLabel}${j}`;
      const isReserved = reservedSeats.includes(seatId);
      // Randomly assign some seats as VIP
      const isVip = (i >= 2 && i <= 4) && (j >= 3 && j <= seatsPerRow - 2);
      
      row.push({
        id: seatId,
        row: rowLabel,
        number: j,
        status: isReserved ? 'reserved' : 'available',
        type: isVip ? 'vip' : 'standard',
        price: isVip ? 1600 : 1100,
      });
    }
    
    seating.push(row);
  }
  
  return seating;
}
