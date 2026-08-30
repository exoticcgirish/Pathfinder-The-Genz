import os
import requests


YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")


def find_playlist(query):

    if not YOUTUBE_API_KEY:
        print("YOUTUBE_API_KEY is missing")
        return None

    url = "https://www.googleapis.com/youtube/v3/search"

    params = {
        "part": "snippet",
        "q": query,
        "type": "playlist",
        "maxResults": 5,
        "order": "relevance",
        "key": YOUTUBE_API_KEY
    }

    try:

        response = requests.get(
            url,
            params=params,
            timeout=10
        )

        response.raise_for_status()

        data = response.json()

        items = data.get("items", [])

        if not items:
            return None

        for item in items:

            playlist_id = (
                item.get("id", {})
                .get("playlistId")
            )

            if not playlist_id:
                continue

            snippet = item.get(
                "snippet",
                {}
            )

            return {
                "type": "playlist",

                "title": snippet.get(
                    "title",
                    "YouTube Playlist"
                ),

                "channel": snippet.get(
                    "channelTitle",
                    ""
                ),

                "playlistId": playlist_id,

                "url": (
                    "https://www.youtube.com/playlist?list="
                    + playlist_id
                ),

                "query": query
            }

        return None

    except requests.exceptions.RequestException as e:

        print(
            "YOUTUBE API ERROR:",
            e
        )

        return None

    except Exception as e:

        print(
            "YOUTUBE ERROR:",
            e
        )

        return None