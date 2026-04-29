# 🏥 Sanjeevni AI - Complete Healthcare Platform

A modern healthcare workspace with a separate frontend app, separate backend service, and a separate Ollama integration area.

## Repository Split

- The root Next.js app should hold only UI code.
- `backend/` should hold the Python Django + PostgreSQL service.
- `ollama/` should hold Ollama-specific configuration, prompts, or service glue.
- Backend/API code should not live inside the Next.js `app/api/` tree.

## 🎯 Project Structure

```
SanjeevniAI/
├── backend/                    # Python Django + PostgreSQL service
├── app/                        # Root Next.js frontend
├── ollama/                     # Ollama integration and model config
└── WORKING_DEMO.md
```

## ✨ Features

### Frontend (Windows Compatible)
- ✅ **Responsive Web Design** - Works on all devices and browsers
- ✅ **Tailwind CSS** - Modern, beautiful UI matching the iOS design
- ✅ **Multi-Step Form** - 3-step professional profile completion
- ✅ **Signature Capture** - HTML5 Canvas for touch/mouse signatures
- ✅ **Role-Based Flow** - Different forms for Doctor/NGO
- ✅ **Real-Time Validation** - Client-side form validation
- ✅ **Loading States** - Visual feedback during submission

### Backend
- ✅ **Separate service boundary** - Keep API code out of the frontend tree
- ✅ **PostgreSQL storage** - Use Django models and migrations for persisted data
- ✅ **Ollama isolation** - Keep model config and prompts in their own folder

## 🚀 Quick Start

### 1. Start the Backend Server

```powershell
cd backend
python manage.py runserver
```

✅ Backend running at: **http://localhost:8000**

### 2. Start the Frontend Server

```powershell
cd frontend
npm install
node server.js
```

✅ Frontend running at: **http://localhost:8080**

### 3. Open in Browser

Navigate to: **http://localhost:8080**

## 📱 Complete User Flow

### Get Started → Choose Role → Sign In → Complete Profile → Dashboard

1. **Get Started Page** (`/`)
   - Welcome screen with feature highlights
   - Dynamic greeting based on time
   - Smooth animations and transitions

2. **Role Selection** (`/roles`)
   - Choose: User, Doctor, or NGO
   - Visual role cards with icons
   - Interactive selection feedback

3. **Login Page** (`/login`)
   - Email and password fields
   - Role-specific welcome message
   - Toggle password visibility
   - Demo mode: accepts any credentials

4. **Professional Form** (`/form`) - For Doctor/NGO only
   - **Step 1**: Credentials
     - Full Name / NGO Name
     - License # / Registration #
   
   - **Step 2**: Professional Details
     - Specialization / Area of Operation
     - Hospital / Contact Person
   
   - **Step 3**: Digital Signature
     - HTML5 Canvas drawing
     - Mouse and touch support
     - Clear/reset functionality
     - Converts to base64 PNG

5. **Dashboard** (`/dashboard`)
   - Success confirmation
   - View saved signatures
   - Account management

## 🎨 Design Features

### Colors (Matching iOS App)
- **Primary**: Teal (`#14b8a6`)
- **Doctor Role**: Blue (`#3b82f6`)
- **NGO Role**: Indigo (`#6366f1`)
- **Gradients**: Smooth color transitions

### Fonts
- **Body**: Inria Serif (matching iOS)
- **Headings**: Caveat (cursive, matching iOS)

### UI Components
- Rounded corners (3xl radius)
- Soft shadows
- Hover effects
- Scale animations
- Gradient backgrounds

## 📡 API Integration

### Backend Endpoint

**POST** `http://localhost:8000/api/submit-form/`

**Request Body:**
```json
{
  "role": "Doctor",
  "q1": "Dr. Jane Doe",
  "q2": "LICENSE-12345",
  "q3": "Cardiology",
  "q4": "City Hospital",
  "signatureBase64": "data:image/png;base64,iVBORw0KGgo..."
}
```

**Success Response:**
```json
{
  "ok": true,
  "file": "sig_1234567890.png"
}
```

### Data Storage

Signatures saved in `backend/signatures/`:
- `sig_[timestamp].png` - Signature image
- `sig_[timestamp].png.json` - Form metadata

