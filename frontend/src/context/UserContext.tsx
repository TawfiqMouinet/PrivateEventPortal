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
}

export interface UserAction {
  type: "LOGIN" | "LOGOUT";
  payload: User;
}

export const UserContext = createContext<{ user: User | null } | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const router = useRouter().asPath;
  console.log(router);
  useEffect(() => {
    console.log("Fetching User");
    async function fetchUser() {
      const res = await fetch(`${apiurl}/api/auth/getuser`, {
        method: "GET",
        credentials: "include",
      });
      if (res.status === 202) {
        setUser((await res.json()).user);
      }
    }
    fetchUser();
  }, [router]);
  return (
    <UserContext.Provider value={{ user: user }}>
      {children}
    </UserContext.Provider>
  );
}
