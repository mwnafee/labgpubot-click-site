const statusBox = document.getElementById("status");
const sendBtn = document.getElementById("sendBtn");
const EMAILJS_CONFIG = window.CLICK_CONFIG || {};

function setStatus(message, kind) {
  statusBox.textContent = message;
  statusBox.className = kind || "";
}

function hasEmailjsConfig() {
  return Boolean(
    window.emailjs &&
    EMAILJS_CONFIG.emailjsPublicKey &&
    EMAILJS_CONFIG.emailjsServiceId &&
    EMAILJS_CONFIG.emailjsTemplateId
  );
}

async function sendClickEmail() {
  const user = document.getElementById("requester").value.trim();
  const server = document.getElementById("server").value.trim();
  const issue = document.getElementById("issue").value.trim();
  const note = document.getElementById("note").value.trim();

  if (!hasEmailjsConfig()) {
    setStatus("EmailJS is not configured. Check click-config.js and the EmailJS SDK script.", "error");
    return;
  }

  sendBtn.disabled = true;
  setStatus("Sending ping...", "");

  try {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.emailjsPublicKey
    });

    await emailjs.send(
      EMAILJS_CONFIG.emailjsServiceId,
      EMAILJS_CONFIG.emailjsTemplateId,
      {
        user: user || "unknown",
        server: server || "not specified",
        issue: issue || "not specified",
        note: note || "(none)",
        time: new Date().toLocaleString(),
        page: window.location.href
      }
    );

    setStatus("Ping sent.", "success");
  } catch (error) {
    setStatus(error.text || error.message || "Could not send ping.", "error");
  } finally {
    sendBtn.disabled = false;
  }
}

sendBtn.addEventListener("click", sendClickEmail);
