/**
 * GRC keyword groups: targeted search terms for GRC job matching.
 */
const GRC_KEYWORD_GROUPS = {
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

const GRC_OUT_KEYWORDS = [
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

const GRC_RESUME_BY_GROUP = {
  AML: "AML",
  CTF_MANAGER: "CTF Manager",
  RISK_MANAGER: "Risk Manager",
  INVESTIGATIONS_MANAGER: "Investigations Manager"
};

/**
 * GRC LOGIC: Scans GRC job titles and maps them to targeted resume variants.
 */
function applyGrcJobsFilter() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("AI_JOBS");
  const data = sheet.getDataRange().getValues();
  const headers = data[0].map(h => String(h).toLowerCase());

  const titleIdx = headers.indexOf("title");
  const scoreIdx = headers.indexOf("score");
  const priorityIdx = headers.indexOf("priority");
  const resumeIdx = headers.indexOf("resume");
  const incIdx = headers.indexOf("included");

  const results = data.slice(1).map(row => {
    const title = String(row[titleIdx] || "");
    const excluded = hasAnyKeyword(title, GRC_OUT_KEYWORDS);
    const matchedGroup = getFirstMatchedGrcGroup(title);

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
    row[resumeIdx] = GRC_RESUME_BY_GROUP[matchedGroup] || meta.resume;
    row[incIdx] = true;

    return row;
  });

  if (results.length > 0) {
    sheet.getRange(2, 1, results.length, data[0].length).setValues(results);
  }

  Logger.log(`✅ GRC Logic: Successfully processed ${results.length} jobs.`);
}

function getFirstMatchedGrcGroup(text) {
  for (const groupName in GRC_KEYWORD_GROUPS) {
    if (hasAnyKeyword(text, GRC_KEYWORD_GROUPS[groupName])) {
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