import { Button } from "@/components/ui/button";
import { ServiceFile } from "@/types/responses";
import { useState } from "react";
import { BarLoader } from "react-spinners";


interface IBackgroundAudioSelector {
  audioFiles?: ServiceFile[];
  loading: boolean,
  selected: number | null;
  onSelect: (id:number) => void;
}

export default function BackgroundAudioSelector({
  audioFiles,
  loading,
  selected,
  onSelect
}: IBackgroundAudioSelector) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);

  const handlePlayAudio = (id: number, url: string) => {
    if (currentlyPlaying === id) {
      if (audioPlayer) {
        audioPlayer.pause();
        setCurrentlyPlaying(null);
        setAudioPlayer(null);
      }
    } else {
      if (audioPlayer) {
        audioPlayer.pause();
      }

      const newAudio = new Audio(url);
      newAudio.play();
      setAudioPlayer(newAudio);
      setCurrentlyPlaying(id);

      newAudio.onended = () => {
        setCurrentlyPlaying(null);
        setAudioPlayer(null);
      };
    }
  };
  return (
    <div className="space-y-2 max-h-[300px] overflow-y-auto">
      {loading && <BarLoader/>}
      {audioFiles?.map((audio) => (
        <div
          key={audio.id}
          className={`flex items-center justify-between p-3 rounded-md border ${
            selected === audio.id
              ? "border-primary bg-primary/10"
              : "border-input"
          }`}
        >
          <span className="text-sm">{audio.title}</span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePlayAudio(audio.id, audio.url)}
            >
              {currentlyPlaying === audio.id ? "Pause" : "Play"}
            </Button>
            <Button
              variant={selected === audio.id ? "default" : "outline"}
              size="sm"
              onClick={() => onSelect(audio.id)}
            >
              Select
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
