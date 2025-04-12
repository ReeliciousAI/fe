"use client";

import { Button } from "@/components/ui/button";
import { QualitySelector } from "@/components/QualitySelector";
import { useEffect, useState } from "react";
import { useRBBT } from "rbbt-client/next";
import TemplateSelect from "@/components/TemplateSelect";


const videos = [
  {
    id: 1,
    name: "Video 1",
    videoUrl: "https://cdn.revid.ai/subway_surfers/LOW_RES/1.mp4",
    imageUrl: "https://cdn.revid.ai/subway_surfers/thumbnails/1.png"
  },
  {
    id: 2,
    name: "Video 2",
    videoUrl: "https://cdn.revid.ai/subway_surfers/LOW_RES/2.mp4",
    imageUrl: "https://cdn.revid.ai/subway_surfers/thumbnails/2.png"
  },
  {
    id: 3,
    name: "Video 3",
    videoUrl: "https://cdn.revid.ai/subway_surfers/LOW_RES/3.mp4",
    imageUrl: "https://cdn.revid.ai/subway_surfers/thumbnails/3.png"
  },
  {
    id: 4,
    name: "Video 4",
    videoUrl: "https://cdn.revid.ai/subway_surfers/LOW_RES/4.mp4",
    imageUrl: "https://cdn.revid.ai/subway_surfers/thumbnails/4.png"
  },
  {
    id: 5,
    name: "Video 5",
    videoUrl: "https://cdn.revid.ai/subway_surfers/LOW_RES/5.mp4",
    imageUrl: "https://cdn.revid.ai/subway_surfers/thumbnails/5.png"
  },
  {
    id: 6,
    name: "Video 6",
    videoUrl: "https://cdn.revid.ai/subway_surfers/LOW_RES/6.mp4",
    imageUrl: "https://cdn.revid.ai/subway_surfers/thumbnails/6.png"
  }
];

const audioFiles = [
  {
    id: 1,
    name: "Blade runer",
    url: "https://cdn.revid.ai/audio/_bladerunner-2049.mp3"
  },
  {
    id: 2,
    name: "Paris Elise",
    url: "https://cdn.revid.ai/audio/_paris-else.mp3"
  },
  {
    id: 3,
    name: "Observer",
    url: "https://cdn.revid.ai/audio/observer.mp3"
  },
  {
    id: 4,
    name: "Izzamusic",
    url: "https://cdn.revid.ai/audio/_izzamuzzic.mp3"
  }
];

const toneOptions = [
  {
    id: 1,
    name: "Professional",
    description: "Clear and formal tone"
  },
  {
    id: 2,
    name: "Casual",
    description: "Friendly and conversational"
  },
  {
    id: 3,
    name: "Enthusiastic",
    description: "Energetic and engaging"
  },
  {
    id: 4,
    name: "Educational",
    description: "Informative and detailed"
  }
];

