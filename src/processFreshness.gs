/**
 * Processes job listing dates for both PM and BA tabs.
 * Dynamically hunts for the date/freshness column by scanning values.
 */
function processFreshness() {
  Logger.log("Processing freshness across tabs...");

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetNames = ['PM', 'BA']; 

  sheetNames.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet || sheet.getLastRow() <= 1) {
      Logger.log(`Skipping freshness for ${name}: Sheet empty or not found.`);
      return;
    }

    const data = sheet.getDataRange().getValues();
    const headers = data[0].map(h => String(h).toLowerCase().trim());

    // 1. DYNAMIC HUNTING (Search for "ago" in the first 5 data rows)
    let dateColIdx = -1;
    for (let col = 0; col < data[0].length; col++) {
      // Check first few rows for the "ago" pattern or a valid Date object
      const sampleValue = String(data[1][col]).toLowerCase();
      if (sampleValue.includes('ago') || !isNaN(Date.parse(data[1][col]))) {
        dateColIdx = col;
        break;
      }
    }

    if (dateColIdx === -1) {
      Logger.log(`Warning: No freshness column found for ${name}. Using fuzzy header match.`);
      dateColIdx = headers.findIndex(h => h.includes('date') || h.includes('time') || h.includes('listed'));
    }

    if (dateColIdx === -1) return; // Exit if still not found

    // 2. SETUP OUTPUT COLUMN
    const FRESHNESS_HEADER = "Freshness_Final";
    let outputColIdx = headers.indexOf(FRESHNESS_HEADER.toLowerCase());
    if (outputColIdx === -1) {
      outputColIdx = data[0].length;
      sheet.getRange(1, outputColIdx + 1).setValue(FRESHNESS_HEADER);
    }

    // 3. CALCULATION
    const now = new Date();
    const results = data.slice(1).map(row => {
      const rawValue = row[dateColIdx];
      const timestamp = new Date(rawValue);
      
      if (!isNaN(timestamp.getTime())) {
        const diffHrs = Math.floor((now - timestamp) / (1000 * 60 * 60));
        return [diffHrs < 24 ? `${diffHrs}h ago` : `${Math.floor(diffHrs / 24)}d ago` || "Just now"];
      }
      // If it's already a string like "2h ago", keep it
      return [rawValue ? String(rawValue) : "Unknown"];
    });

    // 4. WRITE BACK
    sheet.getRange(2, outputColIdx + 1, results.length, 1).setValues(results);
    Logger.log(`Freshness complete for ${name}. Identified in column ${dateColIdx + 1}.`);
  });
}