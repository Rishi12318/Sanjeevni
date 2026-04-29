from django.urls import path

from . import views

urlpatterns = [
    path('health/', views.health),
    path('submit-form/', views.submit_form),
    path('submissions/', views.list_submissions),
    path('chat/', views.chat),
]