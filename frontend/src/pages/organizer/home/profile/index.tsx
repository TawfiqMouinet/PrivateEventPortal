import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
} from "@nextui-org/react";
import { useState } from "react";
import { apiurl } from "@/context/apiURL";
import OrganizerNav from "@/components/OrganizerNav";
import { useUserContext } from "@/hooks/useUserContext";

export default function Home() {
  const { user } = useUserContext();
  console.log("Profile User: ", user);
  return (
    <main className="h-screen ">
      <OrganizerNav />
      <Card className="w-3/4 mx-auto my-14">
        <CardHeader className="text-3xl justify-center ">
          Welcome! You are now logged in.
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            Here you will find your profile information.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
