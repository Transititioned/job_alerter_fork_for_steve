/**
 * Deletes old batch report sheets to prevent spreadsheet clutter.
 * Keeps only the most recent X number of batches.
 */
function cleanUpOldBatches(keepCount = 3) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  // Filter for batch sheets and sort them by name (date) descending
  const batchSheets = sheets
    .filter(s => s.getName().startsWith("Batch_"))
    .sort((a, b) => b.getName().localeCompare(a.getName()));

  // Delete everything beyond the keepCount
  if (batchSheets.length > keepCount) {
    for (let i = keepCount; i < batchSheets.length; i++) {
      ss.deleteSheet(batchSheets[i]);
    }
    Logger.log(`🧹 Janitor: Deleted ${batchSheets.length - keepCount} old batch sheets.`);
  }
}