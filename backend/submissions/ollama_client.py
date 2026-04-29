import json
from urllib import request as urllib_request

from django.conf import settings


def generate_summary(prompt: str) -> str:
    payload = json.dumps({
        'model': settings.OLLAMA_MODEL,
        'prompt': prompt,
        'stream': False,
    }).encode('utf-8')

    req = urllib_request.Request(
        f'{settings.OLLAMA_BASE_URL}/api/generate',
        data=payload,
        headers={'Content-Type': 'application/json'},
        method='POST',
    )

    with urllib_request.urlopen(req, timeout=30) as response:
        data = json.loads(response.read().decode('utf-8'))

    return data.get('response', '').strip()