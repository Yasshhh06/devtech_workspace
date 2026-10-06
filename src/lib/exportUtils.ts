/**
 * Export Utilities for Admin Portal
 * Downloads Reports in CSV / Excel (.csv format) and printable PDF format.
 */

// Helper to convert array of objects to CSV download
export function exportToCSV(filename: string, rows: Record<string, any>[], fallbackHeaders?: string[]) {
  let headers: string[] = [];

  if (rows && rows.length > 0) {
    headers = Object.keys(rows[0]);
  } else if (fallbackHeaders && fallbackHeaders.length > 0) {
    headers = fallbackHeaders;
  } else {
    headers = ["Status", "Message", "Timestamp"];
    rows = [
      {
        Status: "Info",
        Message: "No data records available to export at this time.",
        Timestamp: new Date().toLocaleString(),
      },
    ];
  }

  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => {
          const val = row[header] !== undefined && row[header] !== null ? String(row[header]) : "";
          const escaped = val.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Helper to print/save report as PDF via formatted print window
export function exportToPDF(title: string, headers: string[], rows: (string | number)[][]) {
  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const displayRows =
    rows && rows.length > 0
      ? rows
      : [[ "No records currently stored in system.", ...Array(headers.length - 1).fill("-") ]];

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title} Report - DevTech IT Solution</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 30px; color: #1e293b; }
          .header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #2563eb; padding-bottom: 12px; margin-bottom: 20px; }
          .title { font-size: 20px; font-weight: bold; color: #1e3a8a; }
          .subtitle { font-size: 11px; color: #64748b; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
          th { background-color: #2563eb; color: white; text-align: left; padding: 10px; font-size: 11px; text-transform: uppercase; }
          td { border-bottom: 1px solid #e2e8f0; padding: 10px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 30px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">${title} Report</div>
            <div class="subtitle">DevTech IT Solution Pvt Ltd • Generated on ${new Date().toLocaleString()}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              ${headers.map((h) => `<th>${h}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${displayRows
              .map(
                (row) => `
              <tr>
                ${row.map((cell) => `<td>${cell !== null && cell !== undefined ? cell : "-"}</td>`).join("")}
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
        <div class="footer">
          DevTech Workspace Official Document • Confidential Internal Record
        </div>
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
