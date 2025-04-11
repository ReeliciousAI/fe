import CustomSidebar from "@/components/sidebar";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomSidebar>
        {children}
      </CustomSidebar>
    </>
  );
}