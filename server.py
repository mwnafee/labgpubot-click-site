import json
import os
import smtplib
from email.message import EmailMessage
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parent
RECIPIENT = "nafeem@rpi.edu"


def send_email(requester, note):
    gmail_user = os.environ.get("GMAIL_USER")
    gmail_password = os.environ.get("GMAIL_APP_PASSWORD")

    if not gmail_user or not gmail_password:
        raise RuntimeError("GMAIL_USER or GMAIL_APP_PASSWORD is not set.")

    msg = EmailMessage()
    msg["Subject"] = "Labgpubot click received"
    msg["From"] = gmail_user
    msg["To"] = RECIPIENT

    lines = [
        "A frontend click was made.",
        "",
        f"Requester: {requester or 'unknown'}",
        f"Note: {note or '(none)'}",
    ]
    msg.set_content("\n".join(lines))

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=15) as smtp:
        smtp.starttls()
        smtp.login(gmail_user, gmail_password)
        smtp.send_message(msg)


class ClickHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self.end_headers()

    def do_POST(self):
        if self.path != "/api/click":
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint.")
            return

        try:
            content_length = int(self.headers.get("Content-Length", "0"))
            raw_body = self.rfile.read(content_length)
            payload = json.loads(raw_body.decode("utf-8")) if raw_body else {}

            requester = str(payload.get("requester", "")).strip()
            note = str(payload.get("note", "")).strip()
            send_email(requester, note)

            self.respond_json(HTTPStatus.OK, {
                "ok": True,
                "recipient": RECIPIENT
            })
        except Exception as exc:
            self.respond_json(HTTPStatus.INTERNAL_SERVER_ERROR, {
                "error": str(exc)
            })

    def respond_json(self, status_code, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


if __name__ == "__main__":
    port = int(os.environ.get("CLICK_SITE_PORT", "8090"))
    server = ThreadingHTTPServer(("0.0.0.0", port), ClickHandler)
    print(f"Serving click site on http://0.0.0.0:{port}")
    server.serve_forever()
