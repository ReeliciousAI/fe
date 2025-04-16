"use client";

import ShotstackStudio from "@/components/ShotStackStudio";
import { useMediaStore } from "@/store/mediaStore";

export default function VideoEditor() {
  const { audio, video, subtitle, voice } = useMediaStore();
  const template = {
    timeline: {
      background: "#000000",
      tracks: [
        {
          clips: [
            {
              asset: {
                type: "caption",
                src: subtitle,
              },
              start: 0,
              length: "end",
            },
            {
              length: "auto",
              asset: {
                type: "video",
                src: video,
                volume: 0,
              },
              start: 0,
              fit: "none",
            },
          ],
        },
        {
          clips: [
            {
              length: "auto",
              asset: {
                type: "audio",
                src: audio,
                volume: 1,
              },
              start: 0,
              alias: "f7a65212",
            },
            {
              length: "auto",
              asset: {
                type: "audio",
                src: voice,
                volume: 1,
              },
              start: 0,
              alias: "f7a62312",
            },
          ],
        },
      ],
    },
    output: {
      format: "mp4",
      fps: 25,
      size: {
        width: 1920,
        height: 1080,
      },
    },
    merge: [
      {
        find: "VIDEO",
        replace:
          "https://templates.shotstack.io/video-watermark/f74212dc-4679-4350-8c63-881747ac6202/source.mp4",
      },
    ],
  };

  return (
    <div className="w-full h-full">
      <ShotstackStudio
        template={template}
        onReady={() => console.log("Editor ready")}
        onError={(error) => console.error(error)}
      />
    </div>
  );
}
