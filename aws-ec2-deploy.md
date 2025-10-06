# AWS EC2 Deployment Guide (Docker)

## Prerequisites
- AWS EC2 instance (Ubuntu recommended)
- Docker & Docker Compose installed
- MySQL database (external or RDS)

## Steps

1. **Clone your repository**
   ```bash
   git clone <your-repo-url>
   cd Gold_Prototype
   ```

2. **Configure environment variables**
   - Edit `docker-compose.yml` for your MySQL credentials and API URLs.

3. **Build and run containers**
   ```bash
   sudo docker-compose up --build -d
   ```

4. **Open ports in EC2 Security Group**
   - Allow TCP 80 (frontend) and 5000 (backend)

5. **Access your app**
   - Frontend: `http://<EC2_PUBLIC_IP>/`
   - Backend: `http://<EC2_PUBLIC_IP>:5000/`

## Notes
- For production, use Nginx or Caddy as a reverse proxy for the frontend.
- Store secrets securely (use AWS Secrets Manager or `.env` files not committed to git).
- For SSL, use AWS ACM or Let's Encrypt.

---

**Files included:**
- `Dockerfile.frontend` (React app)
- `server/Dockerfile.backend` (Node.js backend)
- `docker-compose.yml` (orchestration)
