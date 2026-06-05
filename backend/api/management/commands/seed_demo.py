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

        achievement, _ = Achievement.objects.get_or_create(
            student=user,
            title="Hackathon Winner",
            defaults={
                "issuer": "Demo College Innovation Cell",
                "category": "Innovation",
                "date": date(2026, 6, 5),
                "certificate": "certificates/SHWETARKA_BANERJEE_Certificate.pdf",
                "claimed": False,
            },
        )

        if not achievement.certificate:
            achievement.certificate = "certificates/SHWETARKA_BANERJEE_Certificate.pdf"
            achievement.save()

        self.stdout.write(self.style.SUCCESS("Demo account ready"))
        self.stdout.write("Email: demo@student.local")
        self.stdout.write("Password: demo12345")
        self.stdout.write(f"Certificate code: {achievement.certificate_code}")
