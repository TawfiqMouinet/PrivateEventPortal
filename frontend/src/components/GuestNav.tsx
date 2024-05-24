import {
  Navbar,
  NavbarContent,
  NavbarBrand,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import GateLogo from "@/assets/Gate";

export default function GuestNav() {
  return (
    <Navbar maxWidth="full" height="5rem" isBordered>
      <NavbarBrand className="ml-4">
        <Link href={"/"}>
          <GateLogo width={40} height={40} />
          <p className="font-semibold text-3xl text-black ml-2 mt-1">
            EventPortal
          </p>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end" className="mr-4">
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/signup"
            size="lg"
            className="text-lg"
          >
            Sign Up
          </Button>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            color="primary"
            href="/signin"
            size="lg"
            className="text-lg"
          >
            Sign In
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
