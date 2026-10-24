Adanfopa Commodities Ltd - static website
=========================================
No build step. Upload the whole folder to any static host
(Netlify, Vercel, GitHub Pages, cPanel public_html, etc.) and open index.html.

To preview locally:   python3 -m http.server 8000   (then visit http://localhost:8000)

Edit text and phone numbers:
  - Phone numbers, tabs, process steps, crop calendar -> js/app.js
  - Headlines and other copy                          -> index.html
  - Colours and fonts                                 -> css/styles.css (top :root block)

Libraries are included in /vendor (Vue 3, Bootstrap 5.3, Bootstrap Icons).
Only the fonts (Google Fonts) and the map embed need internet access.
