import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  DatePicker,
  DateValue,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { useMemo, useState } from "react";
import { UploadDropZone } from "../api/uploadthing";
import { apiurl } from "@/context/apiURL";
import GuestNav from "@/components/GuestNav";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { FaEye } from "react-icons/fa6";
import { FaEyeSlash } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";

export default function SignUp() {
  const [isVisible, setIsVisible] = useState(false);
  const [docURL, setDocURL] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [dob, setDob] = useState<DateValue | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<"ATTENDEE" | "ORGANIZER">("ATTENDEE");
  const [password, setPassword] = useState<string | null>(null);
  const [captchaSuccess, setCaptchaSuccess] = useState(false);
  const router = useRouter();
  const regex = /^(?=.*\d)(?=.*[!@#$%^&*_])(?=.*[a-z])(?=.*[A-Z]).{12,}$/;
  function calculate_age(dob: Date) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    var age = Math.abs(age_dt.getUTCFullYear() - 1970);
    return age;
  }

  async function handleSignUp() {
    const res = await fetch(`${apiurl}/api/auth/register`, {
      body: JSON.stringify({
        name,
        dob: dob?.toDate("UTC"),
        role,
        email,
        password,
      }),
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    });
    const newUser = await res.json();
    if (res.ok) {
      const newDoc = await fetch(`${apiurl}/api/docs/create`, {
        credentials: "include",
        body: JSON.stringify({ docURL: docURL, user: newUser.user }),
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      });
      if (newDoc.status === 201) {
        const sendEmail = await fetch(`${apiurl}/api/auth/sendverification`, {
          credentials: "include",
          body: JSON.stringify({
            email: newUser.user.email,
            name: newUser.user.name,
          }),
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
        });
        if (sendEmail.status === 200) {
          const res1 = await fetch(
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
                  toEmail: email,
                  verificationLink: (await sendEmail.json()).link,
                  to_name: name,
                },
              }),
            }
          );
          if (res1.ok) {
            toast("Verification Email Sent", { icon: "✔️" });
            router.replace("/signup/thanks");
          }
        }
      }
    }
  }

  const isInvalidPassword = useMemo(() => {
    if (!password) return false;

    return regex.test(password!) ? false : true;
  }, [password]);

  const isInvalidAge = useMemo(() => {
    if (!dob) return false;
    if (calculate_age(dob!.toDate("UTC")) < 18) {
      return true;
    } else return false;
  }, [dob]);

  async function onCaptchaChange(value: any) {
    setCaptchaSuccess(true);
  }

  return (
    <main className="">
      <GuestNav />
      <Card className="w-2/3 h-5/6 mx-auto my-10">
        <CardHeader className="text-2xl font-semibold ml-8">
          Sign Up:
        </CardHeader>
        <CardBody className="px-12">
          <div className=" flex flex-row gap-4 my-3">
            <Input
              type="text"
              label="Full Name"
              isRequired
              onValueChange={setName}
            />
            <DatePicker
              label="Date of Birth"
              onChange={setDob}
              isInvalid={isInvalidAge}
              errorMessage={
                isInvalidAge && "You must be at least 18 years old to sign up."
              }
              isRequired
              showMonthAndYearPickers
            />
            <Select value={role} label="Role" isRequired>
              <SelectItem
                key="ATTENDEE"
                value="Attendee"
                onClick={() => setRole("ATTENDEE")}
              >
                Attendee
              </SelectItem>
              <SelectItem
                key="ORGANIZER"
                value="Organizer"
                onClick={() => setRole("ORGANIZER")}
              >
                Organizer
              </SelectItem>
            </Select>
          </div>
          <div className=" flex flex-row gap-4 my-3">
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
              isInvalid={isInvalidPassword}
              errorMessage="Password must be at least 12 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
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
          {!docURL && (
            <div>
              <p className="text-center">
                Please upload an image of your government-issued ID:
              </p>
              <UploadDropZone
                endpoint="imageUploader"
                config={{ mode: "auto" }}
                appearance={{ container: "h-2/3" }}
                onClientUploadComplete={(res) => {
                  toast("Upload Completed", { icon: "✔️" });
                  setDocURL(res[0].url);
                }}
                onUploadError={(error: Error) => {
                  toast("Upload Failed", { icon: "❌" });
                }}
              />
            </div>
          )}
          {docURL && (
            <div className="text-center align-middle w-full">
              <p className="text-xl m-auto mb-5">ID Successfully Uploaded</p>
              <div className="flex flex-row justify-center">
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                  onChange={onCaptchaChange}
                />
              </div>
            </div>
          )}
        </CardBody>
        <CardFooter className="flex justify-center">
          <Button
            color="primary"
            size="lg"
            variant={!docURL || !email || !password || !name ? "faded" : "flat"}
            isDisabled={
              !docURL ||
              !email ||
              !password ||
              !name ||
              isInvalidPassword ||
              isInvalidAge ||
              !captchaSuccess
            }
            onPress={handleSignUp}
          >
            Sign Up
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
