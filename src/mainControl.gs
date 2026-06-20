function mainControl_TEST() {
  const jobFiles = CONFIG.JOB_FILES || [
    { name: CONFIG.SOURCE_FILE_NAME, type: 'STEVE_FINANCIAL_CRIME' }
  ];

  jobFiles.forEach(project => {
    try {
      Logger.log(`=== PROCESSING STEVE FEED: ${project.name} ===`); 

      cleanUpOldBatches(2); 

      // 1. IMPORT
      const imported = importCSV(project.name, CONFIG.SHEET_IMPORT); 
      if (!imported) {
        Logger.log(`Skipping ${project.name}: no fresh import available.`);
        return;
      }
      SpreadsheetApp.flush();

      // 2. STEVE-SPECIFIC FILTERING
      applySteveJobsFilter();
      
      // 3. DEDUPE & SAVE
      const freshEntries = runDedupeAndScore(); 

      // 4. NOTIFY
      if (freshEntries && freshEntries.length > 0) {
        notify_for_New_Jobs(freshEntries); 
      }

    } catch (error) {
      Logger.log(`❌ ERROR in ${project.name}: ${error.message}`);
    }
  });
}
