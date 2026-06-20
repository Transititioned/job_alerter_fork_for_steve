function activateSpreadsheet() {
  const workbookName = "Seek_Job_Alerter_(data & AI)_WORKBOOK";
  const files = DriveApp.getFilesByName(workbookName);
  let ss = null;

  // 1. Look for an existing Google Sheet (not the CSV)
  while (files.hasNext()) {
    const f = files.next();
    if (f.getMimeType() === MimeType.GOOGLE_SHEETS) {
      ss = SpreadsheetApp.openById(f.getId());
      break;
    }
  }

  // 2. If no Google Sheet exists, CREATE one
  if (!ss) {
    ss = SpreadsheetApp.create(workbookName);
    Logger.log(`✨ Created brand new workbook: ${workbookName}`);
  }

  SpreadsheetApp.setActiveSpreadsheet(ss);

  // 3. Ensure the 'AI_JOBS' tab exists for your mainControl test
  if (!ss.getSheetByName('AI_JOBS')) {
    ss.insertSheet('AI_JOBS');
    Logger.log("Created 'AI_JOBS' tab.");
  }

  return ss;
}