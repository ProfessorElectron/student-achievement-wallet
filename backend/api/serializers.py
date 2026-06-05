from rest_framework import serializers
from .models import Achievement, StudentProfile

class AchievementSerializer(serializers.ModelSerializer):
    txHash = serializers.CharField(source="tx_Hash", read_only=True)
    score = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = [
            "id",
            "student",
            "title",
            "issuer",
            "category",
            "score",
            "date",
            "certificate",
            "certificate_code",
            "claimed",
            "token_id",
            "tx_Hash",
            "txHash",
        ]

    def get_score(self, achievement):
        return "NFT claimed" if achievement.claimed else "Ready to claim"


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentProfile
        fields = ["wallet_address", "balance"]
