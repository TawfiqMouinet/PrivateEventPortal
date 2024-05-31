import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
} from "@nextui-org/react";
import { useContext, useState } from "react";
import { apiurl } from "@/context/apiURL";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import GuestNav from "@/components/GuestNav";
import { useUserContext } from "@/hooks/useUserContext";
import { UserContext } from "@/context/UserContext";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignIn() {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [isInvalid, setIsInvalid] = useState(false);
  const emailRegEx =
    /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

  const router = useRouter();

  async function handleSignIn() {
    const res = await fetch(`${apiurl}/api/auth/login`, {
      body: JSON.stringify({
        email,
        password,
      }),
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
    });
    if (res.status === 200) {
      const data = await res.json();
      if (data.user.role === "ATTENDEE") {
        router.replace("/attendee/home");
      } else if (data.user.role === "ORGANIZER") {
        router.replace("/organizer/home");
      } else if (data.user.role === "ADMIN") {
        router.replace("/admin/home");
      }
    } else if (res.status === 403) {
      router.replace("/signin/unverified");
    } else if (res.status === 406) {
      router.replace("/signin/emailunverified");
    } else if (res.status === 402) {
      setIsInvalid(true);
      const user = await fetch(`${apiurl}/api/auth/getuserbyemail`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      });
      if (user.ok) {
        const userData = await user.json();
        if (userData.user.emailVerified) {
          if (userData.user.failedLogins < 2) {
            toast(
              `Invalid Credentials, ${
                2 - userData.user.failedLogins
              } attempts left`,
              { icon: "❌" }
            );
          }
          const block = await fetch(`${apiurl}/api/auth/blockemail`, {
            method: "POST",
            body: JSON.stringify({ email, user: userData }),
            headers: {
              "Content-type": "application/json",
            },
            credentials: "include",
          });
          if (block.status === 200) {
            const sendEmail = await fetch(
              `${apiurl}/api/auth/sendverification`,
              {
                credentials: "include",
                body: JSON.stringify({
                  email: userData.user.email,
                  name: userData.user.name,
                }),
                method: "POST",
                headers: {
                  "Content-type": "application/json",
                },
              }
            );
            if (sendEmail.status === 200) {
              const res = await fetch(
                "https://api.emailjs.com/api/v1.0/email/send",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    service_id: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
                    template_id: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
                    user_id: process.env.NEXT_PUBLIC_EMAILJS_USER_ID,
                    template_params: {
                      toEmail: userData.user.email,
                      verificationLink: (await sendEmail.json()).link,
                      to_name: userData.user.name,
                    },
                  }),
                }
              );
              toast(
                "You've reached three failed login attempts. Your account has been blocked. Please re-verify your account through the email we sent you just now.",
                { icon: "❌", position: "top-center", duration: 7000 }
              );
            }
          }
        }
      }
    } else if (res.status === 401) {
      toast("User does not exist.", { icon: "❌" });
    }
  }

  return (
    <main className="h-screen w-screen ">
      <GuestNav />
      <Card className="w-1/2 mx-auto my-14">
        <CardHeader className="text-2xl">Sign In:</CardHeader>
        <CardBody>
          <div className=" flex gap-4 my-3">
            <Input
              type="email"
              label="Email"
              isRequired
              onValueChange={(value) => {
                setEmail(value);
                setIsInvalid(false);
              }}
              isInvalid={isInvalid || (email ? !emailRegEx.test(email) : false)}
              errorMessage={!isInvalid && "Please enter a valid email address."}
            />
            <Input
              type={isVisible ? "text" : "password"}
              label="Password"
              isRequired
              onValueChange={(value) => {
                setPassword(value);
                setIsInvalid(false);
              }}
              isInvalid={isInvalid}
              endContent={
                isVisible ? (
                  <FaEyeSlash
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-2xl cursor-pointer"
                  />
                ) : (
                  <FaEye
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-2xl cursor-pointer"
                  />
                )
              }
            />
          </div>
          {isInvalid && (
            <p className="text-danger text-sm text-center">
              Invalid Credentials. Please try again.
            </p>
          )}
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
