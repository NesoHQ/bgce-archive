import Footer from "@/components/shared/Footer";
import { MainNavigation } from "@/components/shared/MainNavigation";

export default function ArchiveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainNavigation />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </>
  );
}
