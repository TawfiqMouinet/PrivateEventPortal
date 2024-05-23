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
import AuthNav from "@/components/AuthNav";

export default function Home() {
  return (
    <main className="h-screen ">
      <AuthNav />
      <Card className="w-3/4 mx-auto my-14">
        <CardHeader className="text-3xl justify-center ">
          Welcome! You are now logged in.
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            You can now access your account and make changes to your profile.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
