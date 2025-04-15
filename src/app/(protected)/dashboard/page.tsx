"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileVideo } from "lucide-react";
import Link from "next/link";
import { useRBBT } from "rbbt-client/next";
import { useEffect } from "react";

export default function DashboardPage() {
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

  return (
    <div>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-xl font-semibold">My dashboard</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
          <Tabs defaultValue="templates">
            <TabsList>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
            <TabsContent value="templates" className="mt-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Video</CardTitle>
                    <CardDescription>Generate video content ideal for instagram or youtube shorts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                      <FileVideo className="h-6 w-6" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button size="sm" className="w-full" asChild>
                      <Link href={"/prompt"}>
                        Create
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="recent">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Cards */}
              </div>
            </TabsContent>
          <TabsContent value="Favorites">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Cards */}
              </div>
            </TabsContent>
          </Tabs>
        </div>
    </div>
  );
}
