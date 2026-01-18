# from playwright.sync_api import sync_playwright

# URL = "http://localhost:8000"

# def run_check():
#     console_msgs = []
#     page_errors = []
#     failed_requests = []

#     with sync_playwright() as p:
#         browser = p.chromium.launch(headless=True)
#         page = browser.new_page()

#         page.on("console", lambda msg: console_msgs.append((msg.type, msg.text)))
#         page.on("pageerror", lambda e: page_errors.append(str(e)))
#         page.on("requestfailed", lambda req: failed_requests.append((req.url, req.failure)))

#         print(f"Navigating to {URL} ...")
#         page.goto(URL, wait_until="networkidle")

#         page.wait_for_timeout(2500)

#         print("\n--- CONSOLE MESSAGES ---")
#         for t, text in console_msgs:
#             print(f"[{t}] {text}")

#         print("\n--- PAGE ERRORS ---")
#         for e in page_errors:
#             print(e)

#         print("\n--- FAILED REQUESTS ---")
#         for url, failure in failed_requests:
#             print(f"{url} => {failure}")

#         browser.close()

# if __name__ == '__main__':
#     try:
#         run_check()
#     except Exception as err:
#         print("Headless check failed:", err)
#         raise