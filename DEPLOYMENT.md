# 🚀 VIBE Live Match & Chat - Production Deployment Guide

This guide provides end-to-end instructions for deploying the **VIBE Live Match & Chat** application:
- **Frontend**: [Cloudflare Pages](https://pages.cloudflare.com/) (Fast global edge CDN for React + Vite)
- **Backend**: [Render](https://render.com/) (Fully managed Node.js web service with WebSocket/Socket.IO support)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Managed cloud MongoDB cluster)

---

## 🏗️ 1. Architecture & Connection Overview

```
+-----------------------------------+              +----------------------------------+
|          Cloudflare Pages         |              |          Render Web Service      |
|        (Frontend - React Vite)    |              |       (Backend - Node/Express)   |
|   https://vibe-live-chat.pages.dev|              |  https://vibe-backend.onrender.com|
+-----------------------------------+              +----------------------------------+
         |                       \                     /                    |
         | HTTPS                  \ WSS (Socket.io)   /                     |
         v                         \                 v                      v
  [User Browser] <========== P2P WebRTC Streams ==========>       [MongoDB Atlas]
                      (Audio / Video / DataChannel)           (Sessions & Reports)
```

1. **Client on Cloudflare Pages** makes REST calls (`/api/stats`, `/api/report`) and establishes a persistent **WebSocket Secure (WSS)** connection to the Render backend via `socket.io-client`.
2. **Backend on Render** manages the matchmaking queue, pairs compatible users, and facilitates WebRTC signaling (SDP offer/answer and ICE candidate exchange).
3. Once signaled, the media streams flow directly **Peer-to-Peer (P2P)** between users with ultra-low latency.

---

## 🍃 2. MongoDB Atlas Database Setup

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/) and create a free or dedicated cluster.
2. Under **Database Access**, create a database user:
   - **Username**: `vibe_admin`
   - **Password**: Secure password (e.g. `VibeSecure2025Pass!`)
   - **Role**: `Read and write to any database`
3. Under **Network Access**, click **Add IP Address**:
   - Select **Allow Access from Anywhere** (`0.0.0.0/0`) so Render cloud instances can reach the database.
4. Under **Database Deployments**, click **Connect** -> **Drivers** -> Copy the connection string:
   ```env
   mongodb+srv://vibe_admin:<password>@cluster0.vibe.mongodb.net/vibe_live_chat?retryWrites=true&w=majority&appName=VibeCluster
   ```

---

## ⚡ 3. Deploying the Backend on Render

1. Push your repository to **GitHub** or **GitLab**.
2. Log in to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
3. Connect your Git repository.
4. Configure the Web Service settings:
   - **Name**: `vibe-backend`
   - **Region**: Choose closest to your target audience (e.g., `Frankfurt (EU Central)` or `Oregon (US West)`)
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**:
     ```bash
     npm install
     ```
   - **Start Command**:
     ```bash
     node server.js
     ```
   - **Instance Type**: `Free` or `Starter`

5. Add Environment Variables in the **Environment** tab:
   | Key | Value | Purpose |
   | :--- | :--- | :--- |
   | `NODE_ENV` | `production` | Enables production optimizations |
   | `PORT` | `5000` | Render port binding (or leave default) |
   | `MONGO_URI` | `mongodb+srv://vibe_admin:<password>@cluster0.vibe.mongodb.net/vibe_live_chat?retryWrites=true&w=majority` | MongoDB connection string |
   | `CLIENT_URL` | `https://vibe-live-chat.pages.dev` | Allowed CORS origin for Cloudflare |
   | `JWT_SECRET` | `vibe_super_secret_jwt_encryption_key_2025_prod_94820` | Security secret |
   | `ENABLE_BOT_FALLBACK` | `true` | Enables authentic persona matching when solo |

6. Click **Create Web Service**.
7. Once deployed, Render will provide a live URL such as:
   `https://vibe-backend.onrender.com`
8. Verify health check by visiting:
   `https://vibe-backend.onrender.com/api/health`

---

## 🌐 4. Deploying the Frontend on Cloudflare Pages

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** -> **Pages** -> **Connect to Git**.
3. Select your repository.
4. Set up the Build settings:
   - **Project Name**: `vibe-live-chat`
   - **Production Branch**: `main`
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**:
     ```bash
     npm run build
     ```
   - **Build Output Directory**:
     ```
     dist
     ```
5. Add Environment Variables under **Environment Variables (Advanced)**:
   | Variable Name | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_SERVER_URL` | `https://vibe-backend.onrender.com` | URL of your deployed Render backend |

6. Click **Save and Deploy**.
7. Cloudflare Pages automatically creates a custom subdomain:
   `https://vibe-live-chat.pages.dev`
8. Single-Page Application (SPA) routing is handled automatically by the included [client/public/_redirects](file:///client/public/_redirects) file (`/* /index.html 200`).

---

## 🔗 5. Verifying the Connection

1. Open `https://vibe-live-chat.pages.dev` in your browser.
2. Check the browser developer console:
   - Look for `[Socket] Connected to backend signaling server`
   - Verify the real-time online counter (`28,419+ Online Now`) is synchronized with the backend.
3. Test the Matching Flow:
   - Click **Find My Match**.
   - The radar screen will ping regional nodes and connect you to an authentic live peer.
   - Test sending a chat message, toggling the camera/microphone, and using **Skip Partner (ESC)** or **End Chat**.
4. Open a second browser tab (or incognito window) to test real peer-to-peer pairing:
   - Both users enter the queue and will instantly match with each other over WebRTC!

---

## 🛠️ 6. Local Development Quickstart

To run both frontend and backend locally on your computer:

### 1. Start the Backend Server
```powershell
cd server
npm install
node server.js
# Listening on http://localhost:5000
```

### 2. Start the Frontend Client
```powershell
cd client
npm install
npm run dev
# Ready on http://localhost:5173
```
