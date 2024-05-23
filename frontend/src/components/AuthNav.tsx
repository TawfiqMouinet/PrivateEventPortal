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

export default function AuthNav() {
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
  return (
    <Navbar maxWidth="full" height="5rem" className="" isBordered>
      <NavbarBrand className="ml-4">
        <GateLogo width={35} height={35} />
        <p className="font-semibold text-2xl text-black ml-2 mt-1">
          EventPortal
        </p>
      </NavbarBrand>
      <NavbarContent justify="center" className="mr-4">
        <NavbarItem></NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end" className="mr-4">
        <NavbarItem>
          <Button
            color="primary"
            size="md"
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
