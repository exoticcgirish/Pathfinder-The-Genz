import re


def extract_goal(text):
    text = text.lower().strip()

    patterns = [
        r"want to become a (.+?)(?:\.|,|$)",
        r"want to be a (.+?)(?:\.|,|$)",
        r"become a (.+?)(?:\.|,|$)",
        r"career goal is (.+?)(?:\.|,|$)",
        r"goal is to become a (.+?)(?:\.|,|$)"
    ]

    for pattern in patterns:
        match = re.search(pattern, text)

        if match:
            return match.group(1).strip().title()

    return None