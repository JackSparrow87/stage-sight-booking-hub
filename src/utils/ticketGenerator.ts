
import jsPDF from 'jspdf';

interface TicketData {
  eventName: string;
  date: string;
  time: string;
  venue: string;
  seats: string[];
  confirmationNumber: string;
  customerName: string;
}

export const generateTicketPDF = (ticketData: TicketData): string => {
  const doc = new jsPDF();
  
  // Set up document
  doc.setFillColor(50, 120, 200);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('StageSight Ticket', 105, 15, { align: 'center' });
  
  // Reset colors for main content
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.text(ticketData.eventName, 105, 40, { align: 'center' });
  
  // Event details
  doc.setFontSize(12);
  doc.text(`Date: ${ticketData.date}`, 20, 60);
  doc.text(`Time: ${ticketData.time}`, 20, 70);
  doc.text(`Venue: ${ticketData.venue}`, 20, 80);
  doc.text(`Confirmation: ${ticketData.confirmationNumber}`, 20, 90);
  doc.text(`Name: ${ticketData.customerName}`, 20, 100);
  
  // Seats
  doc.text('Seats:', 20, 120);
  const seatString = ticketData.seats.join(', ');
  doc.text(seatString, 50, 120);
  
  // QR code placeholder (in a real app, we'd generate a real QR code)
  doc.rect(130, 60, 50, 50);
  doc.setFontSize(8);
  doc.text('QR Code', 155, 85, { align: 'center' });
  
  // Footer
  doc.setFillColor(240, 240, 240);
  doc.rect(0, 270, 210, 25, 'F');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('This ticket is valid only with proof of identification.', 105, 280, { align: 'center' });
  doc.text('© StageSight 2025', 105, 290, { align: 'center' });
  
  return doc.output('datauristring');
};
