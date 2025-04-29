"use client";

import { BACKEND_PROJECTS_URL } from "@/config";
import { Project, ProjectsReponse } from "@/types/responses";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import Link from "next/link"; 
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const { getToken } = useAuth();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const token = await getToken();
      const res = await fetch(`${BACKEND_PROJECTS_URL}/get-projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        toast.error(res.statusText);
        return [];
      }
      const data: ProjectsReponse = await res.json();
      if (!data.isSuccessful) {
        toast.error("Failed to fetch projects");
        return [];
      }
      return data.projectsData;
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "complete":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">Complete</Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            Processing
          </Badge>
        );
      case "incomplete":
        return <Badge className="bg-red-500 hover:bg-red-600">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-white z-50">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">My Projects</h1>
      </header>
      <div className="p-4">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-4">
                <CardHeader>
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/3" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects?.map((project: Project) => (
              <Card key={project.id} className="p-4 hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                  <div className="mt-2">{getStatusBadge(project.status)}</div>
                </CardHeader>
                <CardContent>
                  <Button asChild>
                    <Link href={`/projects/${project.id}`}>View Project</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
