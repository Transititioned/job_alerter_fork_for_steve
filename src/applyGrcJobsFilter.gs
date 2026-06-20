/**
 * Steve Brown financial crime keyword groups.
 */
const STEVE_KEYWORD_GROUPS = {
  AML: [
    "AML",
    "AML/CTF",
    "anti-money laundering",
    "financial crime",
    "financial crimes",
    "AUSTRAC",
    "KYC",
    "CDD",
    "EDD",
    "customer due diligence",
    "enhanced due diligence",
    "transaction monitoring",
    "suspicious matter",
    "SMR",
    "due diligence"
  ],

  CTF_MANAGER: [
    "CTF",
    "AML/CTF",
    "counter terrorism financing",
    "counter-terrorism financing",
    "terrorism financing",
    "sanctions",
    "screening",
    "watchlist",
    "financial crime manager",
    "AML CTF manager",
    "AML/CTF manager",
    "AUSTRAC"
  ],

  RISK_MANAGER: [
    "risk manager",
    "risk and compliance",
    "financial crime risk",
    "operational risk",
    "enterprise risk",
    "risk management",
    "risk framework",
    "risk management framework",
    "controls",
    "assurance",
    "governance",
    "regulatory change",
    "Line 2",
    "oversight",
    "framework"
  ],

  INVESTIGATIONS_MANAGER: [
    "investigations manager",
    "financial crime investigations",
    "financial crime operations",
    "AML investigations",
    "fraud investigations",
    "case management",
    "suspicious matter",
    "SMR",
    "fraud",
    "scams"
  ]
};

const STEVE_OUT_KEYWORDS = [
  "graduate",
  "intern",
  "trainee",
  "junior",
  "assistant",
  "customer service",
  "sales",
  "account manager",
  "relationship manager",
  "project manager",
  "business analyst",
  "WHS",
  "health and safety",
  "injury management",
  "return to work",
  "workers compensation",
  "NDIS",
  "aged care",
  "clinical",
  "construction",
  "insurance claims",
  "private investigator",
  "surveillance",
  "workplace investigations",
  "HR investigations",
  "cyber security",
  "IT risk",
  "loss prevention",
  "retail risk"
];

const STEVE_RESUME_BY_GROUP = {
  AML: "Steve Brown - Financial Crime Manager Resume.docx",
  CTF_MANAGER: "Steve Brown - Financial Crime Manager Resume.docx",
  RISK_MANAGER: "Steve Brown - Risk Compliance Manager Resume.docx",
  INVESTIGATIONS_MANAGER: "Steve Brown - Investigations Manager Resume.docx"
};

/**
 * Steve fork logic: scans jobs and keeps financial crime management matches.
 */
function applySteveJobsFilter() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_IMPORT);
  if (!sheet || sheet.getLastRow() <= 1) return;

  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).toLowerCase());

  const titleIdx = headers.indexOf("title");
  const orgIdx = headers.findIndex(h => h.includes("company") || h.includes("advertiser/name"));
  const descIdx = headers.findIndex(h => h.includes("description") || h.includes("snippet") || h.includes("summary"));
  const scoreIdx = ensureColumn(sheet, headers, "score");
  const priorityIdx = ensureColumn(sheet, headers, "priority");
  const resumeIdx = ensureColumn(sheet, headers, "resume");
  const incIdx = ensureColumn(sheet, headers, "included");

  const outputWidth = headers.length;

  const results = data.slice(1).map(row => {
    row = padRow(row, outputWidth);

    const title = titleIdx !== -1 ? String(row[titleIdx] || "") : "";
    const company = orgIdx !== -1 ? String(row[orgIdx] || "") : "";
    const description = descIdx !== -1 ? String(row[descIdx] || "") : "";
    const searchableText = [title, company, description].join(" ");
    const excluded = hasAnyKeyword(searchableText, STEVE_OUT_KEYWORDS);
    const matchedGroup = getFirstMatchedSteveGroup(searchableText);

    if (excluded || !matchedGroup) {
      row[scoreIdx] = 0;
      row[priorityIdx] = "Exclude";
      row[resumeIdx] = "";
      row[incIdx] = false;
      return row;
    }

    const meta = getJobMetadata(title);

    row[scoreIdx] = meta.score;
    row[priorityIdx] = meta.priority;
    row[resumeIdx] = STEVE_RESUME_BY_GROUP[matchedGroup] || meta.resume;
    row[incIdx] = true;

    return row;
  });

  if (results.length > 0) {
    sheet.getRange(2, 1, results.length, outputWidth).setValues(results);
  }

  Logger.log(`✅ Steve filter: processed ${results.length} jobs.`);
}

function applyGrcJobsFilter() {
  applySteveJobsFilter();
}

function getFirstMatchedSteveGroup(text) {
  for (const groupName in STEVE_KEYWORD_GROUPS) {
    if (hasAnyKeyword(text, STEVE_KEYWORD_GROUPS[groupName])) {
      return groupName;
    }
  }
  return "";
}

function hasAnyKeyword(text, keywords) {
  const cleanText = String(text || "").toLowerCase();

  return keywords.some(keyword => {
    const cleanKeyword = String(keyword || "").toLowerCase();
    return cleanText.includes(cleanKeyword);
  });
}

function ensureColumn(sheet, headers, headerName) {
  let idx = headers.indexOf(headerName);
  if (idx === -1) {
    idx = headers.length;
    sheet.getRange(1, idx + 1).setValue(headerName.charAt(0).toUpperCase() + headerName.slice(1));
    headers.push(headerName);
  }
  return idx;
}

function padRow(row, width) {
  const padded = row.slice();
  while (padded.length < width) {
    padded.push("");
  }
  return padded;
}
