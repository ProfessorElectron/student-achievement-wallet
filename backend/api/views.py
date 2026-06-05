from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Achievement
from .serializers import AchievementSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Wallet
from rest_framework.permissions import IsAuthenticated, AllowAny
import uuid
from .models import StudentProfile

# Create your views here.
@api_view(["POST"])
@permission_classes([AllowAny])
def signup(request):

    name = request.data.get("name")
    email = request.data.get("email")
    password = request.data.get("password")

    if User.objects.filter(username=email).exists():
        return Response({"error": "Email already exists"},
                        status = status.HTTP_400_BAD_REQUEST
        )
    
    user = User.objects.create_user(
        username = email,
        email = email,
        password = password,
        first_name = name
    )


    StudentProfile.objects.get_or_create(
        user=user,
        defaults={"college": "", "department": "", "year": 1},
    )

    if settings.DEFAULT_FROM_EMAIL:
        send_mail(
            "Welcome to Student Achievement Wallet",
            f"Hello {name}, your account has been created successfully",
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=True,
        )
    return Response({
        "message": "Account created"
    })

#LOGIN API
@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(
        username = email,
        password = password
    )
    if not user:
        return Response(
            {"error": "Invalid credentials"},
            status= 400
        )
    refresh = RefreshToken.for_user(user)
    return Response({
        "access" : str(refresh.access_token),
        "refresh" : str(refresh),
        "user":{
            "id": user.id,
            "name": user.get_full_name() or user.username,
            "email": user.email,
            "role": getattr(user, "role", "student")
        }
        
    })

#ACHIEVEMENT
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_achievements(request):
    user = request.user
    achievements = Achievement.objects.filter(student=user)
    serializer = AchievementSerializer(achievements, many=True)

    return Response(serializer.data)

#CERTIFICATE UPLOAD:
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_certificate(request):

    title = request.data.get("title")
    issuer = request.data.get("issuer")
    category = request.data.get("category")
    date = request.data.get("date")

    certificate = request.FILES.get("certificate")

    achievement = Achievement.objects.create(
        student=request.user,
        title=title,
        issuer=issuer,
        category=category,
        date=date,
        certificate=certificate,
    )

    return Response({
        "message": "Certificate uploaded successfully"
    })

#WALLET API
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_wallet(request):
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    profile, _ = StudentProfile.objects.get_or_create(
        user=request.user,
        defaults={"college": "", "department": "", "year": 1},
    )
    return Response({
        "wallet_address": profile.wallet_address,
        "balance": float(wallet.balance),
    })


#Claim NFT certificate
@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def claim_certificate(request, pk):
    try:
        achievement = Achievement.objects.get(id=pk, student=request.user)

        if achievement.claimed:
            return Response({"error":"Already claimed"}, status=400)
        
        #simulate blockchain data
        achievement.claimed = True
        achievement.token_id = str(uuid.uuid4())[:8]
        achievement.tx_Hash = "0x" + uuid.uuid4().hex[:40]

        achievement.save()

        return Response({
            "message": "NFT claimed successfully",
            "token_id": achievement.token_id,
            "tx_Hash": achievement.tx_Hash,
            "txHash": achievement.tx_Hash,
            "achievement": AchievementSerializer(achievement).data,
        })
    
    except Achievement.DoesNotExist:
        return Response({"error": "Not found"}, status=404)
    


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def connect_wallet(request):

    wallet_address = request.data.get("wallet_address")

    profile, _ = StudentProfile.objects.get_or_create(
        user=request.user,
        defaults={"college": "", "department": "", "year": 1},
    )
    profile.wallet_address = wallet_address
    profile.save()

    return Response({
        "message" : "Wallet connected",
        "wallet_address": wallet_address
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def wallet_info(request):

    profile, _ = StudentProfile.objects.get_or_create(
        user=request.user,
        defaults={"college": "", "department": "", "year": 1},
    )
    wallet, _ = Wallet.objects.get_or_create(user=request.user)
    return Response({
        "wallet_address": profile.wallet_address,
        "balance": float(wallet.balance),
    })
