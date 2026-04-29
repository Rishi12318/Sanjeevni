import base64
import json
from pathlib import Path

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from .models import Submission
from .ollama_client import generate_summary


def _parse_signature(signature_base64: str) -> tuple[bytes, str]:
    if signature_base64.startswith('data:') and ';base64,' in signature_base64:
        header, payload = signature_base64.split(';base64,', 1)
        mime = header.split(':', 1)[1]
        ext = mime.split('/')[-1]
        return base64.b64decode(payload), ext
    return base64.b64decode(signature_base64), 'png'


def health(request):
    return JsonResponse({'ok': True, 'service': 'sanjeevni-backend'})


@csrf_exempt
def submit_form(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    payload = json.loads(request.body.decode('utf-8'))
    signature_base64 = payload.get('signatureBase64') or payload.get('signature_base64')
    role = payload.get('role')

    if not signature_base64:
        return JsonResponse({'error': 'Missing signatureBase64'}, status=400)

    signature_bytes, ext = _parse_signature(signature_base64)
    signatures_dir = Path(settings.BASE_DIR) / 'signatures'
    signatures_dir.mkdir(parents=True, exist_ok=True)

    filename = f'sig_{Submission.objects.count() + 1}.{ext}'
    (signatures_dir / filename).write_bytes(signature_bytes)

    unique_id = None
    if role == 'NGO':
        unique_id = f'NGO-{Submission.objects.count() + 1:06d}'

    ollama_summary = ''
    try:
        ollama_summary = generate_summary(
            f"Summarize this healthcare submission in one short line. Role: {role}. Data: {json.dumps(payload, ensure_ascii=False)}"
        )
    except Exception:
        ollama_summary = ''

    submission = Submission.objects.create(
        role=role,
        email=payload.get('email'),
        phone=payload.get('phone'),
        address=payload.get('address'),
        city=payload.get('city'),
        state=payload.get('state'),
        zip_code=payload.get('zipCode') or payload.get('zip_code'),
        first_name=payload.get('firstName') or payload.get('first_name'),
        last_name=payload.get('lastName') or payload.get('last_name'),
        full_name=payload.get('fullName') or payload.get('full_name'),
        organization_name=payload.get('organizationName') or payload.get('organization_name'),
        medical_license_number=payload.get('medicalLicenseNumber'),
        ngo_registration_number=payload.get('ngoRegistrationNumber'),
        specialization=payload.get('specialization'),
        mission_statement=payload.get('missionStatement'),
        q1=payload.get('q1'),
        q2=payload.get('q2'),
        q3=payload.get('q3'),
        q4=payload.get('q4'),
        signature_filename=filename,
        signature_base64=signature_base64[:100],
        unique_id=unique_id,
        ollama_summary=ollama_summary,
    )

    return JsonResponse({
        'ok': True,
        'id': submission.id,
        'file': filename,
        'uniqueId': unique_id,
        'ollamaSummary': ollama_summary,
    })


def list_submissions(request):
    items = [
        {
            'id': submission.id,
            'role': submission.role,
            'email': submission.email,
            'submittedAt': submission.submitted_at.isoformat(),
            'status': submission.status,
        }
        for submission in Submission.objects.all()[:50]
    ]
    return JsonResponse({'ok': True, 'count': len(items), 'submissions': items})


@csrf_exempt
def chat(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)

    payload = json.loads(request.body.decode('utf-8'))
    message = payload.get('message', '')

    try:
        reply = generate_summary(f'You are a healthcare assistant. Reply briefly and helpfully to: {message}')
    except Exception:
        reply = 'Ollama is not available right now.'

    return JsonResponse({'ok': True, 'reply': reply})