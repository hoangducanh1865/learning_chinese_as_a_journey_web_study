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
