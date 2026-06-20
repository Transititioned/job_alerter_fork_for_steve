/**
 * RUN THIS ONCE: Wipes the Master Sheet IDs so the next scrape is "fresh".
 */
function forceResetMasterMemory() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const masterSheet = ss.getSheetByName(CONFIG.SHEET_MASTER);
  
  if (masterSheet && masterSheet.getLastRow() > 1) {
    // This clears everything from Row 2 down to Row 1000
    // This removes the "Ghost IDs" so the Deduper starts from zero.
    masterSheet.getRange("A2:H1000").clearContent();
    SpreadsheetApp.flush();
    Logger.log("🧹 Master Sheet Memory Wiped. Run your Scrape again now!");
  } else {
    Logger.log("⚠️ Master Sheet already empty or not found.");
  }
}