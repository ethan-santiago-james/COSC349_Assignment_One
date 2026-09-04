"""End-to-end registration and login test for Collaborate.

Install Selenium with ``python -m pip install selenium`` and run this file with
``python selenium_test.py``. Chrome and the Collaborate VMs must be running.
"""
# <!--
# Initial implementation generated with OpenAI Codex.
# Reviewed and modified by Ethan James, including changes to
# message styling and sender identification.
# -->

import os
import unittest
from uuid import uuid4
from urllib.parse import urlparse

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


BASE_URL = os.getenv("COLLABORATE_URL", "http://192.168.56.10:5173").rstrip("/")


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

    def test_new_user_can_login_and_see_users_available_for_meet_requests(self) -> None:
        unique_id = uuid4().hex[:12]
        username = f"selenium_{unique_id}"
        password = f"Test-{unique_id}!"

        self.driver.get(f"{BASE_URL}/sign-up")
        signup_inputs = self.wait.until(
            EC.visibility_of_all_elements_located((By.CSS_SELECTOR, "form input"))
        )
        self.assertEqual(len(signup_inputs), 5, "Expected five registration fields")
        signup_inputs[0].send_keys(username)
        signup_inputs[1].send_keys("Selenium")
        signup_inputs[2].send_keys("Test")
        signup_inputs[3].send_keys(f"{username}@example.test")
        signup_inputs[4].send_keys(password)
        self.driver.find_element(By.CSS_SELECTOR, "form button").click()

        self.wait.until(
            EC.text_to_be_present_in_element(
                (By.CSS_SELECTOR, ".success"), "Registration successful"
            )
        )

        self.driver.get(f"{BASE_URL}/log-in")

        username_input = self.wait.until(
            EC.visibility_of_element_located((By.CSS_SELECTOR, 'input[autocomplete="username"]'))
        )
        password_input = self.driver.find_element(
            By.CSS_SELECTOR, 'input[autocomplete="current-password"]'
        )
        username_input.send_keys(username)
        password_input.send_keys(password)
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
        self.assertLessEqual(
            len(meet_buttons),
            5,
            "Expected no more than five users with meet-request actions on the dashboard",
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
