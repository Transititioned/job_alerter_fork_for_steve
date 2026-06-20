/**
 * Handles the logic for building reports and dispatching alerts.
 * @param {Array[]} newData - The array of new job data.
 */
function notify_for_New_Jobs(newData) {
  try {
    if (!Array.isArray(newData) || newData.length === 0) return;

    // Trigger the Report Builder using the array
    const reportMetadata = buildJobReport(newData);

    // Trigger the Dispatcher with the report link and the count
    dispatchMessage(reportMetadata.link, newData.length);
    
    Logger.log(`📢 Notification dispatched for ${newData.length} jobs.`);

  } catch (e) {
    Logger.log(`❌ Notification Error: ${e.message}`);
  }
}