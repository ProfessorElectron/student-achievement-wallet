from rest_framework import serializers
from .models import Achievement, StudentProfile

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = "__all__"


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ["wallet_address", "balance"]