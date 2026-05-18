console.log("ThreatScan Content Script loaded in Gmail!");

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const attachments = document.querySelectorAll('.aZo, .vK'); 
    
    attachments.forEach(attachment => {
      
      if (!attachment.dataset.threatScanAdded) {
        attachment.dataset.threatScanAdded = "true";
        
        // Create our scan button
        const scanBtn = document.createElement('button');
        scanBtn.innerText = "🔍 Scan";
        scanBtn.style.cssText = "margin-left: 8px; padding: 2px 6px; background: #22c55e; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; font-family: sans-serif;";
        
        scanBtn.onclick = (e) => {
          e.preventDefault();
          e.stopPropagation();
          alert("Initiating ThreatScan for this attachment...");
        };

        attachment.appendChild(scanBtn);
      }
    });
  }
});

observer.observe(document.body, { childList: true, subtree: true });


// Listen for scanner requests from the extension popup interface
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "GET_UNREAD_EMAILS") {
    
    // Gmail marks unread rows with the class '.zE'
    const unreadRows = document.querySelectorAll('tr.zE');
    const extractedEmails = [];

    unreadRows.forEach((row) => {
      try {
        // Parse Sender Info (usually falls inside the text tags)
        const senderElem = row.querySelector('.yW span[email]');
        const senderName = senderElem ? senderElem.innerText : "Unknown Sender";
        const senderEmail = senderElem ? senderElem.getAttribute('email') : "";

        // Parse Subject Line and Message Preview Snippet
        const subjectElem = row.querySelector('.bog');
        const subjectText = subjectElem ? subjectElem.innerText : "No Subject";
        
        const snippetElem = row.querySelector('.y2');
        const snippetText = snippetElem ? snippetElem.innerText : "";

        extractedEmails.push({
          sender: `${senderName} <${senderEmail}>`,
          subject: subjectText,
          snippet: snippetText
        });
      } catch (err) {
        console.error("Error parsing unread email row:", err);
      }
    });

    // Send the compiled scan list back to the React UI layout
    sendResponse({ emails: extractedEmails });
  }
  return true; // Keeps the message channel open for async operations
});
