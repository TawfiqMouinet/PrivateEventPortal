import {
  Card,
  CardHeader,
  CardBody,
  Listbox,
  ListboxItem,
  Chip,
} from "@nextui-org/react";
import AttendeeNav from "@/components/AttendeeNav";
import { useUserContext } from "@/hooks/useUserContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { apiurl } from "@/context/apiURL";
import { FaArrowTrendUp, FaBolt } from "react-icons/fa6";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res1 = await fetch(`${apiurl}/api/registrations/get`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  const regEvents = (await res1.json()).map((reg: any) => reg.event);

  return { props: { regEvents: regEvents } };
}

export default function Home({
  regEvents,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUserContext();

  function calculate_days(dob: Date) {
    var diff_ms = Date.now() - dob.getTime();
    var daysDiff = Math.round(diff_ms / (1000 * 60 * 60 * 24));
    return daysDiff;
  }
  return (
    <main className="h-screen ">
      <AttendeeNav />
      {user && (
        <div className="flex flex-row justify-center w-screen">
          <div className="grid grid-cols-3 grid-rows-2 max-w-[1200px] gap-2">
            <Card className="my-7 mt-10">
              <CardHeader className="text-3xl justify-center ">
                Number of events you participated in:
              </CardHeader>
              <CardBody>
                <h1 className=" flex justify-center gap-5 text-6xl pb-4 text-primary">
                  {regEvents.length}
                  <FaBolt />
                </h1>
              </CardBody>
            </Card>
            <Card className="my-7 mt-10">
              <CardHeader className="text-3xl justify-center ">
                Days you{"'"}ve been a member:
              </CardHeader>
              <CardBody>
                <h1 className=" flex justify-center gap-5 text-6xl pb-4 text-primary">
                  {calculate_days(new Date(user.createdAt))}
                  <FaArrowTrendUp />
                </h1>
              </CardBody>
            </Card>
            <Card className="my-7 mt-10">
              <CardHeader className="text-3xl justify-center ">
                Events you participated in during the past three months:
              </CardHeader>
              <CardBody>
                <Listbox>
                  {regEvents
                    .filter(
                      (event: any) =>
                        new Date(event.date) > new Date(Date.now() - 7776000000)
                    )
                    .map((event: any) => (
                      <ListboxItem key={event.id}>
                        <div className="flex flex-row ">
                          <Chip
                            variant="dot"
                            className="border-none my-1"
                            color="primary"
                          />
                          <h1 className="text-xl font-semibold text-primary">
                            {event.title} -{" "}
                            {
                              new Date(event.date)
                                .toUTCString()
                                .split(" 00:")[0]
                            }
                          </h1>
                        </div>
                      </ListboxItem>
                    ))}
                </Listbox>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </main>
  );
}
