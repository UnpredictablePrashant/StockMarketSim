import requests
import random
import string
import csv

# API endpoint to add a new user
url = "http://localhost:5000/api/users/register"
csv_file = "user_details.csv"

# Function to generate random email addresses and usernames
def generate_random_user():
    username = ''.join(random.choices(string.ascii_lowercase, k=8))
    email = f"{username}@example.com"
    password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    return {"username": username, "email": email, "password": password}

# Function to add a user using the API
def add_user(user):
    response = requests.post(url, json=user)
    if response.status_code == 201:
        print(f"Added user: {user['username']} - {user['email']}")
        return True
    else:
        print(f"Failed to add user: {user['username']} - {response.status_code} - {response.text}")
        return False

# Function to save user details to CSV
def save_user_to_csv(user, filename):
    with open(filename, mode='a', newline='') as file:
        writer = csv.writer(file)
        writer.writerow([user['username'], user['email'], user['password']])

# Create CSV file with headers
with open(csv_file, mode='w', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Username", "Email", "Password"])

# Adding 500 random users to the API and saving to CSV
for _ in range(500):
    user = generate_random_user()
    if add_user(user):
        save_user_to_csv(user, csv_file)
