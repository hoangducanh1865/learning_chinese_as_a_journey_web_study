"use client";
import { VIDEOS } from '@/app/lib/videos';
import Link from 'next/link';

export default function VideosPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-slate-50 text-slate-900">
      <div className="w-full max-w-7xl">
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
          >
            ← Quay lại trang chính
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8">HUST CHINESE LEARNING - Danh sách Video</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VIDEOS.map((video) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-slate-100"
            >
              <div className="relative bg-gradient-to-br from-slate-900 to-slate-700 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white mb-2">{video.id}</div>
                  <div className="text-sm text-slate-300">Video</div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-slate-900 line-clamp-2">
                  {video.title}
                </h3>
                <div className="mt-4 text-blue-600 font-semibold text-sm">
                  Xem video
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
