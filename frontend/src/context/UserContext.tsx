import { createContext, ReactNode, useEffect } from "react";
import React from "react";
import { apiurl } from "./apiURL";
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";

export interface User {
  id: string;
  email: string;
  name: string;
  hashedPassword: string;
  verified: boolean;
  role: "ADMIN" | "ORGANIZER" | "ATTENDEE";
  dob: Date;
  consented: boolean;
  createdAt: Date;
}

export interface UserAction {
  type: "LOGIN" | "LOGOUT";
  payload: User;
}

export const UserContext = createContext<{ user: User | null } | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter();
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`${apiurl}/api/auth/getuser`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 202) {
        const tempUser = (await res.json()).user;
        setUser(tempUser);
        if (
          router.asPath.includes("/signin") ||
          router.asPath.includes("/signup") ||
          router.asPath === "/"
        ) {
          if (tempUser.role === "ATTENDEE") {
            router.replace("/attendee/home");
          } else if (tempUser.role === "ORGANIZER") {
            router.replace("/organizer/home");
          } else if (tempUser.role === "ADMIN") {
            router.replace("/admin/home");
          }
        }
      } else if (
        res.status === 403 &&
        !router.asPath.includes("/signin") &&
        !router.asPath.includes("/signup") &&
        router.asPath !== "/"
      ) {
        router.replace("/signin");
      }
    }
    fetchUser();
  }, [router.asPath]);
  return (
    <UserContext.Provider value={{ user: user }}>
      {children}
    </UserContext.Provider>
  );
}
