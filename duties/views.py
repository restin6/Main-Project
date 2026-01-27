import random
from django.core.mail import send_mail
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import StaffProfile, ExamSession, Classroom, DutyAssignment
from .serializers import DutyAssignmentSerializer
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken


@api_view(['POST'])
def allocate_duties(request):
    # 1. Get all sessions and staff
    sessions = ExamSession.objects.all()
    rooms = Classroom.objects.all()
    
    # 2. Clear old assignments to start fresh (Optional)
    DutyAssignment.objects.all().delete()

    assignments = []
    
    for session in sessions:
        for room in rooms:
            # Find staff with the least duties who isn't already busy in this session
            staff_to_assign = StaffProfile.objects.order_by('duty_count').first()
            
            if staff_to_assign:
                # Create the assignment
                new_duty = DutyAssignment.objects.create(
                    staff=staff_to_assign,
                    session=session,
                    room=room
                )
                # Increase their count so someone else gets the next turn
                staff_to_assign.duty_count += 1
                staff_to_assign.save()
                assignments.append(new_duty)

    return Response({"message": "Duties allocated successfully!"})

@api_view(['GET'])
def get_duties(request):
    duties = DutyAssignment.objects.all()
    serializer = DutyAssignmentSerializer(duties, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def signup(request):
    data = request.data
    # 1. Check OTP
    saved_otp = otp_storage.get(data.get('email'))
    if data.get('otp') != saved_otp:
        return Response({"error": "Invalid OTP Code"}, status=400)

    try:
        # 2. Create User
        user = User.objects.create_user(
            username=data.get('username'), 
            password=data.get('password'),
            email=data.get('email')
        )
        # 3. Create Profile
        StaffProfile.objects.create(
            user=user, 
            department="General", 
            phone_number=data.get('phone'),
            email=data.get('email')
        )
        return Response({"message": "Staff Registered Successfully!"})
    except Exception as e:
        return Response({"error": str(e)}, status=400)

# This is a built-in Django tool for login
class CustomAuthToken(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'username': user.username
        })

@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')
    if not email:
        return Response({"error": "Email is required"}, status=400)
    
    otp = str(random.randint(100000, 999999))
    otp_storage[email] = otp
    
    # This will print the OTP in your terminal!
    send_mail(
        'Staff Portal OTP',
        f'Your verification code is: {otp}',
        'noreply@examsystem.com',
        [email],
        fail_silently=False,
    )
    return Response({"message": "OTP Sent to Terminal"})