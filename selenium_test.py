"""End-to-end login test for Collaborate.

Install Selenium with ``python -m pip install selenium`` and run this file with
``python selenium_test.py``. Chrome and the Collaborate VMs must be running.
"""

import os
import unittest
from urllib.parse import urlparse

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.getenv("COLLABORATE_URL", "http://192.168.56.10:5173").rstrip("/")
USERNAME = os.getenv("COLLABORATE_USERNAME", "ethan")
PASSWORD = os.getenv("COLLABORATE_PASSWORD", "password123")


class CollaborateLoginTest(unittest.TestCase):
    def setUp(self) -> None:
        options = webdriver.ChromeOptions()
        if os.getenv("HEADLESS", "1").lower() not in {"0", "false", "no"}:
            options.add_argument("--headless=new")
        options.add_argument("--window-size=1440,1000")
        self.driver = webdriver.Chrome(options=options)
        self.wait = WebDriverWait(self.driver, 15)

    def tearDown(self) -> None:
        self.driver.quit()

    def test_login_shows_users_available_for_meet_requests(self) -> None:
        self.driver.get(f"{BASE_URL}/log-in")

        username_input = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[autocomplete="username"]'))
        )
        password_input = self.driver.find_element(
            By.CSS_SELECTOR, 'input[autocomplete="current-password"]'
        )
        username_input.send_keys(USERNAME)
        password_input.send_keys(PASSWORD)
        self.driver.find_element(By.CSS_SELECTOR, "form button").click()

        self.wait.until(EC.url_contains("/dashboard"))
        self.wait.until(
            EC.text_to_be_present_in_element((By.CSS_SELECTOR, "h1"), "People to meet")
        )
        meet_buttons = self.wait.until(
            lambda driver: [
                button
                for button in driver.find_elements(By.CSS_SELECTOR, ".card-list .card button")
                if button.text in {"Request to meet", "Requested"}
            ]
        )

        self.assertEqual(urlparse(self.driver.current_url).path, "/dashboard")
        self.assertGreater(
            len(meet_buttons),
            0,
            "Expected at least one user with a meet-request action on the dashboard",
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
