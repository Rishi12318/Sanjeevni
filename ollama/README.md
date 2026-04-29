# Ollama Integration

Keep all Ollama-specific files here so the frontend and backend stay cleanly separated.

Suggested contents:

- model and prompt configuration
- local Ollama startup notes
- service wiring or adapter code
- environment variable examples

Do not place Ollama code in the frontend `app/` tree or inside the Django backend app.

## Local Setup

```powershell
# Install and run Ollama locally
ollama serve

# In another terminal, pull a model
ollama pull llama3.1
```

Set the backend environment to point at local Ollama:

```bash
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

## Production Setup

- Run Ollama on a separate VM, container host, or hosted endpoint
- Make sure the URL is reachable from the Django backend
- Set `OLLAMA_BASE_URL` in the backend environment to that public URL
- Keep the frontend on Vercel and let it call the backend only

Example:

```bash
OLLAMA_BASE_URL=https://ollama.your-domain.com
OLLAMA_MODEL=llama3.1
```