from django.urls import path
from .views import signup, login, get_achievements, claim_certificate, connect_wallet, wallet_info

urlpatterns = [
    path("signup/", signup),
    path("login/", login),
    path("achievements/", get_achievements),
    path("achievements/<int:pk>/claim/", claim_certificate),
    path("connect-wallet/", connect_wallet, name="connect_wallet"),
    path("wallet/", wallet_info, name="wallet_info"),
]
