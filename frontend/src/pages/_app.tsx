import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { UserProvider } from "@/context/UserContext";
import { Toaster } from "react-hot-toast";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <UserProvider>
        <Toaster position="top-right" />
        <Component {...pageProps} />
      </UserProvider>
    </NextUIProvider>
  );
}
