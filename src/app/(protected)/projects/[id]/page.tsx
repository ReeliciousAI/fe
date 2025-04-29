"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { BACKEND_PROJECTS_URL } from "@/config";
import { useMediaStore } from "@/store/mediaStore";
import { ProjectReponse } from "@/types/responses";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ProjectIdPage() {
  const params = useParams();
  const projectId = params.id;
  const { setMedia } = useMediaStore();
  const { getToken } = useAuth();
  const router = useRouter();

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(
        `${BACKEND_PROJECTS_URL}/get-project?projectId=${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!res.ok) {
        toast.error(res.statusText);
        return null;
      }
      const data: ProjectReponse = await res.json();
      if (!data.isSuccessful) {
        toast.error("Failed to fetch project");
        return null;
      }
      return data.projectData;
    },
  });

  return (
    <div className="h-full flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-white z-50">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">My Project: {projectLoading? "loading": project?.title}</h1>
      </header>
      <div className="grow justify-center items-center p-4 bg-muted">
        {projectLoading ? (
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardHeader>
              <Skeleton className="h-6 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ) : project ? (
          <Card className="w-full max-w-md p-6 space-y-4">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                {project.title}
              </CardTitle>
              <p className="text-muted-foreground capitalize">
                {project.status}
              </p>
            </CardHeader>
            <CardContent>
              {project.status === "complete" && (
                <Button
                  className="w-full"
                  onClick={() => {
                    setMedia({
                      audio: project.audioUrl,
                      subtitle: project.captionsUrl,
                      video: project.videoUrl,
                      voice: project.ttsUrl,
                    });
                    router.push("/video-editor");
                  }}
                >
                  Edit Video
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <p className="text-center text-muted-foreground">
            Project not found.
          </p>
        )}
      </div>
    </div>
  );
}
