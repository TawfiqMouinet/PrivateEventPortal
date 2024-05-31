import GuestNav from "@/components/GuestNav";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
} from "@nextui-org/react";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function EmailUnverified() {
  return (
    <main className="h-screen w-screen">
      <GuestNav />
      <Card className="w-3/4 mx-auto my-40">
        <CardHeader className="text-3xl justify-center ">
          Account Locked
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            Due to multiple failed login attempts, your account has been locked.
            Please re-verify your email to unlock your account. We already sent
            you a link.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
