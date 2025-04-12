import { createContext } from "react";
import { RBBTClient, RBBTQueue } from "rbbt-client";

export interface RBBTContextType {
  client: RBBTClient | undefined;
  connect: (() => void) | undefined;
  isConnected: boolean;
  createDisposableQueue: (
    exchange: string,
    routingKey: string,
  ) => RBBTQueue | undefined;
  connectToQueue: (
    exchange: string,
    queueName: string,
  ) => RBBTQueue | undefined;
  convertByteArrayToJSON: (byteArray: Uint8Array) => any;
  convertJSONToByteArray: (json: any) => Uint8Array | null;
  convertByteArrayToString: (byteArray: Uint8Array) => string | null;
}

export const RBBTContext = createContext<RBBTContextType>({
  client: undefined,
  connect: undefined,
  isConnected: false,
  createDisposableQueue: () => undefined,
  connectToQueue: () => undefined,
  convertByteArrayToJSON: () => null,
  convertJSONToByteArray: () => null,
  convertByteArrayToString: () => null,
});
