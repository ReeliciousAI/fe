import { RBBTContext } from "@/context/RbbtContext";
import { useContext } from "react";

export function useRBBT() {
  const { client, connect, isConnected } = useContext(RBBTContext);

  if (!client) {
    throw new Error("useRBBT must be used within a RBBTProvider");
  }

  return { client, connect, isConnected };
}