// Excel utilities for admin functionality

export const downloadExcelTemplate = () => {
  // Create CSV content for the template
  const csvContent = `College Name,Location,Course Type,Fees (₹),Ranking,Description
IIT Bombay,Mumbai Maharashtra,Engineering,200000,1,Top engineering institute in India
AIIMS Delhi,Delhi,Medical,150000,2,Premier medical institute
IIT Delhi,Delhi,Engineering,180000,3,Excellence in technical education
BITS Pilani,Pilani Rajasthan,Engineering,250000,4,Private engineering excellence
JNU Delhi,Delhi,Arts,80000,5,Leading arts and humanities university`;

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'college_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        const data = lines.slice(1).map(line => {
          const values = line.split(',');
          const row: any = {};
          headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
          });
          return row;
        }).filter(row => row['College Name']); // Filter out empty rows
        
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse Excel file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};
