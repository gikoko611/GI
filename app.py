import yt_dlp
import json
import re
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the Cyberpunk frontend

# --- UTILS ---

def get_yt_dlp_options(format_selection):
    """Configures yt-dlp options based on user preference."""
    if format_selection == 'mp3':
        return {
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
            'quiet': True,
        }
    return {
        'format': 'bestvideo+bestaudio/best',
        'quiet': True,
    }

# --- ROUTES ---

@app.route('/api/fetch', methods=['POST'])
def fetch_info():
    """
    Accepts a URL and returns available metadata and formats.
    """
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    ydl_opts = {'quiet': True, 'noplaylist': True}
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Filter formats to return only useful ones (MP4 and Audio)
            formats = []
            for f in info.get('formats', []):
                # We prioritize formats with both audio and video or distinct high quality
                if f.get('vcodec') != 'none' or f.get('ext') == 'mp3':
                    formats.append({
                        'id': f.get('format_id'),
                        'ext': f.get('ext'),
                        'resolution': f.get('resolution') or f.get('format_note'),
                        'filesize': f.get('filesize_approx') or f.get('filesize'),
                        'url': f.get('url') # Direct source link if needed
                    })

            return jsonify({
                "title": info.get('title'),
                "thumbnail": info.get('thumbnail'),
                "duration": info.get('duration'),
                "uploader": info.get('uploader'),
                "formats": formats
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/download', methods=['GET'])
def download():
    """
    Streams the video/audio to the client without saving to local disk.
    Example: /api/download?url=URL&format=mp4&quality=1080p
    """
    video_url = request.args.get('url')
    requested_format = request.args.get('format', 'mp4')
    requested_quality = request.args.get('quality', '1080p')

    if not video_url:
        return "Missing URL", 400

    # Map quality keywords to yt-dlp format strings
    # This logic tries to find the best height match
    height = re.search(r'\d+', requested_quality)
    h_val = height.group() if height else "720"

    ydl_opts = {
        'format': f'bestvideo[height<={h_val}][ext={requested_format}]+bestaudio/best[height<={h_val}]',
        'quiet': True,
        'outtmpl': '-', # Stream to stdout
        'logtostderr': True
    }

    if requested_format == 'mp3':
        ydl_opts['format'] = 'bestaudio/best'
        ydl_opts['postprocessors'] = [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '192',
        }]

    def generate():
        # Using yt-dlp to stream directly to the response
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            filename = f"{info.get('title', 'download')}.{requested_format}"
            
            # Internal function to handle the binary stream
            # We use a subprocess approach via yt-dlp's dynamic nature
            # For a simpler implementation, we'll return the direct URL from the fetch
            # But for true "proxying" (to hide source or bypass geo-blocks):
            return ydl.download([video_url])

    # To provide a real "Download" experience in the browser, 
    # we redirect to the direct media URL extracted by yt-dlp 
    # OR proxy it. For most Web Apps, redirecting to the extracted URL is fastest.
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            
            # Get the best format URL based on user selection
            download_url = info['url'] if 'url' in info else info['formats'][-1]['url']
            
            # This allows the user to download the file with a clean name
            headers = {
                "Content-Disposition": f"attachment; filename={info.get('title', 'video')}.{requested_format}"
            }
            
            # Return a redirect or use a request stream to proxy
            import requests
            req = requests.get(download_url, stream=True)
            return Response(stream_with_context(req.iter_content(chunk_size=1024)), 
                            content_type=req.headers['content-type'],
                            headers=headers)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # GIdownloader Terminal Boot Sequence
    print(" [READY] GIdownloader Backend Uplink Established...")
    print(" [PORT]  Running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)