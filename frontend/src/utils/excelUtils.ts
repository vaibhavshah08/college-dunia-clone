// Excel utilities for admin functionality

export const downloadExcelTemplate = () => {
  // Create CSV content for the template with only headers
  const csvContent = `College Name,State,City,Pincode,Landmark,Fees (₹),Ranking,Courses Offered,Placement Ratio (%),Year of Establishment,Affiliation,Accreditation,Is Partnered,Avg Package (₹),Median Package (₹),Highest Package (₹),Placement Rate (%),Top Recruiters`;

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

export const parseExcelFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split("\n");
        const headers = lines[0].split(",");
        const data = lines
          .slice(1)
          .map((line) => {
            const values = line.split(",");
            const row: any = {};
            headers.forEach((header, index) => {
              let value = values[index]?.trim() || "";

              // Handle quoted values (for arrays and strings with commas)
              if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
              }

              // Convert specific fields to appropriate types
              const headerName = header.trim();
              switch (headerName) {
                case "Fees (₹)":
                case "Avg Package (₹)":
                case "Median Package (₹)":
                case "Highest Package (₹)":
                  row[headerName] = parseFloat(value) || 0;
                  break;
                case "Ranking":
                case "Year of Establishment":
                case "Pincode":
                  row[headerName] = parseInt(value) || 0;
                  break;
                case "Placement Ratio (%)":
                case "Placement Rate (%)":
                  row[headerName] = parseFloat(value) || 0;
                  break;
                case "Is Partnered":
                  row[headerName] = value.toLowerCase() === "true";
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
        reject(new Error("Failed to parse Excel file"));
      }
    };

    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
};
