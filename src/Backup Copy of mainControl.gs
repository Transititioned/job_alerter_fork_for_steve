function backup_of_mainControl_TEST() {
  const jobFiles = [
    { name: 'AI_jobs.csv', type: 'AI' },
    { name: 'PM_jobs.csv', type: 'PM' },
    { name: 'GRC_jobs.csv', type: 'GRC' } // 🚀 Added GRC file
  ];

  jobFiles.forEach(project => {
    try {
      Logger.log(`=== 🚀 PROCESSING: ${project.name} ===`); 

      cleanUpOldBatches(2); 

      // 1. IMPORT
      importCSV(project.name, 'AI_JOBS'); 
      SpreadsheetApp.flush();

      // 2. LOGIC BRANCHING
      if (project.type === 'AI') {
        applyAiJobsFilter(); 
      } else if (project.type === 'GRC') {
        applyGrcJobsFilter(); // 🚀 New GRC logic branch
      } else {
        applyBasePmLogic(); 
      }
      
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