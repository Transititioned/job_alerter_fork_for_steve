/**
 * Steve Brown fork: score and resume routing for financial crime roles.
 */
function getJobMetadata(title) {
  const t = String(title || "").toLowerCase();

  if (hasAnySteveKeyword(t, ["head of", "director", "senior manager", "lead"])) {
    if (hasAnySteveKeyword(t, ["financial crime", "aml", "ctf", "sanctions", "transaction monitoring"])) {
      return { score: 95, resume: "Steve Brown - Financial Crime Manager Resume.docx", priority: 1 };
    }
  }

  if (hasAnySteveKeyword(t, ["financial crime manager", "aml manager", "aml/ctf manager", "ctf manager"])) {
    return { score: 95, resume: "Steve Brown - Financial Crime Manager Resume.docx", priority: 1 };
  }

  if (hasAnySteveKeyword(t, ["investigations manager", "financial crime investigations", "fraud investigations"])) {
    return { score: 90, resume: "Steve Brown - Investigations Manager Resume.docx", priority: 1 };
  }

  if (hasAnySteveKeyword(t, ["risk manager", "financial crime risk", "risk and compliance", "compliance manager"])) {
    return { score: 85, resume: "Steve Brown - Risk Compliance Manager Resume.docx", priority: 2 };
  }

  if (hasAnySteveKeyword(t, ["kyc", "cdd", "edd", "sanctions", "transaction monitoring", "austrac"])) {
    return { score: 75, resume: "Steve Brown - Financial Crime Manager Resume.docx", priority: 2 };
  }

  return { 
    score: 20,
    resume: "Steve Brown - Base Resume.docx",
    priority: 3 
  };
}

function hasAnySteveKeyword(text, keywords) {
  const cleanText = String(text || "").toLowerCase();
  return keywords.some(keyword => cleanText.includes(String(keyword || "").toLowerCase()));
}
