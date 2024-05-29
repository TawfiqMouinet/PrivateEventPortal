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

export default function AttendeeNav() {
  const { user } = useUserContext();
  const router = useRouter();
  const [dashActive, setDashActive] = useState(false);
  const [profileActive, setProfileActive] = useState(false);
  const [registrationsActive, setRegistrationsActive] = useState(false);
  const [eventsActive, setEventsActive] = useState(false);

  useEffect(() => {
    if (router.pathname === "/attendee/home") {
      setDashActive(true);
    } else if (router.pathname === "/attendee/home/profile") {
      setProfileActive(true);
    } else if (router.pathname === "/attendee/home/registrations") {
      setRegistrationsActive(true);
    } else if (router.pathname === "/attendee/home/events") {
      setEventsActive(true);
    }
    if (user && user?.role !== "ATTENDEE") {
      router.replace(`/${user?.role.toLowerCase()}/home`);
    }
  }, [router.pathname, user]);

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
      <NavbarContent justify="center" className="mr-4">
        <NavbarItem isActive={dashActive}>
          <Link
            href="/attendee/home"
            className="text-lg"
            onPress={() => setDashActive(true)}
          >
            Dashboard
          </Link>
        </NavbarItem>
        <NavbarItem isActive={eventsActive}>
          <Link
            href="/attendee/home/events"
            className="text-lg"
            onPress={() => setEventsActive(true)}
          >
            Events
          </Link>
        </NavbarItem>
        <NavbarItem isActive={profileActive}>
          <Link
            href="/attendee/home/profile"
            className="text-lg"
            onPress={() => setProfileActive(true)}
          >
            Profile
          </Link>
        </NavbarItem>
        <NavbarItem isActive={registrationsActive}>
          <Link
            href="/attendee/home/registrations"
            className="text-lg"
            onPress={() => setRegistrationsActive(true)}
          >
            Registrations
          </Link>
        </NavbarItem>
      </NavbarContent>
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
