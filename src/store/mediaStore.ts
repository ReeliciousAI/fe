import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MediaState {
  audio: string;
  voice: string;
  subtitle: string;
  video: string;
  setMedia: (media: Partial<Omit<MediaState, "setMedia">>) => void;
  reset: () => void;
}

const initialState = {
  audio: "",
  voice: "",
  subtitle: "",
  video: "",
};

export const useMediaStore = create<MediaState>()(
  persist(
    (set) => ({
      ...initialState,
      setMedia: (media) => set((state) => ({ ...state, ...media })),
      reset: () => set(initialState),
    }),
    {
      name: "media-storage",
    },
  ),
);
