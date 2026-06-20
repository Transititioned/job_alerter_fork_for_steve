// THE DESPATCHER - SENDS EMAIL ALERTS TO MY GMAIL AKA WILL SHOW ON MY PHONE
function dispatchMessage(reportLink, count) {
  const recipient = "autumnscribe@gmail.com";
  const subject = `🚨 ${count} New AI/Data Job Matches`;
  
  const emailBody = `Job Alert Report Generated:\n\n` +
                    `New Matches: ${count}\n` +
                    `View Full Report: ${reportLink}\n\n` +
                    `This is an automated 30-minute sync.`;

  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: emailBody
  });

  Logger.log(`✅ Message Dispatched to ${recipient}`);
}