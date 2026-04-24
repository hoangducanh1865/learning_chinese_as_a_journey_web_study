export interface Video {
  id: number;
  title: string;
  youtubeId: string;
  transcriptFile: string;
}

export const VIDEOS: Video[] = [
  {
    id: 1,
    title: "Video 1 - Tại sao \"nghe\" là kỹ năng quan trọng nhất",
    youtubeId: "IU4Sw07L9PU",
    transcriptFile: "transcript.txt"
  },
  {
    id: 2,
    title: "Video 2",
    youtubeId: "ecFxtxHkDUk",
    transcriptFile: "transcript_2.txt"
  },
  {
    id: 3,
    title: "Video 3",
    youtubeId: "qnVE36FUJbY",
    transcriptFile: "transcript_3.txt"
  },
  {
    id: 4,
    title: "Video 4",
    youtubeId: "rZu3jcLVzDU",
    transcriptFile: "transcript_4.txt"
  },
  {
    id: 5,
    title: "Video 5",
    youtubeId: "-gN2qb6YEe0",
    transcriptFile: "transcript_5.txt"
  },
  {
    id: 6,
    title: "Video 6",
    youtubeId: "_geaXGe8VWg",
    transcriptFile: "transcript_6.txt"
  },
  {
    id: 7,
    title: "Video 7",
    youtubeId: "9sIxHGv8Mwk",
    transcriptFile: "transcript_7.txt"
  },
  {
    id: 8,
    title: "Video 8",
    youtubeId: "HFn_mwSqtJ4",
    transcriptFile: "transcript_8.txt"
  },
  {
    id: 9,
    title: "Video 9",
    youtubeId: "tmC-p1M-3Fc",
    transcriptFile: "transcript_9.txt"
  }
];

export const getVideoById = (id: number): Video | undefined => {
  return VIDEOS.find(v => v.id === id);
};
