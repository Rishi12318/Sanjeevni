from django.urls import path

from . import views

urlpatterns = [
    path('health/', views.health),
    path('login/', views.login),
    path('submit-form/', views.submit_form),
    path('submissions/', views.list_submissions),
    path('appointments/book/', views.book_appointment),
    path('chat/', views.chat),
]