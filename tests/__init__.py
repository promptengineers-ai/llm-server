import ujson
from starlette.testclient import TestClient

from server.api import app

client = TestClient(app)

def disabled(f):
    def _decorator():
        print(f.__name__ + ' has been disabled')
    return _decorator

def get_test_token():
    data = {
        "email": "kre8mymedia@gmail.com",
        "password": "test1234"
    }
    headers = {
        "Content-Type": "application/json",
    }
    response = client.post("/auth/login", json=data, headers=headers)
    json_str = ujson.loads(response.content)
    return json_str['token']