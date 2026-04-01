import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({
  children,
}: RootLayoutProps) {
  return children;
}
