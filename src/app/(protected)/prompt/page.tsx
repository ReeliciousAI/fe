"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { BACKEND_PROMPT_URL } from "@/config";
import { audioFiles, toneOptions, videos } from "@/lib/db";

// component imports
import { Button } from "@/components/ui/button";
import QualitySelector from "@/app/(protected)/prompt/_components/quality-selector";
import TemplateSelect from "@/app/(protected)/prompt/_components/template-select";
import ScriptPrompt from "./_components/script-prompt";
import BackgroundAudioSelector from "./_components/background-audio-selector";
import ToneSelector from "./_components/tone-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function PromptPage() {
  const { getToken } = useAuth();
  const [selectedAudio, setSelectedAudio] = useState<number | null>(null);
  const [selectedTone, setSelectedTone] = useState<number | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("standard");
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [prompt, setPrompt] = useState("");
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [scriptSource, setScriptSource] = useState<"prompt" | "file">("prompt");

  const handleAudioSelect = (id: number) => {
    setSelectedAudio(id);
  };

  const handleToneSelect = (id: number) => {
    setSelectedTone(id);
  };

  const handleGenerate = async () => {
    console.log(
      scriptSource,
      prompt,
      scriptFile,
      selectedTone,
      selectedAudio,
      selectedTemplate
    );
    if (!prompt.trim() && !scriptFile) return;
    const token = await getToken();
    if (scriptSource === "prompt" && !scriptFile) {
      try {
        setIsGenerating(true);
        const body = {
          prompt,
          tone: selectedTone,
          audio: selectedAudio,
          video: selectedTemplate,
        };

        const request: RequestInit = {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify(body),
        };

        const response = await fetch(BACKEND_PROMPT_URL, request);

        if (!response.ok) {
          throw new Error("Failed to generate content");
        }

        const data = await response.json();
        console.log("Generated content:", data);
      } catch (error) {
        toast.error("Error generating content: " + error || "");
      } finally {
        setIsGenerating(false);
      }
    } else if (scriptSource === "file" && scriptFile) {
      try {
        setIsGenerating(true);
        const form = new FormData();
        form.append("file", scriptFile);
        form.append("tone", selectedTone?.toString() || "0");
        if (selectedAudio) {
          form.append("audio", selectedAudio?.toString() || "0");
        }
        form.append("video", selectedTemplate?.toString() || "0");

        const response = await fetch("/api/generate/prompt", {
          method: "POST",
          body: form,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `bearer ${token || ""}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to generate content");
        }
      } catch (error) {
        toast.error("Error generating content: " + error || "");
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <div className="h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold">Create new content</h1>
      </header>
      <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-background/95">
        <div className="w-full max-w-5xl space-y-6">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left column - Prompt and Options */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">Script Source</span>
                </h2>

                <ScriptPrompt
                  prompt={prompt}
                  scriptFile={scriptFile}
                  scriptSource={scriptSource}
                  setPrompt={setPrompt}
                  setScriptFile={setScriptFile}
                  setScriptSource={setScriptSource}
                />
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
                <TemplateSelect
                  templates={videos}
                  onSelect={(id: number) => {
                    setSelectedTemplate(id);
                    console.log(id);
                  }}
                  selected={selectedTemplate}
                />
              </div>
            </div>

            {/* Right column - Audio and Preview */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">Background Audio</span>
                </h2>
                <BackgroundAudioSelector
                  audioFiles={audioFiles}
                  selectedAudio={selectedAudio}
                  handleAudioSelect={handleAudioSelect}
                />
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-primary">Select Tone</span>
                </h2>
                <ToneSelector
                  toneOptions={toneOptions}
                  selectedTone={selectedTone}
                  handleToneSelect={handleToneSelect}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all"
              size="lg"
              disabled={
                (!prompt.trim() && !scriptFile) ||
                !selectedTemplate ||
                selectedTone == null ||
                !selectedTemplate
              }
              onClick={handleGenerate}
            >
              {isGenerating ? "Generating..." : "Generate Content"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
