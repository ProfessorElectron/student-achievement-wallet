from datetime import date

from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from api.models import Achievement, StudentProfile, Wallet


class Command(BaseCommand):
    help = "Create a stable demo student, wallet, and achievement for the hackathon demo."

    def handle(self, *args, **options):
        user, _ = User.objects.get_or_create(
            username="demo@student.local",
            defaults={
                "email": "demo@student.local",
                "first_name": "Demo",
                "last_name": "Student",
            },
        )
        user.email = "demo@student.local"
        user.first_name = "Demo"
        user.last_name = "Student"
        user.set_password("demo12345")
        user.save()

        StudentProfile.objects.update_or_create(
            user=user,
            defaults={
                "college": "Demo College",
                "department": "Computer Science",
                "year": 3,
                "wallet_address": "",
                "balance": 0,
            },
        )
        Wallet.objects.get_or_create(user=user, defaults={"balance": 0})

        demo_achievements = [
            {
                "title": "Hackathon Winner",
                "issuer": "Demo College Innovation Cell",
                "category": "Innovation",
                "date": date(2026, 6, 5),
                "certificate": "certificates/SHWETARKA_BANERJEE_Certificate.pdf",
                "certificate_code": "SAW-FA46D3A67E",
                "claimed": True,
                "token_id": "1",
                "tx_Hash": "0x11932f7db823fb0f67c06b2aa9876bfc96867da0b30fb9817ac6331c9767cc57",
            },
            {
                "title": "NFT Design & Metadata Standards",
                "issuer": "Web3 Academy",
                "category": "NFT",
                "date": date(2024, 6, 10),
                "certificate": "certificates/web3_academy_nft_metadata.png",
                "certificate_code": "SAW-6C7ACCAF1F",
                "claimed": False,
                "token_id": None,
                "tx_Hash": None,
            },
            {
                "title": "Blockchain & Smart Contracts 101",
                "issuer": "Cryptoverse",
                "category": "Blockchain",
                "date": date(2024, 4, 28),
                "certificate": "certificates/cryptoverse_blockchain_smart_contracts.png",
                "certificate_code": "SAW-2C7B1FC35C",
                "claimed": False,
                "token_id": None,
                "tx_Hash": None,
            },
            {
                "title": "Decentralized Finance Essentials",
                "issuer": "Demo College Finance Lab",
                "category": "DeFi",
                "date": date(2024, 3, 15),
                "certificate": "certificates/defi_essentials_completion.png",
                "certificate_code": "SAW-F82CB00C00",
                "claimed": False,
                "token_id": None,
                "tx_Hash": None,
            },
            {
                "title": "Web3 Development Fundamentals",
                "issuer": "Nexora",
                "category": "Web3",
                "date": date(2024, 5, 20),
                "certificate": "certificates/nexora_web3_development.png",
                "certificate_code": "SAW-4317048481",
                "claimed": False,
                "token_id": None,
                "tx_Hash": None,
            },
        ]

        achievements = []
        for demo in demo_achievements:
            achievement, _ = Achievement.objects.get_or_create(
                student=user,
                title=demo["title"],
                defaults=demo,
            )
            for field, value in demo.items():
                setattr(achievement, field, value)
            achievement.save()
            achievements.append(achievement)

        self.stdout.write(self.style.SUCCESS("Demo account ready"))
        self.stdout.write("Email: demo@student.local")
        self.stdout.write("Password: demo12345")
        for achievement in achievements:
            self.stdout.write(
                f"{achievement.title}: {achievement.certificate_code}"
            )
