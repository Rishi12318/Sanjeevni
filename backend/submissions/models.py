from django.db import models
from django.contrib.auth.hashers import check_password, make_password


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


class Account(models.Model):
    role = models.CharField(max_length=32)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=256)
    display_name = models.CharField(max_length=256, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def set_password(self, raw_password: str) -> None:
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password_hash)

    def __str__(self) -> str:
        return f'{self.email} ({self.role})'


class Appointment(models.Model):
    doctor_name = models.CharField(max_length=256)
    patient_name = models.CharField(max_length=256, blank=True, null=True)
    patient_email = models.EmailField(blank=True, null=True)
    patient_phone = models.CharField(max_length=32, blank=True, null=True)
    appointment_type = models.CharField(max_length=32, choices=(('physical','physical'),('virtual','virtual')), default='physical')
    hospital = models.CharField(max_length=256, blank=True, null=True)
    date = models.DateField()
    time = models.CharField(max_length=32)
    reason = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'Appointment #{self.pk} with {self.doctor_name} on {self.date} {self.time}'