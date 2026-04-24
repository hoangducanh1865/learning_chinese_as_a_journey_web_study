import json
import os
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# Database file path
DB_FILE = "mock_data/videos_database.json"
TRANSCRIPTS_DIR = "mock_data"

def extract_youtube_id(url):
    """Extract YouTube video ID from URL"""
    try:
        if 'youtube.com' in url:
            return parse_qs(urlparse(url).query).get('v', [None])[0]
        elif 'youtu.be' in url:
            return urlparse(url).path.lstrip('/')
    except:
        return None
    return None

def list_available_transcripts():
    """List all available transcript files in mock_data folder"""
    transcripts = []
    for file in os.listdir(TRANSCRIPTS_DIR):
        if file.startswith('transcript') and file.endswith('.txt'):
            transcripts.append(file)
    return sorted(transcripts)

def load_database():
    """Load the existing database"""
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {"videos": [], "next_id": 1}

def save_database(data):
    """Save database to file"""
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ Database saved!")

def add_video():
    """Add a new video to the database"""
    print("\n" + "="*50)
    print("ADD NEW VIDEO TO DATABASE")
    print("="*50 + "\n")
    
    # Get YouTube URL
    youtube_url = input("Enter YouTube URL: ").strip()
    youtube_id = extract_youtube_id(youtube_url)
    
    if not youtube_id:
        print("❌ Invalid YouTube URL!")
        return
    
    # Get video title
    title = input("Enter video title: ").strip()
    if not title:
        print("❌ Title cannot be empty!")
        return
    
    # Show available transcripts
    transcripts = list_available_transcripts()
    if not transcripts:
        print("❌ No transcript files found in mock_data folder!")
        return
    
    print(f"\n📄 Available transcripts ({len(transcripts)}):")
    for i, transcript in enumerate(transcripts, 1):
        print(f"  {i}. {transcript}")
    
    # Select transcript
    while True:
        try:
            choice = int(input("\nSelect transcript (enter number): "))
            if 1 <= choice <= len(transcripts):
                selected_transcript = transcripts[choice - 1]
                break
            else:
                print(f"Please enter a number between 1 and {len(transcripts)}")
        except ValueError:
            print("Invalid input!")
    
    # Load and verify transcript exists and has content
    transcript_path = os.path.join(TRANSCRIPTS_DIR, selected_transcript)
    if not os.path.exists(transcript_path):
        print(f"❌ Transcript file not found: {transcript_path}")
        return
    
    if os.path.getsize(transcript_path) == 0:
        print(f"⚠️  Warning: Transcript file is empty!")
        confirm = input("Continue anyway? (y/n): ").lower()
        if confirm != 'y':
            return
    
    # Load database
    db = load_database()
    
    # Check if URL already exists
    for video in db["videos"]:
        if video["youtube_url"] == youtube_url:
            print("❌ This YouTube URL already exists in database!")
            return
    
    # Add new video
    new_video = {
        "id": db["next_id"],
        "title": title,
        "youtube_url": youtube_url,
        "transcript_file": selected_transcript,
        "added_date": datetime.now().strftime("%Y-%m-%d")
    }
    
    db["videos"].append(new_video)
    db["next_id"] += 1
    
    # Save database
    save_database(db)
    
    print(f"\n✓ Video added successfully!")
    print(f"  ID: {new_video['id']}")
    print(f"  Title: {new_video['title']}")
    print(f"  Transcript: {new_video['transcript_file']}")

def view_database():
    """View all videos in database"""
    db = load_database()
    
    if not db["videos"]:
        print("\n📭 Database is empty!")
        return
    
    print("\n" + "="*50)
    print("DATABASE VIDEOS")
    print("="*50 + "\n")
    
    for video in db["videos"]:
        print(f"ID: {video['id']} | {video['title']}")
        print(f"   URL: {video['youtube_url']}")
        print(f"   Transcript: {video['transcript_file']}")
        print(f"   Added: {video['added_date']}\n")

def main():
    """Main menu"""
    while True:
        print("\n" + "="*50)
        print("VIDEO DATABASE MANAGER")
        print("="*50)
        print("1. Add new video")
        print("2. View all videos")
        print("3. Exit")
        
        choice = input("\nSelect option (1-3): ").strip()
        
        if choice == '1':
            add_video()
        elif choice == '2':
            view_database()
        elif choice == '3':
            print("Goodbye!")
            break
        else:
            print("Invalid option!")

if __name__ == "__main__":
    main()
