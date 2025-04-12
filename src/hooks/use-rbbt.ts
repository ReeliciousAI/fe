import { RBBTContext, RBBTContextType } from "@/context/RbbtContext";
import { useContext } from "react";

export function useRBBT(): RBBTContextType {
  const {
    client,
    connect,
    isConnected,
    createDisposableQueue,
    connectToQueue,
    convertByteArrayToJSON,
    convertJSONToByteArray,
    convertByteArrayToString,
  } = useContext(RBBTContext);

  if (!client) {
    throw new Error("useRBBT must be used within a RBBTProvider");
  }

  return {
    client,
    connect,
    isConnected,
    createDisposableQueue,
    connectToQueue,
    convertByteArrayToJSON,
    convertJSONToByteArray,
    convertByteArrayToString,
  };
}