Example metadata:
```json
{
  "filename": "sig_1234567890.png",
  "role": "Doctor",
  "q1": "Dr. Jane Doe",
  "q2": "LICENSE-12345",
  "q3": "Cardiology",
  "q4": "City Hospital",
  "createdAt": "2025-11-01T06:09:14.776Z"
}
```

## 🧪 Testing

### Manual Testing

1. Open http://localhost:8080 in your browser
2. Click "Get Started"
3. Select a role (Doctor or NGO)
4. Sign in with any email/password
5. Fill the 3-step form
6. Draw your signature
7. Submit and verify success

### Verify Saved Data

Check the `backend/signatures/` folder:
```powershell
cd backend\signatures
dir
```

You should see `.png` and `.json` files.

### API Testing

```powershell
cd backend
node test-submission.js
```

## 🌐 Browser Compatibility

✅ Chrome, Edge, Firefox, Safari  
✅ Desktop and Mobile  
✅ Touch and Mouse input  
✅ Windows, macOS, Linux  

## 📂 Files Created

### Frontend
- ✅ `app/` - Root Next.js frontend

### Backend
- ✅ `backend/` - Separate backend service folder

### Ollama
- ✅ `ollama/` - Separate Ollama service folder

## 🔧 Configuration

### Change Ports

**Backend** (default: 8000):
```javascript
// backend/settings.py or backend/manage.py
const port = process.env.PORT || 8000;
```

**Frontend** (default: 3000):
```javascript
// next dev / next start
const PORT = process.env.PORT || 3000;
```

### Change Backend URL

If backend runs on a different port/host, point the frontend to the Django API base URL.

## 🚀 Deployment

### Deploy Backend
- Deploy the Django service separately from the frontend
- Set your PostgreSQL connection variables in the backend environment
- Point the frontend at the backend API base URL

### Deploy Frontend on Vercel
- Deploy the root Next.js app to Vercel
- Add a Vercel environment variable:

```bash
NEXT_PUBLIC_BACKEND_URL=https://your-backend-domain.com
```

- Add the Vercel domain to `CORS_ALLOWED_ORIGINS` in the Django backend
- Redeploy the frontend after changing environment variables

### Deploy Ollama
- Keep Ollama config and local model wiring in `ollama/`
- Run it as a separate local or containerized service
- In production, use a reachable Ollama URL and set `OLLAMA_BASE_URL` in the backend environment
- The frontend never talks to Ollama directly; it only talks to the backend

### Recommended Production Split
- Frontend: Vercel
- Backend: Render, Railway, or another Python host
- Ollama: Separate container, VM, or hosted Ollama endpoint
- Database: Managed PostgreSQL

### Deploy Frontend
- Deploy the root Next.js app to Vercel or another Next.js host
- Point the frontend at the Django API base URL

## 🔒 Security Considerations

⚠️ **This is a development setup.**

For production:
- [ ] Add authentication (JWT tokens)
- [ ] Implement HTTPS
- [ ] Add database (MongoDB/PostgreSQL)
- [ ] Validate file uploads
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] Error logging
- [ ] Backup system

## 📊 Features Comparison

| Feature | iOS (Old) | Split Web Stack |
|---------|----------|---------------|
| Platform | macOS/iOS only | ✅ Windows, Mac, Linux, Mobile |
| Language | Swift | JavaScript |
| UI Framework | SwiftUI | HTML + Tailwind CSS |
| Signature | Canvas (Swift) | HTML5 Canvas |
| Backend | Node.js | Django + PostgreSQL |
| Database | None | PostgreSQL |
| Authentication | Demo | Demo |
| Responsive | Fixed | ✅ Responsive |

## 🎯 Next Steps

- [ ] Add user authentication
- [ ] Implement database storage
- [ ] Add email verification
- [ ] Create admin panel
- [ ] Add data export
- [ ] Implement search functionality
- [ ] Add file upload validation
- [ ] Create mobile app (React Native)

## 📝 Notes

- Frontend, backend, and Ollama run as separate services
- Backend must be running for form submission to work
- Demo mode: any email/password works for testing
- Keep API and model code out of the frontend tree

## 🎉 Summary

✅ **Frontend separated from backend**  
✅ **Django/PostgreSQL backend planned as a separate service**  
✅ **Ollama isolated in its own folder**  
✅ **Windows compatible**  
✅ **Signature capture implemented**  

**The system is now fully operational on Windows!** 🚀
