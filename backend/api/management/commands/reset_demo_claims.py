from django.core.management.base import BaseCommand

from api.models import Achievement


class Command(BaseCommand):
    help = "Reset demo certificates so only Hackathon Winner is pre-claimed."

    def handle(self, *args, **options):
        claimed = Achievement.objects.filter(title="Hackathon Winner").update(
            claimed=True,
            token_id="1",
            tx_Hash="0x11932f7db823fb0f67c06b2aa9876bfc96867da0b30fb9817ac6331c9767cc57",
        )
        unclaimed = Achievement.objects.exclude(title="Hackathon Winner").update(
            claimed=False,
            token_id=None,
            tx_Hash=None,
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Demo claims reset: {claimed} claimed, {unclaimed} unclaimed."
            )
        )
