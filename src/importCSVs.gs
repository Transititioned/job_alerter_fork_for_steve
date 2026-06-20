function importCSV(fileName, targetSheetName) {
  // 1. Find ONLY the files matching the current filename
  const files = DriveApp.searchFiles(`title = '${fileName}' and trashed = false`);
  const fileList = [];
  
  while (files.hasNext()) {
    fileList.push(files.next());
  }

  if (fileList.length === 0) {
    Logger.log(`⚠️ No files found named "${fileName}"`);
    return false;
  }

  // 2. SORT: Newest to Oldest so we pick the freshest data
  fileList.sort((a, b) => b.getLastUpdated().getTime() - a.getLastUpdated().getTime());
  
  const newestFile = fileList[0];
  Logger.log(`📂 PROJECT MATCH: ${fileName}`);
  Logger.log(`📂 DATA FRESHNESS: ${newestFile.getLastUpdated()}`);

  // 3. IMPORT to the landing tab
  const csvData = Utilities.parseCsv(newestFile.getBlob().getDataAsString());
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(targetSheetName);

  if (!sheet) {
    sheet = ss.insertSheet(targetSheetName);
    Logger.log(`✅ Created missing staging sheet: ${targetSheetName}`);
  }
  
  sheet.clearContents();
  if (csvData.length > 0) {
    sheet.getRange(1, 1, csvData.length, csvData[0].length).setValues(csvData);
    Logger.log(`✅ Success: Imported ${csvData.length} rows from ${fileName}.`);
  } else {
    Logger.log(`⚠️ File "${fileName}" did not contain CSV rows.`);
    return false;
  }

  // 4. CLEANUP: Only trash older versions of THIS specific file
  if (fileList.length > 1) {
    for (let i = 1; i < fileList.length; i++) {
      fileList[i].setTrashed(true);
      Logger.log(`🗑️ Trashed old version of ${fileName} from ${fileList[i].getLastUpdated()}`);
    }
  }

  return true;
}
