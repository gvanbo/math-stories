import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Math Stories — Grade 4 Math Adventures',
  description:
    'Create personalized math stories that teach Alberta Grade 4 concepts through fun, interactive adventures. Powered by Gemini AI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
