from cryptography.fernet import Fernet

from server.config import APP_SECRET

def encrypt(data: str) -> str:
	return Fernet(APP_SECRET).encrypt(data.encode()).decode()

def decrypt(data: str) -> str:
	return Fernet(APP_SECRET).decrypt(data.encode()).decode()

