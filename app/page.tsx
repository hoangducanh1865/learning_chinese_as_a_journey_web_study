"use client";
import React, { useState, useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';
import { parseSync } from 'subtitle';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: {
      Player: any;
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
  }
}

const YOUTUBE_VIDEO_ID = "IU4Sw07L9PU";

export default function Home() {
  const [selectedWord, setSelectedWord] = useState("");
  const [dictionary, setDictionary] = useState<any>({});
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [currentSub, setCurrentSub] = useState("");
  const [wordData, setWordData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [charIndex, setCharIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  const writerRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    fetch('/data/dictionary.json').then(res => res.json()).then(data => setDictionary(data)).catch(() => {});
    fetch('/data/sub.srt').then(res => res.text()).then(text => {
      try {
        const nodes = parseSync(text);
        setSubtitles(nodes.filter((n: any) => n.type === 'cue'));
      } catch (e) {}
    }).catch(() => {});

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

    // Setup player tracking
    let player: any;
    window.onYouTubeIframeAPIReady = () => {
      const iframe = document.getElementById('youtube-player') as HTMLIFrameElement;
      if (iframe) {
        player = new window.YT!.Player('youtube-player', {
          events: {
            'onStateChange': (event: any) => {
              if (event.data === window.YT!.PlayerState.PLAYING) {
                const interval = setInterval(() => {
                  if (player?.getCurrentTime) {
                    setCurrentTime(player.getCurrentTime() * 1000);
                  }
                }, 500);
                return () => clearInterval(interval);
              }
            }
          }
        });
      }
    };

    return () => {
      delete window.onYouTubeIframeAPIReady;
    };
  }, []);

  const handleProgress = (state: { playedSeconds: number }) => {
    const time = state.playedSeconds * 1000;
    const activeSub = subtitles.find(s => time >= s.data.start && time <= s.data.end);
    setCurrentSub(activeSub ? activeSub.data.text : "");
  };

  useEffect(() => {
    const activeSub = subtitles.find(s => currentTime >= s.data.start && currentTime <= s.data.end);
    setCurrentSub(activeSub ? activeSub.data.text : "");
  }, [currentTime, subtitles]);

  const renderHanzi = (char: string) => {
    const target = document.getElementById('hanzi-target');
    if (target && char) {
      target.innerHTML = '';
      writerRef.current = HanziWriter.create('hanzi-target', char, {
        width: 180, height: 180, padding: 10, showOutline: true,
        strokeColor: '#dc2626', outlineColor: '#e2e8f0',
      });
      writerRef.current.animateCharacter();
    }
  };

  const lookupWord = async (word: string) => {
    if (!word) return;
    setSelectedWord(word);
    setCharIndex(0);
    setLoading(true);

    if (dictionary[word]) {
      setWordData(dictionary[word]);
      renderHanzi(word[0]);
      setLoading(false);
    } else {
      try {
        const res = await fetch('/api/dictionary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ word })
        });
        const aiData = await res.json();
        setWordData(aiData);
        renderHanzi(word[0]);
      } catch (e) {
        setWordData({ vietnamese: ["Lỗi kết nối AI"], pinyin: "error" });
      }
      setLoading(false);
    }
  };

  const changeChar = (direction: number) => {
    const newIndex = charIndex + direction;
    if (newIndex >= 0 && newIndex < selectedWord.length) {
      setCharIndex(newIndex);
      renderHanzi(selectedWord[newIndex]);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-slate-50 text-slate-900">
      <h1 className="text-3xl font-bold mb-6">HUST CHINESE LEARNING</h1>
      
      <div className="mb-6">
        <a href="/videos" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition inline-block">
          Xem danh sách video
        </a>
      </div>
      
      <div className="mb-8 text-center text-slate-600">
        <p className="text-lg">Hoặc xem video đầu tiên bên dưới:</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-black rounded-2xl overflow-hidden aspect-video relative border-4 border-white shadow-xl">
            <iframe
              id="youtube-player"
              ref={playerRef}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?enablejsapi=1`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <div className="bg-white p-6 rounded-xl shadow border min-h-[100px] flex items-center justify-center">
            <div className="text-4xl flex flex-wrap justify-center gap-2">
              {currentSub ? currentSub.split('').map((char, i) => (
                <span key={i} onClick={() => lookupWord(char)} className="cursor-pointer hover:text-red-600 px-2">{char}</span>
              )) : <span className="text-slate-400 italic">Chờ phụ đề...</span>}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center border border-slate-100">
          <input 
            type="text" 
            placeholder="Nhập từ..." 
            className="w-full p-3 border-2 rounded-xl mb-6 outline-none focus:border-blue-400"
            onKeyDown={(e: any) => e.key === 'Enter' && lookupWord(e.target.value)}
          />

          <div id="hanzi-target" className="bg-slate-50 border-2 border-dashed border-red-200 rounded-xl mb-4"></div>

          {selectedWord.length > 1 && (
            <div className="flex items-center gap-4 mb-6 bg-slate-100 p-2 rounded-full border">
              <button onClick={() => changeChar(-1)} disabled={charIndex === 0} className="px-4 py-1 bg-white rounded-full font-bold disabled:opacity-30">Trước</button>
              <span className="font-bold">{charIndex + 1} / {selectedWord.length}</span>
              <button onClick={() => changeChar(1)} disabled={charIndex === selectedWord.length - 1} className="px-4 py-1 bg-white rounded-full font-bold disabled:opacity-30">Sau</button>
            </div>
          )}

          {loading ? <p>Đang tải...</p> : wordData && (
            <div className="w-full space-y-4">
              <div className="flex gap-2">
                <button onClick={() => writerRef.current?.animateCharacter()} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold">Mẫu</button>
                <button onClick={() => writerRef.current?.quiz()} className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Viết</button>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl space-y-3 border shadow-inner">
                <div className="text-center border-b pb-2">
                  <p className="text-4xl font-bold">{selectedWord}</p>
                  <p className="text-xl text-red-600 font-bold">{wordData.pinyin}</p>
                </div>
                <p className="font-bold text-slate-950 text-lg">Nghĩa: {wordData.vietnamese?.[0]}</p>
                {wordData.eg_chinese && (
                  <div className="pt-2 border-t space-y-1">
                    <p className="font-bold text-slate-950">{wordData.eg_chinese}</p>
                    <p className="text-red-700 italic text-sm">{wordData.eg_pinyin}</p>
                    <p className="bg-white p-2 rounded border font-bold text-slate-950">{wordData.eg_vietnamese}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}