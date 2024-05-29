import { Card, CardHeader, CardBody } from "@nextui-org/react";
import { useContext, useState } from "react";
import AuthNav from "@/components/AttendeeNav";
import { UserContext } from "@/context/UserContext";

export default function Home() {
  const user = useContext(UserContext)?.user;
  return (
    <main className="h-screen ">
      <AuthNav />
      <Card className="w-3/4 mx-auto my-14">
        <CardHeader className="text-3xl justify-center ">
          Welcome! You are now logged in.
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            Here you will find your event registrations.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
