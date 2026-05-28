# labgpubot-click-site

Minimal frontend click test.

When the button is clicked, the page sends a GPU dashboard ping email through EmailJS.

For GitHub Pages, configure EmailJS in `click-config.js`:

```js
window.CLICK_CONFIG = {
  emailjsPublicKey: "YOUR_PUBLIC_KEY",
  emailjsServiceId: "YOUR_SERVICE_ID",
  emailjsTemplateId: "YOUR_TEMPLATE_ID"
};
```

## Run

Open `index.html` directly, or publish the folder through GitHub Pages.

The template should include `{{user}}`, `{{server}}`, `{{issue}}`, `{{note}}`, `{{time}}`, and `{{page}}`.
