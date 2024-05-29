import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  DatePicker,
  DateValue,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { apiurl } from "@/context/apiURL";
import { useUserContext } from "@/hooks/useUserContext";
import { parseDate } from "@internationalized/date";
import AttendeeNav from "@/components/AttendeeNav";
import toast from "react-hot-toast";

export default function Home() {
  const { user } = useUserContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState<DateValue | null>(null);
  useEffect(() => {
    if (user) {
      setName(user?.name!);
      setDob(parseDate(user?.dob.toString().slice(0, 10)!));
      setEmail(user?.email!);
    }
  }, [user]);
  async function handleProfileUpdate() {
    const res = await fetch(`${apiurl}/api/auth/update`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        dob: dob?.toDate("UTC"),
      }),
    });
    if (res.ok) {
      toast("Profile updated successfully.", { icon: "✔️" });
    } else {
      toast("Failed to update profile.", { icon: "❌" });
    }
  }

  return (
    <main className="h-screen">
      <AttendeeNav />
      {user && (
        <div className="flex justify-center mt-6">
          <Card className="w-2/3">
            <CardHeader className="flex flex-col gap-1">
              Your Account Information:
            </CardHeader>
            <CardBody>
              <div className=" flex flex-row gap-4 my-3">
                <Input
                  type="text"
                  label="Name"
                  value={name}
                  isRequired
                  onValueChange={setName}
                />
                <Input
                  type="text"
                  label="Email"
                  value={email}
                  isRequired
                  onValueChange={setEmail}
                />
                <DatePicker
                  label="Date of Birth"
                  value={dob}
                  onChange={setDob}
                  isRequired
                  showMonthAndYearPickers
                />
              </div>
              <div className=" flex flex-row gap-4 my-3"></div>
            </CardBody>
            <CardFooter className="flex justify-end">
              <Button
                color="primary"
                onPress={handleProfileUpdate}
                className="mr-5"
              >
                Save
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  );
}
