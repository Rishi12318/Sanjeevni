# Backend Deployment Guide

This guide explains how to deploy the Sanjeevni Django backend to production.

## Quick Start: Deploy to Render.com (Recommended)

Render.com is free and easy to set up. Here's how:

### Step 1: Create a Render.com Account
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository

### Step 2: Create a PostgreSQL Database
1. In Render dashboard, click **New +** → **PostgreSQL**
2. Name it `sanjeevni-db`
3. Copy the **Internal Database URL** (you'll need it soon)

### Step 3: Deploy the Backend
1. Click **New +** → **Web Service**
2. Select your GitHub repository
3. Fill in settings:
   - **Name:** `sanjeevni-backend`
   - **Runtime:** `Python 3.11`
   - **Build Command:** `pip install -r requirements.txt && python manage.py migrate`
   - **Start Command:** `gunicorn sanjeevni_backend.wsgi:application`

### Step 4: Add Environment Variables
In the **Environment** section, add:

```
DJANGO_DEBUG=false
DJANGO_SECRET_KEY=<generate-a-random-secret-key>
DJANGO_ALLOWED_HOSTS=sanjeevni-backend.onrender.com
POSTGRES_DB=sanjeevni
POSTGRES_USER=<from-db-credentials>
POSTGRES_PASSWORD=<from-db-credentials>
POSTGRES_HOST=<from-database-url>
POSTGRES_PORT=5432
CORS_ALLOWED_ORIGINS=https://sanjeevni-pi.vercel.app
OLLAMA_BASE_URL=<your-ollama-url-or-local>
OLLAMA_MODEL=llama3.1
```

**Note:** Replace values with your actual database credentials.

### Step 5: Generate Django Secret Key
Run this locally and paste the output:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### Step 6: Update Frontend
Update your Vercel frontend environment variable:
```
NEXT_PUBLIC_BACKEND_URL=https://sanjeevni-backend.onrender.com
```

---

## Ollama Configuration

### Option 1: Local Ollama (Development Only)
- Run Ollama locally: `ollama serve`
- Set `OLLAMA_BASE_URL=http://localhost:11434` in `.env`

### Option 2: Ollama on a VPS/Server
- Deploy Ollama to a separate server (DigitalOcean, Linode, etc.)
- Set `OLLAMA_BASE_URL=http://your-ollama-server:11434`

### Option 3: Ollama API Service (Recommended for Production)
- Use a hosted Ollama API service or deploy Ollama in a container
- Set the remote URL in environment variables

---

## Local Testing with Docker

To test locally with PostgreSQL in Docker:

```bash
cd backend

# Start services (PostgreSQL + Django backend)
docker-compose up --build

# In another terminal, test the API
curl http://localhost:8000/api/health/
```

To include Ollama in docker-compose:
1. Uncomment the `ollama` service in `docker-compose.yml`
2. Uncomment `ollama_data` volume
3. Run `docker-compose up --build`

---

## Deployment Checklist

- [ ] Create `.env` file with all production values
- [ ] Generate a random `DJANGO_SECRET_KEY`
- [ ] Ensure PostgreSQL is accessible
- [ ] Set `DJANGO_DEBUG=false`
- [ ] Update `CORS_ALLOWED_ORIGINS` with your frontend URL
- [ ] Test `/api/health/` endpoint
- [ ] Test `/api/submit-form/` with a sample submission
- [ ] Test `/api/chat/` if Ollama is available
- [ ] Update Vercel frontend `NEXT_PUBLIC_BACKEND_URL`

---

## Troubleshooting

### Backend returns 502 Bad Gateway
- Check Render logs for errors
- Verify environment variables are set correctly
- Ensure migrations ran successfully

### Chat endpoint returns "Ollama is not available"
- Verify `OLLAMA_BASE_URL` is correct and reachable
- Ensure Ollama service is running
- Check backend logs for HTTP errors

### CORS errors on frontend
- Add your Vercel frontend URL to `CORS_ALLOWED_ORIGINS`
- Ensure it includes `https://` (not just `http://`)

### Signature file upload fails
- Ensure `/signatures` directory exists and is writable
- Check file permissions in the container

---

## Other Deployment Platforms

### Railway.app
1. Sign up at [railway.app](https://railway.app)
2. Connect GitHub repo
3. Add PostgreSQL plugin
4. Configure environment variables
5. Deploy

### Heroku (Paid after Free Tier Sunset)
1. Install Heroku CLI
2. Run `heroku create sanjeevni-backend`
3. Add PostgreSQL: `heroku addons:create heroku-postgresql`
4. Set env vars: `heroku config:set KEY=value`
5. Deploy: `git push heroku main`

### AWS/Azure/Google Cloud
- Use containerized deployment (Docker image on ECS, App Service, Cloud Run)
- Follow platform-specific docs for Django deployment

---

## Monitoring & Logs

**Render.com Logs:**
- Dashboard → Your Service → Logs tab

**Local Docker Logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f db
```

---

## Next Steps

1. Choose a deployment platform
2. Follow the steps above
3. Deploy and test
4. Update frontend URL
5. Monitor logs for issues
