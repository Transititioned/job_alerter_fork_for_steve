/**
 * Monitors "Apify Uploads". Processes any file found.
 * Use this to jump-start your pipeline.
 */
function newFileWatcher() {
  const FOLDER_NAME = 'Apify Uploads';
  const folders = DriveApp.getFoldersByName(FOLDER_NAME);
  
  if (!folders.hasNext()) {
    console.error("❌ Could not find folder: " + FOLDER_NAME);
    return;
  }
  
  const folder = folders.next();
  const files = folder.getFiles();
  const scriptProperties = PropertiesService.getScriptProperties();
  
  // Get stored time. If it doesn't exist, we default to 0 so we process everything.
  let lastProcessedTime = parseInt(scriptProperties.getProperty('lastProcessedTime')) || 0;
  
  console.log("🔍 Scanning for files newer than: " + new Date(lastProcessedTime).toLocaleString());
  
  let latestFileTime = lastProcessedTime;
  let foundNewFiles = false;

  while (files.hasNext()) {
    let file = files.next();
    let fileTime = file.getLastUpdated().getTime();

    // If file is newer than our last record, process it
    if (fileTime > lastProcessedTime) {
      console.log("🚀 NEW file detected: " + file.getName());
      
      console.log("🎬 Handing off to mainControl_TEST...");
      try {
        mainControl_TEST(); 
      } catch (err) {
        console.error("❌ Pipeline error: " + err.message);
      }
      
      foundNewFiles = true;
      if (fileTime > latestFileTime) {
        latestFileTime = fileTime;
      }
    }
  }

  if (!foundNewFiles) {
    console.log("✅ Scan complete. No new files found.");
  } else {
    scriptProperties.setProperty('lastProcessedTime', latestFileTime.toString());
    console.log("✅ Scan complete. Timestamp updated.");
  }
}