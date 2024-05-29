import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import GateLogo from "@/assets/Gate";
import { apiurl } from "@/context/apiURL";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useUserContext } from "@/hooks/useUserContext";

export default function AdminNav() {
  const { user } = useUserContext();
  const router = useRouter();
  async function handleLogOut() {
    const res = await fetch(`${apiurl}/api/auth/logout`, {
      method: "GET",
      credentials: "include",
    });
    if (res.status === 200) {
      router.replace("/");
    }
  }

  useEffect(() => {
    if (user && user?.role !== "ADMIN") {
      router.replace(`/${user?.role.toLowerCase()}/home`);
    }
  }, [user]);

  return (
    <Navbar
      maxWidth="full"
      height="5rem"
      classNames={{
        item: [
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
      isBordered
    >
      <NavbarBrand className="ml-4">
        <GateLogo width={35} height={35} />
        <p className="font-semibold text-2xl text-black ml-2 mt-1">
          EventPortal
        </p>
      </NavbarBrand>

      <NavbarContent justify="end" className="mr-4">
        <NavbarItem>
          <Button
            color="primary"
            size="lg"
            className="text-medium"
            onPress={handleLogOut}
          >
            Log Out
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
