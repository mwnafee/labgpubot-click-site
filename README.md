# labgpubot-click-site

Minimal frontend + backend click test.

When the button is clicked, the backend sends an email through `labgpubot` to `nafeem@rpi.edu`.

## Run

Set:

```bash
export GMAIL_USER="labgpubot@gmail.com"
export GMAIL_APP_PASSWORD="your-app-password"
```

Then start:

```bash
python3 server.py
```

Open:

```text
http://<host>:8090/
```
