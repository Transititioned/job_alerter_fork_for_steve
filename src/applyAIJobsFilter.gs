function applyAiJobsFilter() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('AI_JOBS');
  
  if (!sheet || sheet.getLastRow() <= 1) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).trim().toLowerCase());
  const titleIdx = headers.indexOf('title');
  
  // 1. Identify or Create Included Column
  let incIdx = headers.indexOf("included");
  if (incIdx === -1) {
    incIdx = headers.length;
    sheet.getRange(1, incIdx + 1).setValue("Included");
  }

// 2. REFINED KEYWORDS (Adding 'project' and 'program' to be safe)
  const techKW = ['ai', 'data', 'ml', 'genai', 'intelligence', 'analytics', 'digital', 'transformation'];
  const roleKW = [
    'lead', 'manager', 'director', 'enablement', 'governance', 
    'delivery', 'specialist', 'analyst', 'pmo', 'consultant', 'head of',
    'project', 'program', 'iteration', 'scrum' // Added for AI PM/Lead coverage
  ];
  const exclude = ['construction', 'civil', 'electrician', 'plumber', 'site manager'];

  // 3. APPLY LOGIC (Strengthening the 'AI' requirement)
  const updates = data.slice(1).map(row => {
    const title = String(row[titleIdx] || "").toLowerCase();
    
    // We want to ensure it's a Tech role AND a Leadership/Delivery role
    const hasTech = techKW.some(kw => title.includes(kw));
    const hasRole = roleKW.some(kw => title.includes(kw));
    const isExcluded = exclude.some(ex => title.includes(ex));

    // Fix: Ensure we are tagging it as true so the Deduper sees it
    const match = (hasTech && hasRole) && !isExcluded;
    return [match]; 
  });

  // 4. WRITE TO SHEET
  sheet.getRange(2, incIdx + 1, updates.length, 1).setValues(updates);
  SpreadsheetApp.flush();
  Logger.log("✅ Filter updated with AI Enablement/Director keywords.");
}