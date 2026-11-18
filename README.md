# aerostat-site

The landing page for [AeroStat](https://github.com/Hampter-0/AeroStat) on `aerostatus.nl`.

Plain HTML, CSS and a little JavaScript. There is no build step: what is in this folder is what gets served.

## Run it locally

Any static file server works, for example:

```bash
npx serve .
```

## Deploy

The site runs on a VPS behind nginx, with Cloudflare in front (proxied, SSL/TLS mode **Full (strict)** with a Cloudflare Origin Certificate for `aerostatus.nl` and `*.aerostatus.nl`).

First time:

```bash
git clone https://github.com/Hampter-0/aerostat-site.git /var/www/aerostat-site
```

After a change:

```bash
cd /var/www/aerostat-site && git pull
```

### nginx

`/etc/nginx/sites-available/aerostatus.nl`, linked into `sites-enabled`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name aerostatus.nl www.aerostatus.nl;
    return 301 https://aerostatus.nl$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name www.aerostatus.nl;
    ssl_certificate     /etc/ssl/cloudflare/aerostatus.nl.pem;
    ssl_certificate_key /etc/ssl/cloudflare/aerostatus.nl.key;
    return 301 https://aerostatus.nl$request_uri;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name aerostatus.nl;
    ssl_certificate     /etc/ssl/cloudflare/aerostatus.nl.pem;
    ssl_certificate_key /etc/ssl/cloudflare/aerostatus.nl.key;

    root /var/www/aerostat-site;
    index index.html;

    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header X-Frame-Options "DENY" always;
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'none'" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=()" always;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ (^/\.|^/README\.md$) {
        return 404;
    }
}
```

Check and reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

`http2 on;` needs nginx 1.25.1 or newer. On an older nginx, drop that line and use `listen 443 ssl http2;` instead.
