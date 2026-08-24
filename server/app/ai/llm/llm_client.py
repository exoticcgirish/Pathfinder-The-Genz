import os
import requests


def generate_response(prompt):

    api_key = os.getenv("GEMINI_API_KEY")

    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        "gemini-3.6-flash:generateContent"
        f"?key={api_key}"
    )

    payload = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prompt
                    }
                ]
            }
        ]
    }

    response = requests.post(
        url,
        json=payload,
        timeout=30
    )

    print("STATUS:", response.status_code)
    print("RESPONSE:", response.text)

    if response.status_code != 200:
        return "Gemini API error"

    data = response.json()

    return data["candidates"][0]["content"]["parts"][0]["text"]