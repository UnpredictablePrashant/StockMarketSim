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
open_buy_orders_url = "http://localhost:5000/api/trade/open-buys"
open_sell_orders_url = "http://localhost:5000/api/trade/open-sells"

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

# Simulate the scenario
def simulate_scenario(users):
    # Log in as the four users
    tokens = [login_user(user['email'], user['password']) for user in users[:4]]

    if None in tokens:
        print("Failed to log in one or more users.")
        return

    stocks = fetch_stocks()
    if not stocks:
        print("Failed to fetch stocks.")
        return

    stock_a = stocks[0]  # Assume we're working with the first stock for simplicity

    # Step 1: User A places a buy order for 6 shares at $200
    place_order(tokens[0], stock_a['_id'], 6, 202, 'buy')

    # Step 2: User B places a sell order for 8 shares at $198
    place_order(tokens[1], stock_a['_id'], 8, 204, 'sell')

    # Step 3: User C places a sell order for 10 shares at $202
    place_order(tokens[2], stock_a['_id'], 10, 202, 'sell')

    # Step 4: User D fulfills the orders
    # Fetch open sell orders
    open_sell_orders = fetch_open_orders(tokens[3], 'sell')
    if open_sell_orders:
        # User D buys 8 shares from User B at $198
        place_order(tokens[3], stock_a['_id'], 8, 198, 'buy')

    # Fetch open buy orders
    open_buy_orders = fetch_open_orders(tokens[3], 'buy')
    if open_buy_orders:
        # User D sells 6 shares to User A at $200
        print('Order for the stock: ',stock_a['_id'])
        place_order(tokens[3], stock_a['_id'], 6, 200, 'sell')

    print("Scenario simulation complete.")

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

# Function to read users from CSV file
def read_users_from_csv(filename):
    users = []
    with open(filename, mode='r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            users.append({"username": row["Username"], "email": row["Email"], "password": row["Password"]})
    return users

# Main function to run the scenario
def main():
    users = read_users_from_csv(csv_file)

    if len(users) < 4:
        print("Not enough users in the CSV file.")
        return

    # Simulate the scenario with the first 4 users
    simulate_scenario(users)

if __name__ == "__main__":
    main()
