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
