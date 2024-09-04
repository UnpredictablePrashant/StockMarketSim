import requests
import time

# List of endpoints to test
endpoints = [
    {"name": "Login", "url": "http://localhost:5000/api/users/login", "method": "POST", "data": {"email": "test@example.com", "password": "password"}},
    {"name": "Stocks", "url": "http://localhost:5000/api/stocks", "method": "GET"},
    {"name": "Trade Open Buys", "url": "http://localhost:5000/api/trade/open-buys", "method": "GET"},
    {"name": "Trade Open Sells", "url": "http://localhost:5000/api/trade/open-sells", "method": "GET"},
    {"name": "Order History", "url": "http://localhost:5000/api/trade/history", "method": "GET"}
]

# Optional: Add authentication headers if needed
auth_token = "your_auth_token"
headers = {
    "Authorization": f"Bearer {auth_token}",
    "Content-Type": "application/json"
}

# Function to measure latency for each endpoint
def measure_latency(endpoint):
    try:
        start_time = time.time()

        # Send a request based on the method type
        if endpoint["method"] == "GET":
            response = requests.get(endpoint["url"], headers=headers)
        elif endpoint["method"] == "POST":
            response = requests.post(endpoint["url"], json=endpoint["data"], headers=headers)

        end_time = time.time()
        latency = (end_time - start_time) * 1000  # Latency in milliseconds
        return latency, response.status_code

    except Exception as e:
        print(f"Error while accessing {endpoint['name']}: {e}")
        return None, None

# Main function to test the latency of all endpoints
def test_latency():
    for endpoint in endpoints:
        latency, status_code = measure_latency(endpoint)
        if latency is not None:
            print(f"Latency for {endpoint['name']}: {latency:.2f} ms (Status Code: {status_code})")
        else:
            print(f"Failed to measure latency for {endpoint['name']}.")

if __name__ == "__main__":
    test_latency()
