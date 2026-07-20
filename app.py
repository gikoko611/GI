import yt_dlp
import json
import re
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for the Cyberpunk frontend

# --- UTILS ---

def get_yt_dlp_options(format_selection, quality):
    """Configures yt-dlp options based on user preference with flexible quality selection."""
    
    # Quality mapping - fallback to lower quality if requested not available
    quality_map = {
        '4k': '2160',
        '2k': '1440',
        '1080p': '1080',
        '720p': '720',
        '360p': '360'
    }
    
    # Get the height value, default to 720 if not found
    height = quality_map.get(quality, '720')
    
    # Common options for all platforms
    common_opts = {
        'quiet': True,
        'no_warnings': True,
        'ignoreerrors': True,
        'extract_flat': False,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'cookiefile': None,  # Add cookies.txt path if needed for private videos
    }
    
    if format_selection == 'mp3':
        return {
            **common_opts,
            'format': 'bestaudio/best',
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': 'mp3',
                'preferredquality': '192',
            }],
        }
    
    # For video: try requested quality, fallback to lower if not available
    return {
        **common_opts,
        'format': f'bestvideo[height<={height}]+bestaudio/bestvideo[height<={height}]/best',
    }

# --- ROUTES ---

@app.route('/api/fetch', methods=['POST'])
def fetch_info():
    """
    Accepts a URL and returns available metadata and formats.
    Supports: Facebook, Instagram, Twitter (X), TikTok
    """
    data = request.json
    url = data.get('url')

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    ydl_opts = {
        'quiet': True, 
        'noplaylist': True,
        'no_warnings': True,
        'ignoreerrors': True,
        'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Get available formats
            formats_available = []
            for f in info.get('formats', []):
                # Get resolution info
                resolution = f.get('resolution') or f.get('format_note') or 'N/A'
                height = f.get('height') or 0
                
                formats_available.append({
                    'id': f.get('format_id'),
                    'ext': f.get('ext'),
                    'resolution': resolution,
                    'height': height,
                    'filesize': f.get('filesize_approx') or f.get('filesize'),
                    'vcodec': f.get('vcodec') != 'none',
                    'acodec': f.get('acodec') != 'none',
                })

            # Get file size and duration
            filesize = info.get('filesize_approx') or info.get('filesize') or 0
            duration = info.get('duration') or 0

            return jsonify({
                "title": info.get('title', 'Unknown Title'),
                "thumbnail": info.get('thumbnail'),
                "duration": duration,
                "filesize": filesize,
                "uploader": info.get('uploader', 'Unknown'),
                "formats": formats_available
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/download', methods=['GET'])
def download():
    """
    Streams the video/audio to the client with flexible quality selection.
    Falls back to lower quality if requested quality is not available.
    Supports: Facebook, Instagram, Twitter (X), TikTok
    """
    video_url = request.args.get('url')
    requested_format = request.args.get('format', 'mp4')
    requested_quality = request.args.get('quality', '1080p')

    if not video_url:
        return jsonify({"error": "Missing URL"}), 400

    # Quality mapping with fallback
    quality_map = {
        '4k': '2160',
        '2k': '1440',
        '1080p': '1080',
        '720p': '720',
        '360p': '360'
    }
    
    height = quality_map.get(requested_quality, '720')

    try:
        # First, try to get the video info to check available formats
        with yt_dlp.YoutubeDL({'quiet': True, 'no_warnings': True, 'ignoreerrors': True}) as ydl:
            info = ydl.extract_info(video_url, download=False)
            
            # Get available heights from formats
            available_heights = []
            for f in info.get('formats', []):
                h = f.get('height')
                if h and h > 0:
                    available_heights.append(h)
            
            # If requested height not available, use the closest available lower height
            if available_heights:
                available_heights.sort()
                # Find the closest lower or equal height
                best_height = None
                for h in available_heights:
                    if h <= int(height):
                        best_height = h
                    else:
                        break
                
                # If no lower height found, use the minimum available
                if best_height is None:
                    best_height = min(available_heights)
                
                # Update height to actual available height
                height = str(best_height)

        # Build format selector with fallback
        if requested_format == 'mp3':
            ydl_opts = {
                'format': 'bestaudio/best',
                'postprocessors': [{
                    'key': 'FFmpegExtractAudio',
                    'preferredcodec': 'mp3',
                    'preferredquality': '192',
                }],
                'quiet': True,
                'no_warnings': True,
                'ignoreerrors': True,
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        else:
            # For video: try requested height, fallback to best available
            ydl_opts = {
                'format': f'bestvideo[height<={height}]+bestaudio/bestvideo[height<={height}]/best',
                'quiet': True,
                'no_warnings': True,
                'ignoreerrors': True,
                'user_agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            
            # Get the actual download URL
            if 'url' in info:
                download_url = info['url']
            else:
                # Find the best format matching our criteria
                best_format = None
                for f in info.get('formats', []):
                    if requested_format in f.get('ext', ''):
                        if best_format is None or f.get('height', 0) > best_format.get('height', 0):
                            best_format = f
                
                if best_format:
                    download_url = best_format.get('url')
                else:
                    # Fallback to any available format
                    download_url = info.get('formats', [{}])[-1].get('url', '')

            if not download_url:
                return jsonify({"error": "No download URL found"}), 404

            # Get filename
            filename = f"{info.get('title', 'download')}.{requested_format}"
            
            # Stream the file
            import requests
            req = requests.get(download_url, stream=True, headers={
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            })
            
            # Create response with proper headers
            response = Response(
                stream_with_context(req.iter_content(chunk_size=1024)),
                content_type=req.headers.get('content-type', 'application/octet-stream'),
                headers={
                    "Content-Disposition": f"attachment; filename={filename}",
                    "Cache-Control": "no-cache",
                }
            )
            return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health():
    """
    Health check endpoint to verify backend is running.
    """
    return jsonify({
        "status": "online",
        "message": "GIdownloader Backend is live!",
        "supported_platforms": ["Facebook", "Instagram", "Twitter (X)", "TikTok"]
    })

if __name__ == '__main__':
    # GIdownloader Terminal Boot Sequence
    print("  [READY] GIdownloader Backend Uplink Established...")
    print("  [SUPPORT] Facebook, Instagram, Twitter (X), TikTok")
    print("  [PORT]  Running on http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
