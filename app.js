const statusBox = document.getElementById("status");
const sendBtn = document.getElementById("sendBtn");

function setStatus(message, kind) {
  statusBox.textContent = message;
  statusBox.className = kind || "";
}

async function sendClickEmail() {
  const requester = document.getElementById("requester").value.trim();
  const note = document.getElementById("note").value.trim();

  sendBtn.disabled = true;
  setStatus("Sending email...", "");

  try {
    const response = await fetch("/api/click", {
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
