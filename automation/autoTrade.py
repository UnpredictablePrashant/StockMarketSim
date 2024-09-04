import requests
import random
import csv
import threading
import time
from datetime import datetime, timedelta

# API endpoints
login_url = "http://localhost:5000/api/users/login"
stocks_url = "http://localhost:5000/api/stocks"
orders_url = "http://localhost:5000/api/trade/order"
open_buy_orders_url = "http://localhost:5000/api/trade/open-buys"  # Endpoint to fetch open buy orders
open_sell_orders_url = "http://localhost:5000/api/trade/open-sells"  # Endpoint to fetch open sell orders

# CSV file containing user credentials
csv_file = "user_details.csv"

# Function to log in a user
def login_user(email, password):
    credentials = {"email": email, "password": password}
    response = requests.post(login_url, json=credentials)
    if response.status_code == 200:
        token = response.json().get('token')
        print(f"Logged in as {email}")
        return token
    else:
        print(f"Failed to log in {email}: {response.status_code} - {response.text}")
        return None

# Fetch all stocks
def fetch_stocks():
    response = requests.get(stocks_url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch stocks: {response.status_code} - {response.text}")
        return []

# Fetch open orders
def fetch_open_orders(token, order_type):
    headers = {'Authorization': f'Bearer {token}'}
    url = open_buy_orders_url if order_type == 'buy' else open_sell_orders_url
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Failed to fetch open {order_type} orders: {response.status_code} - {response.text}")
        return []

# Place a buy or sell order
def place_order(token, stock_id, quantity, price, order_type):
    order = {
        "stockId": stock_id,
        "quantity": quantity,
        "price": price,
        "type": order_type
    }
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.post(orders_url, json=order, headers=headers)
    if response.status_code == 201:
        print(f"Order placed: {order_type.upper()} {quantity} of {stock_id} at ${price}")
    else:
        print(f"Failed to place order: {response.status_code} - {response.text}")

# Auto-trade for a given user for 5 seconds
def auto_trade(user, duration_seconds=5):
    token = login_user(user['email'], user['password'])
    if not token:
        return
    
    stocks = fetch_stocks()
    if not stocks:
        return

    open_orders = fetch_open_orders(token, 'buy') + fetch_open_orders(token, 'sell')
    if len(open_orders) >= 10:
        print("Too many open orders. Attempting to fulfill existing orders.")
        fulfill_open_orders(token, open_orders)
        return
    
    end_time = datetime.now() + timedelta(seconds=duration_seconds)

    while datetime.now() < end_time:
        stock = random.choice(stocks)
        quantity = random.randint(1, 10)  # Random quantity between 1 and 10
        price = round(stock['currentPrice'] * (random.uniform(0.95, 1.05)), 2)  # Random price within 5% of current price
        order_type = random.choice(['buy', 'sell'])

        place_order(token, stock['_id'], quantity, price, order_type)

        time.sleep(random.uniform(0.5, 2))  # Random delay between 0.5 and 2 seconds

# Function to fulfill open orders
def fulfill_open_orders(token, open_orders):
    for order in open_orders:
        opposite_type = 'sell' if order['type'] == 'buy' else 'buy'
        place_order(token, order['stock']['_id'], order['quantity'], order['price'], opposite_type)
        print(f"Fulfilled order: {opposite_type.upper()} {order['quantity']} of {order['stock']['_id']} at ${order['price']}")

# Thread to continuously fulfill open buy orders
def fulfill_open_buy_orders(user, duration_seconds=10):
    token = login_user(user['email'], user['password'])
    if not token:
        return
    
    end_time = datetime.now() + timedelta(seconds=duration_seconds)
    
    while datetime.now() < end_time:
        open_buy_orders = fetch_open_orders(token, 'buy')
        if open_buy_orders:
            fulfill_open_orders(token, open_buy_orders)
        time.sleep(random.uniform(1, 3))  # Wait a bit before trying again

# Thread to continuously fulfill open sell orders
def fulfill_open_sell_orders(user, duration_seconds=10):
    token = login_user(user['email'], user['password'])
    if not token:
        return
    
    end_time = datetime.now() + timedelta(seconds=duration_seconds)
    
    while datetime.now() < end_time:
        open_sell_orders = fetch_open_orders(token, 'sell')
        if open_sell_orders:
            fulfill_open_orders(token, open_sell_orders)
        time.sleep(random.uniform(1, 3))  # Wait a bit before trying again

# Function to read users from CSV file
def read_users_from_csv(filename):
    users = []
    with open(filename, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            users.append({"username": row["Username"], "email": row["Email"], "password": row["Password"]})
    return users

# Main function to start auto-trading with multiple threads
def main():
    users = read_users_from_csv(csv_file)
    threads = []

    for _ in range(5):  # Number of concurrent threads (users) for placing orders
        user = random.choice(users)
        t = threading.Thread(target=auto_trade, args=(user, 5))  # Trading duration set to 5 seconds
        threads.append(t)
        t.start()

    # Add 2 threads for fulfilling open buy and sell orders
    for _ in range(2):  # These threads will focus on fulfilling orders
        user = random.choice(users)
        t_buy = threading.Thread(target=fulfill_open_buy_orders, args=(user, 10))  # Fulfillment duration set to 10 seconds
        t_sell = threading.Thread(target=fulfill_open_sell_orders, args=(user, 10))  # Fulfillment duration set to 10 seconds
        threads.append(t_buy)
        threads.append(t_sell)
        t_buy.start()
        t_sell.start()

    for t in threads:
        t.join()

if __name__ == "__main__":
    main()
