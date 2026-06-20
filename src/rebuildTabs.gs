function forceRebuildTabs() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const requiredSheets = ['AI_JOBS', 'Jobs_MASTER'];
  
  requiredSheets.forEach(name => {
    let sheet = ss.getSheetByName(name);
    if (!sheet) {
      ss.insertSheet(name);
      Logger.log(`✅ Created missing sheet: ${name}`);
    } else {
      Logger.log(`ℹ️ Sheet ${name} already exists.`);
    }
  });

  // Optional: Set up the correct headers for Jobs_MASTER if it's new
  const master = ss.getSheetByName('Jobs_MASTER');
  if (master.getLastRow() === 0) {
    master.appendRow(['Advertiser', 'Job ID', 'Suggested_Resume', 'Title', 'Date Found', 'Priority']);
    master.getRange("1:1").setFontWeight("bold").setBackground("#f3f3f3");
  }
}