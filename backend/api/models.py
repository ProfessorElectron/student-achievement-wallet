from django.db import models
from django.contrib.auth.models import User
import uuid
# Create your models here.

class Achievement(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(
        User,
        on_delete= models.CASCADE
    )

    title = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    date = models.DateField()
    certificate = models.FileField(
        upload_to= "certificates/"
    )

    #FOR VERIFICATION:
    certificate_code = models.CharField(
        max_length=50,
        unique=True,
        blank=True
    )
    
    claimed = models.BooleanField(default = False)
    
    #NFT FIELDS:
    token_id = models.CharField(max_length=100, blank=True, null=True)
    tx_Hash = models.CharField(max_length=200, blank=True, null=True)


    #verification
    def save(self, *args, **kwargs):
        if not self.certificate_code:
            self.certificate_code = f"SAW-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title
    

class StudentProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    college = models.CharField(
        max_length=200
    )

    department = models.CharField(
        max_length=100
    )

    year = models.IntegerField()

    wallet_address = models.CharField(max_length=42, blank=True)

    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

class Wallet(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"{self.user.username} Wallet"
    
class Transaction(models.Model):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    amount = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
