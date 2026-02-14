---
description: Comprehensive guide to deploying the Backend and Admin Panel on a single VPS server.
---

# VPS Deployment Guide for MERN/Next.js Stack

This guide outlines the steps to deploy your Node.js Backend and Next.js Admin Panel on a single VPS (Virtual Private Server) using Nginx as a reverse proxy.

## 1. Architecture Overview
**Is your flow correct?** Yes, absolutely. Hosting both the backend and frontend on the same VPS is a standard, cost-effective, and efficient architecture for applications of this scale.

- **VPS Server**: The physical server hosted by a provider (e.g., Hostinger, DigitalOcean, AWS).
- **Process Manager (PM2)**: Keeps your applications running 24/7.
- **Nginx**: A web server that acts as a "Reverse Proxy". It takes requests from the internet (port 80/443) and directs them to the correct internal port (3000 for Admin, 5000 for Backend).

**Recommended Domain Structure:**
- **Admin Panel**: `admin.yourdomain.com` (or just `yourdomain.com` if it's the main site).
- **Backend API**: `api.yourdomain.com`.

## 2. Prerequisites
- A VPS with **Ubuntu 20.04** or **22.04** (Fresh installation recommended).
- A domain name (e.g., `example.com`).
- SSH access to your VPS.

## 3. Initial Server Setup
Connect to your server via SSH:
```bash
ssh root@your_server_ip
```

Update and upgrade packages:
```bash
sudo apt update && sudo apt upgrade -y
```

Install essential tools:
```bash
sudo apt install -y curl git unzip
```

## 4. Install Node.js
Install the latest LTS version of Node.js:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify installation:
```bash
node -v
npm -v
```

## 5. Install PM2 (Process Manager)
PM2 is used to keep your Node.js applications running in the background.
```bash
sudo npm install -g pm2
```

## 6. Setup Backend
1.  **Clone/Upload Code**: Upload your project to `/var/www/myproject`.
2.  **Navigate to Backend**:
    ```bash
    cd /var/www/myproject/backend
    ```
3.  **Install Dependencies**:
    ```bash
    npm install
    ```
4.  **Environment Variables**: Create a `.env` file with your production variables.
    ```bash
    nano .env
    # Paste your variables: MONDODB_URI, PORT=5000, etc.
    ```
5.  **Start with PM2**:
    ```bash
    pm2 start server.js --name "backend"
    ```

## 7. Setup Admin Panel
1.  **Navigate to Admin**:
    ```bash
    cd /var/www/myproject/admin
    ```
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Environment Variables**: Create a `.env` file. *Crucial: Update your API URL to point to your new domain (e.g., `https://api.yourdomain.com/api`)*.
    ```bash
    nano .env
    # NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
    ```
4.  **Build the Project**:
    ```bash
    npm run build
    ```
5.  **Start with PM2**:
    ```bash
    pm2 start npm --name "admin-panel" -- start
    ```

## 8. Save PM2 List
To ensure apps restart after a server reboot:
```bash
pm2 save
pm2 startup
# Run the command output by the startup script
```

## 9. Setup Nginx (Reverse Proxy)
Install Nginx:
```bash
sudo apt install -y nginx
```

Create a configuration file:
```bash
sudo nano /etc/nginx/sites-available/myproject
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):

```nginx
# Backend API Configuration
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000; # Backend Port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Admin Panel Configuration
server {
    server_name admin.yourdomain.com; # Or yourdomain.com

    location / {
        proxy_pass http://localhost:3000; # Admin Port
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:
```bash
sudo ln -s /etc/nginx/sites-available/myproject /etc/nginx/sites-enabled/
sudo nginx -t # Test configuration
sudo systemctl restart nginx
```

## 10. Setup SSL (HTTPS)
Install Certbot:
```bash
sudo apt install -y certbot python3-certbot-nginx
```

Obtain SSL certificates:
```bash
sudo certbot --nginx -d api.yourdomain.com -d admin.yourdomain.com
```

Follow the prompts. Certbot will automatically update your Nginx config to use HTTPS.

## 11. Final Update on Local Code
**Important:** Once deployed, you must update your local `mobile/services/api.js` and `admin/src/services/api.js` to point to the new HTTPS domain (e.g., `https://api.yourdomain.com/api`) instead of `http://localhost:5000/api` or `http://10.x.x.x:5000/api`. This ensures your app connects to the live server.
