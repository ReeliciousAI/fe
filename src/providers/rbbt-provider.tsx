"use client";

import { ReactNode, useState, useCallback, useEffect } from "react";
import { RBBTClient, RBBTQueue } from "rbbt-client";
import { RBBTContext } from "@/context/RbbtContext";

interface RBBTProviderProps {
  children: ReactNode;
  rabbitMqConnection: string;
}

export const RBBTProvider = ({
  children,
  rabbitMqConnection,
}: RBBTProviderProps) => {
  const [client, setClient] = useState<RBBTClient>();
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
    if (client) return;

    const rbbt = new RBBTClient(
      rabbitMqConnection,
      "/",
      "socket",
      "@CongenPass209:",
    );

    rbbt.heartbeatIncoming = 5000;
    rbbt.heartbeatOutgoing = 5000;
    rbbt.reconnectionDelay = 1000;

    rbbt.connect();
    setClient(rbbt);
    setIsConnected(true);
  }, [rabbitMqConnection]);

  const createDisposableQueue = useCallback(
    (exchange: string, routingKey: string): RBBTQueue | undefined => {
      if (!client) return undefined;
      try {
        const ex = client.exchange(exchange);
        const q = ex.queue();
        q.bind(routingKey);
        return q;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    [client],
  );

  const connectToQueue = useCallback(
    (exchange: string, queueName: string): RBBTQueue | undefined => {
      if (!client) return undefined;
      try {
        const ex = client.exchange(exchange);
        const q = ex.queue(queueName);
        return q;
      } catch (e) {
        console.error(e);
        return undefined;
      }
    },
    [client],
  );

  const convertByteArrayToJSON = useCallback((byteArray: Uint8Array): any => {
    try {
      const jsonString = new TextDecoder().decode(byteArray);
      return JSON.parse(jsonString);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const convertJSONToByteArray = useCallback((json: any): Uint8Array | null => {
    try {
      const jsonString = JSON.stringify(json);
      return new TextEncoder().encode(jsonString);
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const convertByteArrayToString = useCallback(
    (byteArray: Uint8Array): string | null => {
      try {
        return new TextDecoder().decode(byteArray);
      } catch (e) {
        console.error(e);
        return null;
      }
    },
    [],
  );

  // Attempt to connect when the provider mounts
  useEffect(() => {
    connect();

    return () => {
      client?.close();
    };
  }, []);

  if (!client) {
    return null; // Or return a loading component if desired
  }

  return (
    <RBBTContext.Provider
      value={{
        client,
        connect,
        isConnected,
        createDisposableQueue,
        connectToQueue,
        convertByteArrayToJSON,
        convertJSONToByteArray,
        convertByteArrayToString,
      }}
    >
      {children}
    </RBBTContext.Provider>
  );
};
