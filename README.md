# 🛡️ QuickPhish – Real-Time Phishing Link Warnings

**QuickPhish** is a privacy-first browser extension for Chrome and Edge that detects phishing links in real time — **anywhere on the web**. Whether you're browsing Gmail, social media, online forums, or unknown websites, QuickPhish intercepts suspicious links and warns you *before* you get phished.

---

## 🚨 Why QuickPhish?

Phishing isn’t limited to email anymore — attackers use social media, online ads, chat apps, and even blogs to trick users into clicking malicious links. QuickPhish protects users by scanning links **at click time**, using the **Google Safe Browsing API**, and displaying an alert before redirection occurs.

---

## ✨ Features

- 🌐 Works on **every website** (not just Gmail or Outlook)
- ⚡ Real-time link checking via **Google Safe Browsing API**
- 🚫 Instantly blocks access to known phishing or malware URLs
- 🧠 Lightweight and fast (<1 second response time)
- 🧩 Built with Manifest V3 for Chrome & Edge


## 🔧 How It Works

1. Listens for link clicks anywhere in the browser
2. Intercepts and queries the **Google Safe Browsing API**
3. If the link is malicious:
   - Displays a **warning modal**
   - Lets you choose to proceed or cancel

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/QuickPhish.git
cd QuickPhish
````

### 2. Set Your Google Safe Browsing API Key

1. Visit the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the **Safe Browsing API**
4. Generate an **API key**
5. In `content.js`, set your API key:

```js
const GOOGLE_API_KEY = "YOUR_API_KEY";
```

---

## 🌍 Installation (Chrome / Edge)

1. Go to `chrome://extensions` (or `edge://extensions`)
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `quickphish-extension/` folder

---


## 📌 Notes

* This extension does not store or track any user data.
* Link checking happens client-side using the **official Google API**.
* The API key is required but can be secured via a backend proxy if needed.


## 📄 License

Licensed under the **MIT License**.

---


