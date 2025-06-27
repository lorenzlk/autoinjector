# 🚀 AutoInjector Deployment Guide

This guide covers deployment options for AutoInjector across different platforms and environments.

## 📋 Prerequisites

- **Node.js**: 16.x or higher
- **Docker**: 20.x or higher (for containerized deployments)
- **Git**: For source code management
- **Domain**: For production deployments (optional for local/testing)

## 🏠 Local Development

### Quick Start

```bash
# Clone and setup
git clone https://github.com/lorenzlk/autoinjector.git
cd autoinjector
npm install

# Start development server
npm run dev

# Verify it's working
curl http://localhost:3000/health
```

### Environment Configuration

Create `.env` file:
```bash
PORT=3000
NODE_ENV=development
RATE_LIMIT=30
ALLOWED_ORIGINS=*
```

## 🐳 Docker Deployment

### Basic Docker

```bash
# Build image
docker build -t autoinjector .

# Run container
docker run -d \
  --name autoinjector \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e RATE_LIMIT=50 \
  autoinjector

# Check logs
docker logs autoinjector
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## ☁️ Cloud Platform Deployments

### Heroku

1. **Create Heroku App:**
   ```bash
   heroku create your-autoinjector-app
   heroku config:set NODE_ENV=production
   heroku config:set RATE_LIMIT=30
   ```

2. **Deploy:**
   ```bash
   git push heroku main
   ```

3. **Scale (if needed):**
   ```bash
   heroku ps:scale web=2
   ```

### AWS (Elastic Beanstalk)

1. **Install EB CLI:**
   ```bash
   pip install awsebcli
   ```

2. **Initialize and Deploy:**
   ```bash
   eb init autoinjector
   eb create autoinjector-prod
   eb setenv NODE_ENV=production RATE_LIMIT=30
   eb deploy
   ```

### AWS (ECS with Fargate)

1. **Create ECR Repository:**
   ```bash
   aws ecr create-repository --repository-name autoinjector
   ```

2. **Build and Push Image:**
   ```bash
   docker build -t autoinjector .
   docker tag autoinjector:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/autoinjector:latest
   docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/autoinjector:latest
   ```

3. **Create ECS Service using the AWS Console or CLI**

### DigitalOcean App Platform

1. **Create `app.yaml`:**
   ```yaml
   name: autoinjector
   services:
   - name: web
     source_dir: /
     github:
       repo: your-username/autoinjector
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: RATE_LIMIT
       value: "30"
   ```

2. **Deploy:**
   ```bash
   doctl apps create --spec app.yaml
   ```

### Google Cloud Platform (Cloud Run)

1. **Build and Deploy:**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/autoinjector
   gcloud run deploy --image gcr.io/PROJECT-ID/autoinjector --platform managed
   ```

2. **Set Environment Variables:**
   ```bash
   gcloud run services update autoinjector \
     --set-env-vars NODE_ENV=production,RATE_LIMIT=30
   ```

## 🔧 Production Optimization

### Environment Variables

```bash
# Essential production variables
NODE_ENV=production
PORT=3000
RATE_LIMIT=50
ALLOWED_ORIGINS=https://yourdomain.com,https://api.yourdomain.com

# Optional optimizations
REQUEST_TIMEOUT=30000
LOG_LEVEL=info
```

### Nginx Reverse Proxy

Create `/etc/nginx/sites-available/autoinjector`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=10 nodelay;
    }
}

# Rate limiting zone
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
}
```

### SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Monitoring & Logging

### Health Checks

```bash
# Basic health check
curl https://yourdomain.com/health

# Automated monitoring
*/5 * * * * curl -f https://yourdomain.com/health || echo "AutoInjector is down" | mail -s "Alert" admin@yourdomain.com
```

### Log Management

```bash
# View logs (Docker)
docker logs autoinjector -f

# View logs (systemd service)
journalctl -u autoinjector -f

# Log rotation
/var/log/autoinjector/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 autoinjector autoinjector
}
```

### Performance Monitoring

```javascript
// Add to your monitoring stack
const healthCheck = async () => {
  const response = await fetch('https://yourdomain.com/health');
  const data = await response.json();
  
  console.log({
    status: data.status,
    uptime: data.uptime,
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
};

setInterval(healthCheck, 60000);
```

## 🔒 Security Hardening

### Firewall Configuration

```bash
# Allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### Environment Security

```bash
# Secure environment file
chmod 600 .env
chown root:root .env

# Create dedicated user
sudo useradd -r -s /bin/false autoinjector
sudo usermod -a -G autoinjector autoinjector
```

### Rate Limiting (Redis)

For high-traffic deployments:

```javascript
// In production, replace in-memory rate limiting with Redis
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const rateLimit = async (req, res, next) => {
  const key = `rate_limit:${req.ip}`;
  const current = await client.incr(key);
  
  if (current === 1) {
    await client.expire(key, 60); // 1 minute window
  }
  
  if (current > process.env.RATE_LIMIT) {
    return res.status(429).json({ error: 'Rate limit exceeded' });
  }
  
  next();
};
```

## 🚀 Scaling

### Horizontal Scaling (Docker Swarm)

```bash
# Initialize swarm
docker swarm init

# Create service
docker service create \
  --name autoinjector \
  --replicas 3 \
  --publish 3000:3000 \
  autoinjector

# Scale up/down
docker service scale autoinjector=5
```

### Kubernetes Deployment

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: autoinjector
spec:
  replicas: 3
  selector:
    matchLabels:
      app: autoinjector
  template:
    metadata:
      labels:
        app: autoinjector
    spec:
      containers:
      - name: autoinjector
        image: autoinjector:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: RATE_LIMIT
          value: "30"
---
apiVersion: v1
kind: Service
metadata:
  name: autoinjector-service
spec:
  selector:
    app: autoinjector
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

Deploy:
```bash
kubectl apply -f k8s/deployment.yaml
```

## 🆘 Troubleshooting

### Common Issues

1. **Port Already in Use:**
   ```bash
   # Find process using port 3000
   lsof -ti:3000
   kill -9 <PID>
   ```

2. **Docker Build Fails:**
   ```bash
   # Clean Docker cache
   docker system prune -a
   docker build --no-cache -t autoinjector .
   ```

3. **Memory Issues:**
   ```bash
   # Check memory usage
   docker stats autoinjector
   
   # Increase container memory limit
   docker run -m 512m autoinjector
   ```

### Health Check Debugging

```bash
# Detailed health check
curl -v https://yourdomain.com/health

# Check application logs
docker logs autoinjector --tail 100

# Test specific endpoints
curl "https://yourdomain.com/?url=https://example.com&context=after_ad"
```

## 📝 Post-Deployment Checklist

- [ ] Health endpoint responding correctly
- [ ] SSL certificate installed and working
- [ ] Rate limiting configured appropriately
- [ ] Monitoring and alerting set up
- [ ] Log rotation configured
- [ ] Backup strategy implemented
- [ ] Security hardening applied
- [ ] Performance baseline established
- [ ] Documentation updated

---

Need help with deployment? Check our [GitHub Issues](https://github.com/lorenzlk/autoinjector/issues) or [Discussions](https://github.com/lorenzlk/autoinjector/discussions)! 