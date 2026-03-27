import "./globals.css";

export const metadata = {
  title: "Unimed Portal",
  description: "Portal terpadu mahasiswa Universitas Negeri Medan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}