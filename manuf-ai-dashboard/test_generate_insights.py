import requests

res = requests.post(
    "http://localhost:8000/api/generate_insights",
    json={"Phase": "Compression", "Power": 44.6, "Vibration": 5.3, "Health": 79.0}
)
print(res.status_code)
print(res.text)
