'use client';

import { cn } from '@/lib/utils';
import React, { useRef } from 'react';

type Template ={
  id: number;
  url: string;
  type: number;
  title: string;
  description: string;
}

const TemplateSelect = ({
  templates,
  onSelect,
  selected,
}: {
  templates?: Template[];
  onSelect: (id: number) => void;
  selected: number | null;
}) => {
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const handleMouseEnter = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.play();
    }
  };

  const handleMouseLeave = (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="flex overflow-x-auto space-x-4 p-4">
      {templates?.map((video, index) => (
        <div key={index} className={cn("flex-none w-16 aspect-[3/5] rounded overflow-hidden shadow-md",selected== video.id && "outline-4 outline-fuchsia-500")} onClick={()=>onSelect(video.id)}>
          <video
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            className="w-full h-full object-cover"
            src={video.url}
            // poster={video.imageUrl}
            muted
            loop
            preload="metadata"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default TemplateSelect;