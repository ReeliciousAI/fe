"use client";

import { useAuth } from "@clerk/nextjs";
import { BACKEND_PROMPT_URL, BACKEND_SERVICE_URL } from "@/config";
import { toneOptions } from "@/lib/db";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QualitySelector from "@/app/(protected)/prompt/_components/quality-selector";
import TemplateSelect from "@/app/(protected)/prompt/_components/template-select";
import ScriptPrompt from "./_components/script-prompt";
import BackgroundAudioSelector from "./_components/background-audio-selector";
import ToneSelector from "./_components/tone-selector";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { BaseResponse, ServiceFile, ServiceResponse } from "@/types/responses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PromptPage() {
  const { getToken } = useAuth();

  const { data: videos, isLoading: videosLoading } = useQuery({
    queryKey: ["template"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(BACKEND_SERVICE_URL + "?type=1", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        toast.error(res.statusText);
        return;
      }
      const data: ServiceResponse = await res.json();
      if (!data.isSuccessful) {
        toast.error("Failed to fetch video templates");
        return;
      }
      return data.serviceData;
    },
  });

  const { data: audios, isLoading: audiosLoading } = useQuery({
    queryKey: ["audio"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(BACKEND_SERVICE_URL + "?type=3", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        toast.error(res.statusText);
        return;
      }
      const data: ServiceResponse = await res.json();
      if (!data.isSuccessful) {
        toast.error("Failed to fetch background audio");
        return;
      }
      return data.serviceData;
    },
  });

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
    if (
      !prompt.trim() &&
      !scriptFile &&
      !selectedAudio &&
      !selectedTemplate &&
      !audios &&
      !videos
    )
      return;
    const token = await getToken();
    if (scriptSource === "prompt" && !scriptFile) {
      try {
        setIsGenerating(true);
        const body = {
          prompt,
          tone: selectedTone,
          audio: audios!.find(
            (audio: ServiceFile) => audio.id === selectedAudio
          )?.url,
          video: videos!.find(
            (video: ServiceFile) => video.id === selectedTemplate
          )?.url,
        };

        const request: RequestInit = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
          body: JSON.stringify(body),
        };

        console.log(request);

        const response = await fetch(BACKEND_PROMPT_URL, request);

        if (!response.ok) {
          throw new Error("Failed to generate content");
        }

        const data: BaseResponse = await response.json();
        if (!data.isSuccessful) {
          throw new Error(
            data.errorMessage ? data.errorMessage : "Something went wrong"
          );
        }
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

        const request: RequestInit = {
          method: "POST",
          body: form,
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `bearer ${token || ""}`,
          },
        };

        const response = await fetch("/api/generate/prompt", request);

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
    <div className="h-full flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-white z-50">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">Create new content</h1>
      </header>
      <div className="flex flex-col overflow-auto items-center justify-center p-6 bg-gradient-to-b from-background to-background/95">
        <div className="w-full max-w-2xl space-y-6 gap-y-4">
          {/* Left column - Prompt and Options */}
          <div className="space-y-6">
            <div className="space-y-3 border rounded-md p-4">
              <h2 className="text-lg font-semibold text-center gap-2 bg-stone-100 rounded-md p-2">
                <span className="text-primary">Script source</span>
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

            <div className="space-y-3 border rounded-md p-4">
              <h2 className="text-lg font-semibold text-center gap-2 bg-stone-100 rounded-md p-2">
                <span className="text-primary">Video Clips</span>
              </h2>
              <Tabs defaultValue="subway_surfer" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="subway_surfer">
                    Subway Surfers
                  </TabsTrigger>
                  <TabsTrigger value="minecraft">Minecraft</TabsTrigger>
                  <TabsTrigger value="csgo">CSGO</TabsTrigger>
                </TabsList>
                <TabsContent value="subway_surfer">
                  <TemplateSelect
                    templates={videos}
                    loading={videosLoading}
                    selected={selectedTemplate}
                    onSelect={setSelectedTemplate}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div className="space-y-3 border rounded-md p-4">
            <h2 className="text-lg font-semibold text-center gap-2 bg-stone-100 rounded-md p-2">
              <span className="text-primary">Background Audio</span>
            </h2>
            <BackgroundAudioSelector
              audioFiles={audios}
              loading={audiosLoading}
              selected={selectedAudio}
              onSelect={handleAudioSelect}
            />
          </div>

          <div className="space-y-3 border rounded-md p-4">
            <h2 className="text-lg font-semibold text-center gap-2 bg-stone-100 rounded-md p-2">
              <span className="text-primary">Tone Selector</span>
            </h2>
            <ToneSelector
              toneOptions={toneOptions}
              selectedTone={selectedTone}
              handleToneSelect={handleToneSelect}
            />
          </div>
        </div>
        <hr className="my-4"/>
        <div className="w-full max-w-2xl">
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
  );
}
