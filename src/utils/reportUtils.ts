
/**
 * Creates and downloads a CSV file from data
 */
export const createCsv = (data: any[], filename: string) => {
  if (!data || !data.length) {
    console.error('No data provided for CSV export');
    return;
  }

  // Get headers from the first item
  const headers = Object.keys(data[0]);
  
  // Create CSV content with headers
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      // Handle special characters and ensure proper CSV formatting
      const cell = item[header] === null || item[header] === undefined 
        ? '' 
        : String(item[header]);
      
      // Escape quotes and wrap in quotes if contains commas, quotes or newlines
      if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });
    csvContent += row.join(',') + '\n';
  });

  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