export default function PromptPage() {
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [selectedTemplate, setSelectedTemplate] = useState<number|null>(null);
  const [prompt, setPrompt] = useState("");
  const [overlayFile, setOverlayFile] = useState<File | null>(null);
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptSource, setScriptSource] = useState<"prompt" | "file">("prompt");
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null);
  const { createDisposableQueue, convertByteArrayToJSON } = useRBBT();

  useEffect(() => {
    const q = createDisposableQueue("ai", "hi");
    if (q) {
      q.subscribe({ noAck: true }, (msg) => {
        const obj = convertByteArrayToJSON(msg.body as Uint8Array);
        console.log(obj);
      });
    }
  }, []);

  const handlePlayAudio = (id: number, url: string) => {
    if (currentlyPlaying === id) {
      // If the same audio is playing, pause it
      if (audioPlayer) {
        audioPlayer.pause();
        setCurrentlyPlaying(null);
        setAudioPlayer(null);
      }
    } else {
      // If a different audio is playing, stop it first
      if (audioPlayer) {
        audioPlayer.pause();
      }
      
      // Play the new audio
      const newAudio = new Audio(url);
      newAudio.play();
      setAudioPlayer(newAudio);
      setCurrentlyPlaying(id);

      // Reset when audio ends
      newAudio.onended = () => {
        setCurrentlyPlaying(null);
        setAudioPlayer(null);
      };
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOverlayFile(file);
    }
  };

  const handleScriptFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScriptFile(file);
    }
  };

  const handleAudioSelect = (id: number) => {
    setSelectedAudio(id);
  };

  const handleToneSelect = (id: number) => {
    setSelectedTone(id);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      const formData = new FormData();
      formData.append("prompt", prompt);
      formData.append("quality", selectedQuality);
      formData.append("overlayFormat", selectedTemplate ? videos[selectedTemplate-1].videoUrl : "none");
      if (overlayFile) {
        formData.append("overlayFile", overlayFile);
      }
      if (selectedAudio) {
        formData.append("audio", audioFiles[selectedAudio-1].url);
      }

      // Log request data
      console.log("Request Data:", {
        prompt,
        quality: selectedQuality,
        overlayFormat: selectedTemplate ? videos[selectedTemplate-1].videoUrl : "none",
        hasOverlayFile: !!overlayFile,
        overlayFileName: overlayFile?.name,
        overlayFileSize: overlayFile
          ? `${(overlayFile.size / 1024 / 1024).toFixed(2)}MB`
          : null,
        selectedAudio: selectedAudio ? audioFiles[selectedAudio-1].name : null,
      });

      // Mock API call
      const response = await fetch("/api/generate-content", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate content");
      }

      const data = await response.json();
      console.log("Generated content:", data);

      // Navigate to results page with the generated video data
    } catch (error) {
      console.error("Error generating content:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-6 bg-gradient-to-b from-background to-background/95">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Create Your Content
          </h1>
          <p className="text-muted-foreground">
            Generate amazing videos with AI
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column - Prompt and Options */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-col space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">Script Source</span>
                </h2>
                <div className="flex border-b border-input">
                  <button
                    onClick={() => setScriptSource("prompt")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      scriptSource === "prompt"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Generate Script with Congen
                  </button>
                  <button
                    onClick={() => setScriptSource("file")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      scriptSource === "file"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Use Own Script
                  </button>
                </div>
              </div>

              {scriptSource === "file" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="script-upload"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-background/50 hover:bg-background/80"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-muted-foreground"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PDF or CSV (MAX. 10MB)
                        </p>
                      </div>
                    </label>
                    <input
                      id="script-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.csv"
                      onChange={handleScriptFileUpload}
                    />
                  </div>
                  {scriptFile && (
                    <div className="text-sm text-muted-foreground">
                      Selected file: {scriptFile.name}
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-[200px] p-3 rounded-md border border-input bg-background/50 backdrop-blur-sm text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Enter your content prompt here..."
                />
              )}
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">Quality Level</span>
              </h2>
              <QualitySelector
                selectedQuality={selectedQuality}
                onSelect={setSelectedQuality}
              />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">Template Format</span>
              </h2>
              <TemplateSelect templates={videos} onSelect={(id:number)=>{
                setSelectedTemplate(id)
                console.log(id)
                }} selected={selectedTemplate}/>

             
            </div>
          </div>

          {/* Right column - Audio and Preview */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">Select Audio</span>
              </h2>
              <div className="space-y-2">
                {audioFiles.map((audio) => (
                  <div
                    key={audio.id}
                    className={`flex items-center justify-between p-3 rounded-md border ${
                      selectedAudio === audio.id
                        ? "border-primary bg-primary/10"
                        : "border-input"
                    }`}
                  >
                    <span className="text-sm">{audio.name}</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handlePlayAudio(audio.id, audio.url)}
                      >
                        {currentlyPlaying === audio.id ? "Pause" : "Play"}
                      </Button>
                      <Button
                        variant={selectedAudio === audio.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleAudioSelect(audio.id)}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-primary">Select Tone</span>
              </h2>
              <div className="space-y-2">
                {toneOptions.map((tone) => (
                  <div
                    key={tone.id}
                    className={`p-3 rounded-md border ${
                      selectedTone === tone.id
                        ? "border-primary bg-primary/10"
                        : "border-input"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">{tone.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {tone.description}
                        </div>
                      </div>
                      <Button
                        variant={selectedTone === tone.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleToneSelect(tone.id)}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

           
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
            size="lg"
            disabled={
              !prompt.trim() ||
              (selectedTemplate !== null && !overlayFile) ||
              isGenerating
            }
            onClick={handleGenerate}
          >
            {isGenerating ? "Generating..." : "Generate Content"}
          </Button>
          <Button
            variant="outline"
            onClick={() => {}}
            className="w-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
