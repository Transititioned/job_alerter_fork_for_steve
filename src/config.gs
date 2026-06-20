const CONFIG = {
  // DRIVE & FILES
  SOURCE_FILE_NAME: 'MrBrownFinancialCrimesMgr.csv', // The file Apify pushes for Steve
  
  // SHEET TABS
  SHEET_IMPORT: 'AI_JOBS',   // Where raw CSV lands
  SHEET_MASTER: 'Jobs_MASTER', // Your permanent database

  // ACTIVE JOB FEEDS
  // Keep this list small. Add alternate filenames here only when the live
  // Apify/Drive output name is confirmed.
  JOB_FILES: [
    { name: 'MrBrownFinancialCrimesMgr.csv', type: 'STEVE_FINANCIAL_CRIME' }
  ],
  
  // COLUMN MAPPING (Based on your master sheet structure)
  // [Score, Priority, Resume, Title, Company, Listed, Link, Job_ID]
  COL_ID: 8,     // Column H (Unique Job ID)
  COL_TITLE: 4,  // Column D
  COL_COMPANY: 5 // Column E
};
