from django.db import models


class Submission(models.Model):
    role = models.CharField(max_length=32, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=32, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=128, blank=True, null=True)
    state = models.CharField(max_length=128, blank=True, null=True)
    zip_code = models.CharField(max_length=20, blank=True, null=True)

    first_name = models.CharField(max_length=128, blank=True, null=True)
    last_name = models.CharField(max_length=128, blank=True, null=True)
    full_name = models.CharField(max_length=256, blank=True, null=True)
    organization_name = models.CharField(max_length=256, blank=True, null=True)
    medical_license_number = models.CharField(max_length=128, blank=True, null=True)
    ngo_registration_number = models.CharField(max_length=128, blank=True, null=True)
    specialization = models.CharField(max_length=256, blank=True, null=True)
    mission_statement = models.TextField(blank=True, null=True)

    q1 = models.TextField(blank=True, null=True)
    q2 = models.TextField(blank=True, null=True)
    q3 = models.TextField(blank=True, null=True)
    q4 = models.TextField(blank=True, null=True)

    signature_filename = models.CharField(max_length=255)
    signature_base64 = models.TextField(blank=True, null=True)
    unique_id = models.CharField(max_length=128, blank=True, null=True)
    ollama_summary = models.TextField(blank=True, null=True)

    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=32, default='pending')

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self) -> str:
        return f'{self.role or "Submission"} #{self.pk}'