import json
from urllib.error import URLError
from urllib import request as urllib_request

from django.conf import settings


def generate_summary(prompt: str) -> str:
    base_url = settings.OLLAMA_BASE_URL.rstrip('/')
    payload = json.dumps({
        'model': settings.OLLAMA_MODEL,
        'prompt': prompt,
        'stream': False,
    }).encode('utf-8')

    req = urllib_request.Request(
        f'{base_url}/api/generate',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )

    try:
        with urllib_request.urlopen(req, timeout=30) as response:
            data = json.loads(response.read().decode('utf-8'))
    except URLError as exc:
        raise RuntimeError(f'Ollama request failed for {base_url}: {exc}') from exc

    # Ollama responses may vary across versions; try common fields
    if isinstance(data, dict):
        # Newer Ollama: 'response' or 'output' keys
        if 'response' in data and isinstance(data['response'], str):
            return data['response'].strip()
        if 'output' in data and isinstance(data['output'], str):
            return data['output'].strip()
        # Older/alternative shape: results -> content -> text
        results = data.get('results') or data.get('outputs')
        if isinstance(results, list) and results:
            first = results[0]
            # content may be a list of chunks
            content = first.get('content') or first.get('output')
            if isinstance(content, list):
                texts = [c.get('text') for c in content if isinstance(c, dict) and 'text' in c]
                if texts:
                    return ' '.join(texts).strip()
            # fallback to 'text' directly
            if isinstance(first.get('text'), str):
                return first.get('text').strip()

    # Final fallback: stringify whole response
    return json.dumps(data)[:1000]