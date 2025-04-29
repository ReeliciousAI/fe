"use client";

import { useMediaStore } from "@/store/mediaStore";
import { useUser } from "@clerk/nextjs";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { RBBTQueue } from "rbbt-client";
import { useRBBT } from "rbbt-client/next";
import { ReactNode, useEffect } from "react";
import { toast } from "sonner";

export function RabbitQListener({ children }: { children: ReactNode }) {
  const { createDisposableQueue } = useRBBT();
  const queryClient = useQueryClient()
  const { setMedia } = useMediaStore();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const refetch = async (id: number) => {
      await queryClient.invalidateQueries({ queryKey: ['project', id] })
      await queryClient.refetchQueries({ queryKey: ['project', id], type:'all' });
    }
    let q: RBBTQueue | undefined = undefined;
    if (user) {
      q = createDisposableQueue("user", user.id);
      if (q) {
        q.subscribe({ noAck: true }, (msg) => {
          console.log(msg)
          if (!msg.body) return
          if (typeof msg.body != 'object') return
          
          const obj =  'error' in msg.body 
          ? msg.body as unknown as {
            error: string,
            message:string
          } 
          : msg.body as unknown as {
            id: number
          };

          if ('error' in obj ) {
            toast.error(obj.error, {
              description: obj.message
            })
            return;
          }
          // setMedia(obj);
          refetch(obj.id)
          toast("Video has finished generating", {
            description:
              "Your video has now completed generating click to go to video",
            action: {
              label: "View",
              onClick: () => {
                router.push("/video-editor");
              },
            },
          });
        });
      }
    }

    return () => {
      if (q instanceof RBBTQueue) {
        q.unsubscribe();
      }
    };
  }, [user]);

  return <>{children}</>;
}
