import { MainNavigation } from "@/components/shared/MainNavigation";
import Footer from "@/components/shared/Footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div suppressHydrationWarning>
      <MainNavigation />
      {children}
      <Footer />
    </div>
  );
}
