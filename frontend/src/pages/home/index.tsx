import { Card, CardHeader, CardBody } from "@nextui-org/react";
import AuthNav from "@/components/AttendeeNav";
import { useUserContext } from "@/hooks/useUserContext";

export default function Home() {
  const { user } = useUserContext();
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
