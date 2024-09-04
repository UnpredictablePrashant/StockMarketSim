from locust import HttpUser, TaskSet, task, between

# Define user behavior for the load test
class UserBehavior(TaskSet):

    @task(1)
    def load_home_page(self):
        # Test latency by loading the home page
        self.client.get("/")

    @task(2)
    def load_stocks(self):
        # Test latency by fetching the stocks list
        self.client.get("/api/stocks")

    # @task(3)
    # def load_trade_open_buys(self):
    #     # Test latency for open buy orders
    #     self.client.get("/api/trade/open-buys")

    # @task(4)
    # def load_trade_open_sells(self):
    #     # Test latency for open sell orders
    #     self.client.get("/api/trade/open-sells")

    # @task(5)
    # def load_order_history(self):
    #     # Simulate fetching order history (with auth token if necessary)
    #     token = "your_auth_token_here"
    #     headers = {"Authorization": f"Bearer {token}"}
    #     self.client.get("/api/trade/history", headers=headers)

# Define a user type and the behavior
class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 5)  # Wait between 1 and 5 seconds between tasks
