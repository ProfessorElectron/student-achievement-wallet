from django.urls import path
from .views import signup, login, get_achievements, claim_certificate, connect_wallet, wallet_info, verify_certificate, record_mint_result

urlpatterns = [
    path("signup/", signup),
    path("login/", login),
    path("achievements/", get_achievements),
    path("achievements/<int:pk>/claim/", claim_certificate),
    path("achievements/<int:pk>/record-mint/", record_mint_result),
    path("connect-wallet/", connect_wallet, name="connect_wallet"),
    path("wallet/", wallet_info, name="wallet_info"),
    path("verify/", verify_certificate, name="verify_certificate"),
]
