import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Twilio Flex Call Center",
    description: "Centro de llamadas integrado con Twilio Flex",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="es">
            <body>{children}</body>
        </html>
    );
}
