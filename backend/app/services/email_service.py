import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()


def send_verification_email(email: str, token: str):

    verify_link = (
        f"{os.getenv('FRONTEND_URL')}"
        f"/verify?token={token}"
    )

    sender_email = os.getenv("EMAIL_USER")
    sender_password = os.getenv("EMAIL_PASS")

    message = MIMEMultipart("alternative")

    message["Subject"] = "Verify your Narratrix account"
    message["From"] = sender_email
    message["To"] = email

    html = f"""
    <h2>Welcome to Narratrix 📚</h2>

    <p>Click below to verify your email:</p>

    <a href="{verify_link}">
        Verify Email
    </a>
    """

    part = MIMEText(html, "html")

    message.attach(part)

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)

        server.sendmail(
            sender_email,
            email,
            message.as_string()
        )