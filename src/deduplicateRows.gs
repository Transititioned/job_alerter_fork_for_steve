/**
 * DEBUG VERSION: Use this to identify why rows are being skipped.
 */
function runDedupeAndScore() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sourceSheet = ss.getSheetByName(CONFIG.SHEET_IMPORT);
  const masterSheet = ss.getSheetByName(CONFIG.SHEET_MASTER);

  if (!sourceSheet || sourceSheet.getLastRow() < 2) {
    Logger.log("⚠️ Source sheet empty or missing.");
    return [];
  }

  const data = sourceSheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).toLowerCase().trim());
  
  // 1. DEBUG HEADERS
  Logger.log(`📌 Detected Headers: ${JSON.stringify(headers)}`);

  const titleIdx = headers.indexOf("title");
  const incIdx = headers.indexOf("included"); 
  const idIdx = headers.indexOf("id");
  
  const orgIdx = headers.findIndex(h => h.includes("company") || h.includes("advertiser/name"));
  const freshIdx = headers.findIndex(h => h.includes("listed") || h.includes("atutc"));
  const linkIdx = headers.findIndex(h => h.includes("link") || h.includes("url"));

  // 2. GET EXISTING IDs
  let existingIds = [];
  if (masterSheet.getLastRow() > 1) {
    existingIds = masterSheet.getRange(2, 8, masterSheet.getLastRow() - 1, 1)
      .getValues()
      .flat()
      .map(id => String(id).trim())
      .filter(id => id !== ""); 
  }
  
  Logger.log(`🔎 Found ${existingIds.length} REAL IDs in Master.`);

  const newEntries = [];

  // 3. PROCESS ROWS WITH VERBOSE LOGGING
  data.slice(1).forEach((row, index) => {
    const rawId = idIdx !== -1 ? row[idIdx] : "MISSING";
    const jobId = String(rawId).trim();
    
    // Check Included status
    let isIncluded = true;
    let debugInc = "N/A (No Column)";
    if (incIdx !== -1) {
      debugInc = row[incIdx];
      const val = String(row[incIdx]).trim().toLowerCase();
      isIncluded = (val === "true" || val === "yes" || val === "1" || val === "checked" || val === ""); 
    }

    const alreadyExists = (jobId && existingIds.includes(jobId));

    // THE BRAIN: Log why it might be failing
    if (!isIncluded) {
      Logger.log(`❌ Row ${index + 2} SKIPPED: 'Included' is false/empty (Value: ${debugInc})`);
    } else if (!jobId || jobId === "MISSING") {
      Logger.log(`❌ Row ${index + 2} SKIPPED: No Job ID found (Check Column Index)`);
    } else if (alreadyExists) {
      Logger.log(`ℹ️ Row ${index + 2} SKIPPED: ID ${jobId} already in Master.`);
    } else {
      Logger.log(`✅ Row ${index + 2} PASSED: Adding ID ${jobId}`);
      
      const rawTitle = titleIdx !== -1 ? String(row[titleIdx]) : "Unknown Title";
      const meta = getJobMetadata(rawTitle); 
      
      newEntries.push([
        meta.score || 20, 
        meta.priority || 3, 
        meta.resume || "Steve Brown - Base Resume.docx",
        rawTitle.split('|')[0].trim(), 
        orgIdx !== -1 ? row[orgIdx] : "N/A", 
        freshIdx !== -1 ? row[freshIdx] : "New", 
        linkIdx !== -1 ? row[linkIdx] : "", 
        jobId
      ]);
    }
  });

  // 4. COMMIT
  if (newEntries.length > 0) {
    masterSheet.getRange(masterSheet.getLastRow() + 1, 1, newEntries.length, 8).setValues(newEntries);
    SpreadsheetApp.flush(); 
    Logger.log(`✅ Success: Added ${newEntries.length} new jobs.`);
  } else {
    Logger.log("ℹ️ Deduper: No new unique jobs to add.");
  }

  return newEntries; 
}
