// CSV utilities for admin functionality

// Helper function to parse CSV line properly handling quoted fields
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
};

export const downloadCsvTemplate = () => {
  // Create CSV content for the template with only headers
  // * indicates mandatory fields
  const csvContent = `College Name*,State*,City*,Pincode*,Landmark,Fees (₹)*,Ranking*,Courses Offered*,Placement Ratio*,Year of Establish*,Affiliation*,Accreditation*,Is Partnered,Avg Package (₹),Median Package (₹),Highest Package (₹),Placement Rate (%),Top Recruiters`;

  // Create blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "college_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const parseCsvFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = parseCSVLine(lines[0]);
        const data = lines
          .slice(1)
          .map((line) => {
            // Parse CSV line properly handling quoted fields with commas
            const values = parseCSVLine(line);
            console.log("Parsed line values:", values);
            const row: any = {};
            headers.forEach((header, index) => {
              let value = values[index]?.trim() || "";

              // Handle quoted values (for arrays and strings with commas)
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }

              // Clean up any extra quotes or escape characters
              value = value.replace(/""/g, '"').replace(/\\"/g, '"');

              // Convert specific fields to appropriate types
              // Remove asterisk from header name for processing
              const headerName = header.trim().replace(/\*$/, "");
              switch (headerName) {
                case "Fees (₹)":
                case "Avg Package (₹)":
                case "Median Package (₹)":
                case "Highest Package (₹)":
                  row[headerName] = parseFloat(value) || 0;
                  break;
                case "Ranking":
                case "Year of Establish":
                case "Pincode":
                  row[headerName] = parseInt(value) || 0;
                  break;
                case "Placement Ratio":
                case "Placement Ratio (%)":
                case "Placement Rate (%)":
                  row[headerName] = parseFloat(value) || 0;
                  break;
                case "Is Partnered":
                  row[headerName] =
                    value.toLowerCase() === "true" ||
                    value.toLowerCase() === "yes";
                  break;
                case "Courses Offered":
                case "Top Recruiters":
                  // Split by comma and clean up
                  row[headerName] = value
                    ? value.split(",").map((item) => item.trim())
                    : [];
                  break;
                default:
                  row[headerName] = value;
              }
            });
            return row;
          })
          .filter((row) => row["College Name"]); // Filter out empty rows

        resolve(data);
      } catch (error) {
        reject(new Error("Failed to parse CSV file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
