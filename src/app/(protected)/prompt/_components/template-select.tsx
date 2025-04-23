'use client';

import { cn } from '@/lib/utils';
import { ServiceFile } from '@/types/responses';
import React, { useRef } from 'react';
import {BarLoader} from "react-spinners"

interface ITemplateSelect  {
  templates?: ServiceFile[];
  loading: boolean
  selected: number | null;
  onSelect: (id: number) => void;
}

const TemplateSelect = ({
  templates,
  loading,
  selected,
  onSelect,
}:ITemplateSelect) => {
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
      if (video.currentTime > 0)
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <div className="flex overflow-x-auto space-x-4 p-4">
      {loading && <BarLoader />}
      {templates?.map((video, index) => (
        <div key={index} className={cn("flex-none w-16 aspect-[3/5] rounded overflow-hidden shadow-md",selected== video.id && "outline-4 outline-fuchsia-500")} onClick={()=>onSelect(video.id)}>
          <video
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            className="w-full h-full object-cover"
            // poster={video.imageUrl}
            muted
            loop
            preload="none"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={() => handleMouseLeave(index)}
            >
            <source
            src={video.url}
              type='video/mp4'
            />
          </video>
        </div>
      ))}
    </div>
  );
};

export default TemplateSelect;