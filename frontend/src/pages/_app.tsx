import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import { UserProvider, UserContext } from "@/context/UserContext";
import { apiurl } from "@/context/apiURL";
import { InferGetServerSidePropsType } from "next";

export const getServerSideProps = async () => {
  const res = await fetch(`${apiurl}/api/auth/getuser`, {
    method: "GET",
    credentials: "include",
  });
  if (res.status === 202) {
    const { user } = await res.json();
    console.log(user);
    return { props: { user: user } };
  }
};

export default function App(
  { Component, pageProps }: AppProps,
  { user }: InferGetServerSidePropsType<typeof getServerSideProps>
) {
  return (
    <NextUIProvider>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </NextUIProvider>
  );
}
