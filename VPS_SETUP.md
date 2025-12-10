# VPS Deployment Guide - Sikawan

> [!NOTE]
> This guide assumes Docker, Nginx, and Certbot are already installed on your VPS.

## Port Allocation

- **Port 3000**: Already in use
- **Port 4000**: Already in use
- **Port 8080**: Sikawan app ✅

---

## 1. Add Nginx Site Config

Create new site config (won't affect existing sites):

```bash
sudo nano /etc/nginx/sites-available/sihuma.rplupiproject.com
```

Content:

```nginx
server {
    listen 80;
    server_name sihuma.rplupiproject.com;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
        client_max_body_size 100M;
    }
}
```

Enable and test:

```bash
sudo ln -s /etc/nginx/sites-available/sihuma.rplupiproject.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 2. Add SSL Certificate

```bash
sudo certbot --nginx -d sihuma.rplupiproject.com
```

## 3. Prepare App Directory

```bash
sudo mkdir -p /opt/sikawan/data
sudo chown -R $USER:$USER /opt/sikawan
touch /opt/sikawan/data/database.sqlite
```

## 4. GitHub Secrets

Add these secrets to your repository (Settings → Secrets → Actions):

| Secret         | Value                                 |
| -------------- | ------------------------------------- |
| `VPS_HOST`     | Your VPS IP                           |
| `VPS_USERNAME` | SSH username                          |
| `VPS_SSH_KEY`  | Private SSH key content               |
| `APP_KEY`      | Run `php artisan key:generate --show` |

---

## Conflict Checklist

| Item                                   | Status                |
| -------------------------------------- | --------------------- |
| Port 8080 free?                        | ✅ (3000/4000 in use) |
| Unique container name (`sikawan-app`)? | ✅                    |
| Separate directory (`/opt/sikawan`)?   | ✅                    |
| Separate Nginx config file?            | ✅                    |

---

## Troubleshooting

```bash
# Check if port 8080 is in use
sudo lsof -i :8080

# Check container status
docker ps | grep sikawan

# View logs
docker logs -f sikawan-app

# Restart
cd /opt/sikawan && docker compose restart
```
