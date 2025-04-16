"use client";

import ShotstackStudio from "@/components/ShotStackStudio";

export default function VideoEditor() {
  const template = {
    timeline: {
      background: "#000000",
      tracks: [
        {
          clips: [
            {
              asset: {
                type: "caption",
                src: "https://shotstack-assets.s3.amazonaws.com/captions/transcript.srt",
              },
              start: 0,
              length: "end",
            },
            {
              length: "auto",
              asset: {
                type: "video",
                src: "https://shotstack-ingest-api-v1-sources.s3.ap-southeast-2.amazonaws.com/s7pbgh87aw/zzz01jrx-kjvw1-jn91z-68bhv-16wh2h/source.mp4",
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
                src: "https://shotstack-ingest-api-v1-sources.s3.ap-southeast-2.amazonaws.com/s7pbgh87aw/zzz01jrx-kh04v-cj3p2-vamq3-j6ctdw/source.mp3",
                volume: 1,
              },
              start: 0,
              alias: "f7a65212",
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
