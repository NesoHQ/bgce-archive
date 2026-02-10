import { Navbar } from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div suppressHydrationWarning>
      {/* <Navbar /> */}
      {children}
      {/* <Footer /> */}
    </div>
  );
}
