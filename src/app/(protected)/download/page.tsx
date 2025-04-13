"use client";

import { useRef, useState } from "react";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const ffmpegRef = useRef(new FFmpeg());
  const videoRef = useRef(null);
  const messageRef = useRef(null);

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    ffmpeg.on("log", ({ message }) => {
      messageRef.current.innerHTML = message;
      console.log(message);
    });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    setLoaded(true);
  };

  const transcode = async () => {
    const ffmpeg = ffmpegRef.current;
    await ffmpeg.writeFile(
      "video.mp4",
      await fetchFile(
        "https://cdn.revid.ai/subway_surfers/LOW_RES/1.mp4"
      )
    );
    await ffmpeg.writeFile("audio.mp3", await fetchFile("/public/output.mp3"));
    await ffmpeg.writeFile(
      "caption.srt",
      await fetchFile("/public/subtitles.srt")
    );
    await ffmpeg.exec([
      "-i",
      "video.mp4",
      "-i",
      "audio.mp3",
      "-map",
      "0:v",
      "-map",
      "1:a",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-vf",
      "subtitles=subtitles.srt",
      "output.mp4",
    ]);
    const data = await ffmpeg.readFile("output.mp4");
    videoRef.current.src = URL.createObjectURL(
      new Blob([data.buffer], { type: "video/mp4" })
    );
  };

  return loaded ? (
    <>
      <video ref={videoRef} controls></video>
      <br />
      <button onClick={transcode}>Transcode webm to mp4</button>
      <p ref={messageRef}></p>
      <p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
    </>
  ) : (
    <button onClick={load}>Load ffmpeg-core (~31 MB)</button>
  );
}
