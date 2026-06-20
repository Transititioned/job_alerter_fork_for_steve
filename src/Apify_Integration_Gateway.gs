/**
 * THE GATEWAY: This function is the ONLY entry point for your website buttons.
 */
function Apify_Integration_Gateway(e) {
  // 1. Identify which button was pressed (?taskType=AI or ?taskType=PM)
  const type = (e.parameter && e.parameter.taskType) ? e.parameter.taskType : "PM";
  
  // 2. Map the type to the correct Apify Task ID
  let taskId = "";
  if (type === "AI") {
    taskId = "70Xsb847G76NMu7k9"; // The AI Task ID from your screenshot
  } else {
    taskId = "SnlGOVDyKe5JmIQzU"; // Your existing PM Task ID
  }

  console.log(`🚀 Gateway Triggered: ${type} (Task ID: ${taskId})`);

  // 3. Execute the call to Apify
  return executeApifyScrape(taskId, type);
}

/**
 * Helper to poke the Apify API
 */
function executeApifyScrape(taskId, type) {
  const API_KEY = 'PUT_your_TOKEN_here;
  const url = `https://api.apify.com/v2/actor-tasks/${taskId}/runs?token=${API_KEY}`;
  
  const options = {
    'method': 'post',
    'muteHttpExceptions': true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const code = response.getResponseCode();
    
    if (code === 201 || code === 200) {
      return ContentService.createTextOutput(`Success: ${type} scrape started.`);
    } else {
      return ContentService.createTextOutput(`Error: Apify returned ${code}`);
    }
  } catch (err) {
    return ContentService.createTextOutput(`Fetch Error: ${err.message}`);
  }
}