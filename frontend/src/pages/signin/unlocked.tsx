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

export default function Unlocked() {
  useEffect(() => {
    toast("Account Unlocked Successfully!", { icon: "🔓" });
  }, []);
  return (
    <main className="h-screen w-screen">
      <GuestNav />
      <Card className="w-3/4 mx-auto my-40">
        <CardHeader className="text-3xl justify-center ">
          Account Unlocked
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            Thank you for verifying your email. Your account has been unlocked
            successfully. You can now sign in.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
