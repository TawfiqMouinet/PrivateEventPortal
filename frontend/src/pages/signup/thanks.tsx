import GuestNav from "@/components/GuestNav";
import { Card, CardHeader, CardBody } from "@nextui-org/react";

export default function Unverified() {
  return (
    <main className="h-screen w-screen">
      <GuestNav />
      <Card className="w-3/4 mx-auto my-40">
        <CardHeader className="text-3xl justify-center ">
          Thank you for signing up!
        </CardHeader>
        <CardBody>
          <p className="text-center text-2xl">
            Your ID will soon be verified by an administrator. Thank you for
            your patience.
          </p>
        </CardBody>
      </Card>
    </main>
  );
}
