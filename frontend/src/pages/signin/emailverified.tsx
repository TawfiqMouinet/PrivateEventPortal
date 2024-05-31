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

export default function Unverified() {
  useEffect(() => {
    toast.success("Email Verified Successfully!", { icon: "📧" });
  }, []);
  return (
    <main className="h-screen w-screen">
      <GuestNav />
      <Card className="w-3/4 mx-auto my-40">
        <CardHeader className="text-3xl justify-center ">
          Email Verified Successfully!
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            Thank you for verifying your email. After receiving approval from an
            administrator, you will be able to sign in. Thank you for your
            patience.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
