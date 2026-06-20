function nuclearResetMaster() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let masterSheet = ss.getSheetByName(CONFIG.SHEET_MASTER);
  
  if (masterSheet) {
    // 1. Completely wipe the slate
    masterSheet.clear(); 
    masterSheet.clearFormats();

    // 2. Add extra rows so we have space to freeze the header
    if (masterSheet.getMaxRows() < 10) {
      masterSheet.insertRowsAfter(1, 10);
    }
    
    // 3. Reset Headers
    const masterHeaders = ["Score", "Priority", "Suggested_Resume", "Title", "Company", "Listed", "Link", "Job_ID"];
    masterSheet.getRange(1, 1, 1, masterHeaders.length).setValues([masterHeaders]);
    
    // 4. Now we can freeze safely
    masterSheet.setFrozenRows(1);
    
    SpreadsheetApp.flush();
    Logger.log("✅ Master Sheet cache cleared. Ready for fresh import.");
  }
}