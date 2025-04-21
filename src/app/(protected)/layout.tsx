import CustomSidebar from "@/app/(protected)/_components/sidebar";
import NextQueryClientProvider from "@/providers/query-client-provider";
import { RabbitQListener } from "@/providers/rabbit-queue-listener";
import { ClerkProvider } from "@clerk/nextjs";
import { RBBTProvider } from "rbbt-client/next";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <NextQueryClientProvider>
          <ClerkProvider>
            <RBBTProvider
              config={{
                url: process.env.RBBT_WS_URL!,
                vhost: process.env.RBBT_VHOST!,
                username: process.env.RBBT_USERNAME!,
                password: process.env.RBBT_PASSWORD!,
              }}
            >
              <RabbitQListener>
                <CustomSidebar>{children}</CustomSidebar>
                <Toaster />
              </RabbitQListener>
            </RBBTProvider>
          </ClerkProvider>
        </NextQueryClientProvider>
      </body>
    </html>
  );
}
