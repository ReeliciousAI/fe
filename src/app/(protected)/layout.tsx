import CustomSidebar from "@/components/sidebar";
import { RBBTProvider } from "@/providers/rbbt-provider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <RBBTProvider rabbitMqConnection="wss://congen.ofneill.com:15671/ws">
          <CustomSidebar>{children}</CustomSidebar>
        </RBBTProvider>
      </body>
    </html>
  );
}
