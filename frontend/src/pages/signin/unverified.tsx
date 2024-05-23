import GuestNav from "@/components/GuestNav";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
} from "@nextui-org/react";

export default function Unverified() {
  return (
    <main className="h-screen w-screen">
      <GuestNav />
      <Card className="w-3/4 mx-auto my-40">
        <CardHeader className="text-3xl justify-center ">
          Unverified Account
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            Your account has not been verified. Please await verification by an
            administrator. Thank you for your patience.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
