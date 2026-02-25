import Footer from "@/components/shared/Footer";
import { MainNavigation } from "@/components/shared/MainNavigation";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <MainNavigation />
      {children}
      <Footer />
    </>
  );
}
