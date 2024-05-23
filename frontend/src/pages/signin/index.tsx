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
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import GuestNav from "@/components/GuestNav";

export default function SignIn() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignIn() {
    const res = await fetch(`${apiurl}/api/auth/login`, {
      body: JSON.stringify({
        email,
        password,
      }),
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (res.status === 200) {
      router.replace("/home");
    } else if (res.status === 403) {
      router.replace("/signin/unverified");
    }
  }

  return (
    <main className="h-screen w-screen ">
      <GuestNav />
      <Card className="w-2/3 mx-auto my-14">
        <CardHeader className="text-2xl">Sign In:</CardHeader>
        <CardBody>
          <div className=" flex gap-4 my-3">
            <Input
              type="email"
              label="Email"
              isRequired
              onValueChange={setEmail}
            />
            <Input
              type={isVisible ? "text" : "password"}
              label="Password"
              isRequired
              onValueChange={setPassword}
              endContent={
                <Button onClick={() => setIsVisible(!isVisible)} variant="flat">
                  {isVisible ? "Hide" : "Show"}
                </Button>
              }
            />
          </div>
        </CardBody>
        <CardFooter className="flex justify-center">
          <Button
            color="primary"
            size="lg"
            variant={!email || !password ? "faded" : "flat"}
            isDisabled={!email || !password}
            onPress={handleSignIn}
          >
            Sign In
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
