// THE REPORT BUILDER
function buildJobReport(newRows) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // FIXED: Added _ss to ensure every batch has a unique name, even in the same minute
  const timestamp = Utilities.formatDate(new Date(), "GMT+11", "yyyyMMdd_HHmm_ss");
  const sheetName = "Batch_" + timestamp;
  
  const reportSheet = ss.insertSheet(sheetName);
  
  const headers = [["Score", "Priority", "Resume", "Job Title", "Company", "Listed", "Link"]];
  const reportRows = newRows.map(row => [row[0], row[1], row[2], row[3], row[4], row[5], row[6]]);

  // Write Data
  reportSheet.getRange(1, 1, 1, 7).setValues(headers).setFontWeight("bold").setBackground("#cfe2f3");
  reportSheet.getRange(2, 1, reportRows.length, 7).setValues(reportRows);
  
  // Formatting
  reportSheet.autoResizeColumns(1, 7);
  reportSheet.setColumnWidth(4, 350); 
  
  return { 
    link: ss.getUrl() + "#gid=" + reportSheet.getSheetId()
  };
}