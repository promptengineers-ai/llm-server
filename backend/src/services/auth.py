import requests
from authlib.integrations.starlette_client import OAuth

from src.config import (OAUTH_GITHUB_CLIENT_ID, OAUTH_GITHUB_CLIENT_SECRET, OAUTH_GITHUB_REDIRECT_URI,
                        OAUTH_AZURE_CLIENT_ID, OAUTH_AZURE_CLIENT_SECRET, OAUTH_AZURE_REDIRECT_URI)

oauth = OAuth()
oauth.register(
    name='github',
    client_id=OAUTH_GITHUB_CLIENT_ID,
    client_secret=OAUTH_GITHUB_CLIENT_SECRET,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri=OAUTH_GITHUB_REDIRECT_URI,
    client_kwargs={'scope': 'user:email'},
)
oauth.register(
    name='azure',
    client_id=OAUTH_AZURE_CLIENT_ID,
    client_secret=OAUTH_AZURE_CLIENT_SECRET,
    authorize_url='https://login.microsoftonline.com/{tenant}/oauth2/v2.0/authorize',
    authorize_params=None,
    access_token_url='https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token',
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri=OAUTH_AZURE_REDIRECT_URI,
    client_kwargs={'scope': 'https://graph.microsoft.com/User.Read'},
)

class   OAuthService:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(OAuthService, cls).__new__(cls)
        return cls._instance
    
    def __init__(self, provider: str):
        self.provider = provider
        self.oauth = oauth.create_client(provider)
        
    def _callback_from_github(self, code: str):
        token_url = "https://github.com/login/oauth/access_token"
        params = {
            "client_id": OAUTH_GITHUB_CLIENT_ID,
            "client_secret": OAUTH_GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": OAUTH_GITHUB_REDIRECT_URI   
        }
        headers = {"Accept": "application/json"}
        response = requests.post(token_url, data=params, headers=headers)
        access_token = response.json().get("access_token")
        # Use the access token to fetch the user's GitHub profile
        user_info = requests.get("https://api.github.com/user", headers={
            "Authorization": f"token {access_token}"
        }).json()
        user_emails = requests.get("https://api.github.com/user/emails", headers={
            "Authorization": f"token {access_token}"
        }).json()
        
        return {
            **user_info,
            "emails": user_emails
        }
        
    def _callback_from_azure(self, code: str, tenant: str = '75b7a514-45e1-4394-a52a-0935cc22e0b1'):
        token_url = f"https://login.microsoftonline.com/{tenant}/oauth2/v2.0/token"
        params = {
            "client_id": OAUTH_AZURE_CLIENT_ID,
            "client_secret": OAUTH_AZURE_CLIENT_SECRET,
            "code": code,
            "redirect_uri": OAUTH_AZURE_REDIRECT_URI,
            "grant_type": "authorization_code",
            "scope": "https://graph.microsoft.com/User.Read"
        }
        headers = {"Content-Type": "application/x-www-form-urlencoded"}
        response = requests.post(token_url, data=params, headers=headers)
        access_token = response.json().get("access_token")
        user_info = requests.get("https://graph.microsoft.com/v1.0/me", headers={
            "Authorization": f"Bearer {access_token}"
        }).json()
        
        return user_info
        
    def login(self, code: str):
        try:
            if self.provider == 'github':
                return self._callback_from_github(code)
            elif self.provider == 'azure':
                return self._callback_from_azure(code)
            raise ValueError('Provider not found')
        except Exception as e:
            return Exception({'error': str(e)})
        