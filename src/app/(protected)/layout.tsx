import CustomSidebar from "@/app/(protected)/_components/sidebar";
import { ClerkProvider } from "@clerk/nextjs";
import { RBBTProvider } from "rbbt-client/next";
import { Toaster } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <ClerkProvider>
          <RBBTProvider
            config={{
              url: process.env.RBBT_WS_URL!,
              vhost: process.env.RBBT_VHOST!,
              username: process.env.RBBT_USERNAME!,
              password: process.env.RBBT_PASSWORD!,
            }}
          >
            <CustomSidebar>{children}</CustomSidebar>
            <Toaster />
          </RBBTProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
