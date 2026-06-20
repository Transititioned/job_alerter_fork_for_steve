/**
 * REFINED BRAIN: Focused logic for AI, GRC, and Release/Change Management.
 */
function getJobMetadata(title) {
  const t = title.toLowerCase();

  // --- 1. AI & TRANSFORMATION (Priority 1) ---
  const aiKeywords = ["ai", "digital transformation", "strategy", "hod", "director"];
  if (aiKeywords.some(word => t.includes(word))) {
    return { score: 80, resume: "AI_HoD_Transform_Resume", priority: 1 };
  }

  // --- 2. GRC & RISK (Priority 1 - Specialized by Archetype) ---
  if (t.includes("audit") || t.includes("tech risk") || t.includes("itgc")) {
    return { score: 95, resume: "Kevin Edwards Resume(internal audit).docx", priority: 1 };
  }
  if (t.includes("risk") || t.includes("cps230") || t.includes("cps234") || t.includes("compliance")) {
    return { score: 90, resume: "Kevin Edwards - Resume (Risk Mgr).docx", priority: 1 };
  }
  if (t.includes("servicenow") || t.includes("grc") || t.includes("framework")) {
    return { score: 85, resume: "Kevin Edwards - Resume(GPM RC tool).docx", priority: 2 };
  }

  // --- 3. RELEASE & CHANGE MANAGEMENT (Priority 2) ---
  const rmKeywords = ["release", "cutover", "environment", "deployment", "change control", "implementation"];
  if (rmKeywords.some(word => t.includes(word))) {
    // If it's a technical implementation role
    if (t.includes("technical") || t.includes("infrastructure") || t.includes("environment")) {
      return { score: 80, resume: "Kevin Edwards - Resume (RM + Environments).docx", priority: 2 };
    }
    // Default change/release role
    return { score: 75, resume: "Kevin Edwards - Resume (change and release).docx", priority: 2 };
  }

  // --- 4. BASE PM FALLBACK (Priority 3) ---
  // No matching specialized keywords? Fall back to standard PM resume.
  return { 
    score: 20, 
    resume: "Base_Resume_PM.docx", 
    priority: 3 
  };
}