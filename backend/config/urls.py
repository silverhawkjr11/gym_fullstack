from django.contrib import admin
from django.http import JsonResponse
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import MeView  # new
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


def health(_):
    return JsonResponse({"status": "ok"})


def api_root(_):
    return JsonResponse({
        "message": "Welcome to Gym Fullstack API!",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "admin": "/admin/",
            "swagger": "/api/swagger/",
            "redoc": "/api/redoc/",
            "auth": {
                "login": "/api/auth/token/",
                "refresh": "/api/auth/token/refresh/"
            },
            "user": "/api/me",
            "training": "/api/training/",
            "users": "/api/users/"
        }
    })


urlpatterns = [
    path("", api_root),  # Root endpoint
    path("admin/", admin.site.urls),
    
    # API Documentation
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/swagger/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    
    # API Endpoints
    path("api/health", health),
    path("api/auth/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/me", MeView.as_view(), name="me"),
    path("api/training/", include("training.urls")),
    path("api/users/", include("users.urls")),
]
