# labgpubot-click-site

Minimal frontend + backend click test.

When the button is clicked, the backend sends an email through `labgpubot` to `nafeem@rpi.edu`.

For GitHub Pages, configure the backend host in `click-config.js`:

```js
window.CLICK_CONFIG = {
  apiBaseUrl: "http://deeprecon:8090"
};
```

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
