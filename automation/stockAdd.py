import requests

# API endpoint to add a new stock
url = "http://localhost:5000/api/stocks"

# Data for 50 stocks
stocks_data = [
    {"symbol": "AAPL", "companyName": "Apple Inc.", "currentPrice": 150.00},
    {"symbol": "MSFT", "companyName": "Microsoft Corp.", "currentPrice": 300.00},
    {"symbol": "GOOGL", "companyName": "Alphabet Inc.", "currentPrice": 2800.00},
    {"symbol": "AMZN", "companyName": "Amazon.com Inc.", "currentPrice": 3500.00},
    {"symbol": "TSLA", "companyName": "Tesla Inc.", "currentPrice": 700.00},
    {"symbol": "FB", "companyName": "Facebook Inc.", "currentPrice": 340.00},
    {"symbol": "BRK.A", "companyName": "Berkshire Hathaway Inc.", "currentPrice": 420000.00},
    {"symbol": "V", "companyName": "Visa Inc.", "currentPrice": 230.00},
    {"symbol": "JNJ", "companyName": "Johnson & Johnson", "currentPrice": 170.00},
    {"symbol": "WMT", "companyName": "Walmart Inc.", "currentPrice": 140.00},
    {"symbol": "JPM", "companyName": "JPMorgan Chase & Co.", "currentPrice": 160.00},
    {"symbol": "MA", "companyName": "Mastercard Inc.", "currentPrice": 370.00},
    {"symbol": "PG", "companyName": "Procter & Gamble Co.", "currentPrice": 140.00},
    {"symbol": "UNH", "companyName": "UnitedHealth Group Inc.", "currentPrice": 400.00},
    {"symbol": "NVDA", "companyName": "NVIDIA Corp.", "currentPrice": 220.00},
    {"symbol": "HD", "companyName": "Home Depot Inc.", "currentPrice": 330.00},
    {"symbol": "DIS", "companyName": "Walt Disney Co.", "currentPrice": 180.00},
    {"symbol": "PYPL", "companyName": "PayPal Holdings Inc.", "currentPrice": 270.00},
    {"symbol": "BAC", "companyName": "Bank of America Corp.", "currentPrice": 40.00},
    {"symbol": "INTC", "companyName": "Intel Corp.", "currentPrice": 55.00},
    {"symbol": "CSCO", "companyName": "Cisco Systems Inc.", "currentPrice": 55.00},
    {"symbol": "CMCSA", "companyName": "Comcast Corp.", "currentPrice": 58.00},
    {"symbol": "VZ", "companyName": "Verizon Communications Inc.", "currentPrice": 60.00},
    {"symbol": "KO", "companyName": "Coca-Cola Co.", "currentPrice": 56.00},
    {"symbol": "PEP", "companyName": "PepsiCo Inc.", "currentPrice": 155.00},
    {"symbol": "PFE", "companyName": "Pfizer Inc.", "currentPrice": 40.00},
    {"symbol": "MRK", "companyName": "Merck & Co. Inc.", "currentPrice": 80.00},
    {"symbol": "T", "companyName": "AT&T Inc.", "currentPrice": 28.00},
    {"symbol": "NFLX", "companyName": "Netflix Inc.", "currentPrice": 580.00},
    {"symbol": "ADBE", "companyName": "Adobe Inc.", "currentPrice": 640.00},
    {"symbol": "CRM", "companyName": "Salesforce.com Inc.", "currentPrice": 250.00},
    {"symbol": "XOM", "companyName": "Exxon Mobil Corp.", "currentPrice": 60.00},
    {"symbol": "CVX", "companyName": "Chevron Corp.", "currentPrice": 110.00},
    {"symbol": "NKE", "companyName": "Nike Inc.", "currentPrice": 160.00},
    {"symbol": "ABT", "companyName": "Abbott Laboratories", "currentPrice": 120.00},
    {"symbol": "LLY", "companyName": "Eli Lilly and Co.", "currentPrice": 250.00},
    {"symbol": "MCD", "companyName": "McDonald's Corp.", "currentPrice": 240.00},
    {"symbol": "NEE", "companyName": "NextEra Energy Inc.", "currentPrice": 85.00},
    {"symbol": "MDT", "companyName": "Medtronic PLC", "currentPrice": 130.00},
    {"symbol": "BMY", "companyName": "Bristol-Myers Squibb Co.", "currentPrice": 60.00},
    {"symbol": "COST", "companyName": "Costco Wholesale Corp.", "currentPrice": 450.00},
    {"symbol": "DHR", "companyName": "Danaher Corp.", "currentPrice": 300.00},
    {"symbol": "AVGO", "companyName": "Broadcom Inc.", "currentPrice": 500.00},
    {"symbol": "UNP", "companyName": "Union Pacific Corp.", "currentPrice": 210.00},
    {"symbol": "HON", "companyName": "Honeywell International Inc.", "currentPrice": 220.00},
    {"symbol": "ORCL", "companyName": "Oracle Corp.", "currentPrice": 90.00},
    {"symbol": "IBM", "companyName": "International Business Machines Corp.", "currentPrice": 140.00},
    {"symbol": "QCOM", "companyName": "Qualcomm Inc.", "currentPrice": 145.00},
    {"symbol": "TXN", "companyName": "Texas Instruments Inc.", "currentPrice": 190.00}
]

# Function to add a stock using the API
def add_stock(stock):
    response = requests.post(url, json=stock)
    if response.status_code == 201:
        print(f"Added stock: {stock['symbol']} - {stock['companyName']}")
    else:
        print(f"Failed to add stock: {stock['symbol']} - {response.status_code}")

# Adding 50 stocks to the API
for stock in stocks_data:
    add_stock(stock)
