# Sanjeevni Backend

This folder contains the Django + PostgreSQL backend for Sanjeevni AI.

## Structure

- `manage.py` - Django command entrypoint
- `sanjeevni_backend/` - project settings, URLs, ASGI/WSGI config
- `submissions/` - submission models and API views

## Local Setup

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

## API

- `GET /api/health/`
- `POST /api/submit-form/`
- `GET /api/submissions/`
- `POST /api/chat/`

## Notes

- PostgreSQL is the primary database.
- Ollama stays separate in the top-level `ollama/` folder.
- The frontend should call the backend API base URL, not a Node backend.
