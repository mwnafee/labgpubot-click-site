const statusBox = document.getElementById("status");
const sendBtn = document.getElementById("sendBtn");
const API_BASE_URL = (window.CLICK_CONFIG && window.CLICK_CONFIG.apiBaseUrl)
  ? window.CLICK_CONFIG.apiBaseUrl.replace(/\/$/, "")
  : "";
const CLICK_API_URL = API_BASE_URL ? `${API_BASE_URL}/api/click` : "";

function setStatus(message, kind) {
  statusBox.textContent = message;
  statusBox.className = kind || "";
}

async function sendClickEmail() {
  const requester = document.getElementById("requester").value.trim();
  const note = document.getElementById("note").value.trim();

  if (!CLICK_API_URL) {
    setStatus("Click API is not configured. Set window.CLICK_CONFIG.apiBaseUrl in click-config.js.", "error");
    return;
  }

  sendBtn.disabled = true;
  setStatus("Sending email...", "");

  try {
    const response = await fetch(CLICK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        requester,
        note
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Request failed.");
    }

    setStatus(`Email sent to ${payload.recipient}.`, "success");
  } catch (error) {
    setStatus(error.message || "Could not send email.", "error");
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener("click", sendClickEmail);
