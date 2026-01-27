from django.contrib import admin
from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token # Add this
from duties.views import allocate_duties, get_duties
from duties.views import signup

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', obtain_auth_token), # This is the "Door" for React
    path('api/signup/', signup),
    path('api/allocate/', allocate_duties),
    path('api/duties/', get_duties),
    path('api/send-otp/', send_otp),
]