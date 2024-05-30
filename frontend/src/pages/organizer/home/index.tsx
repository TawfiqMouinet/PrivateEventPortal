import {
  Card,
  CardHeader,
  CardBody,
  Listbox,
  ListboxItem,
  Chip,
} from "@nextui-org/react";
import OrganizerNav from "@/components/OrganizerNav";
import { useUserContext } from "@/hooks/useUserContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { apiurl } from "@/context/apiURL";
import { RiH1 } from "react-icons/ri";
import { FaArrowTrendUp, FaBolt, FaUser } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { IoMdCreate } from "react-icons/io";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await fetch(`http://backend:4000/api/events/get`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  const res1 = await fetch(`http://backend:4000/api/registrations/get`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  const regEvents = (await res1.json()).map((reg: any) => reg.event);
  const events = await res.json();

  return { props: { events: events, regEvents: regEvents } };
}

export default function Home({
  events,
  regEvents,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUserContext();
  const ages = events
    .map((event: any) => event.registrations)
    .map((reg: any) => reg.map((r: any) => r.user))
    .flat()
    .filter((userarr: any) => userarr.id !== user?.id)
    .map((user: any) => calculate_age(new Date(user.dob)));
  function calculate_age(dob: Date) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }
  function calculate_days(dob: Date) {
    var diff_ms = Date.now() - dob.getTime();
    var daysDiff = Math.round(diff_ms / (1000 * 60 * 60 * 24));
    return daysDiff;
  }
  return (
    <main className="h-screen ">
      <OrganizerNav />
      {user && (
        <div className="flex flex-row justify-center w-screen">
          <div className="grid grid-cols-3 grid-rows-2 max-w-[1200px] gap-2">
            <Card className="my-7 mt-10">
              <CardHeader className="text-3xl justify-center ">
                Users registered in your events:
              </CardHeader>
              <CardBody>
                <h1 className=" flex justify-center gap-5 text-6xl pb-4 text-primary">
                  {
                    events
                      .map((event: any) => event.registrations)
                      .filter((reg: any) => reg[0].userId !== user?.id).length
                  }
                  <FaUser />
                </h1>
              </CardBody>
            </Card>
            <Card className="my-7 mt-10">
              <CardHeader className="text-3xl justify-center ">
                Average age of your participants:
              </CardHeader>
              <CardBody>
                <h1 className=" flex justify-center gap-5 text-6xl pb-4 text-primary">
                  {!Number.isNaN(
                    ages.reduce((a: number, b: number) => a + b, 0) /
                      ages.length
                  ) &&
                    (
                      ages.reduce((a: number, b: number) => a + b, 0) /
                      ages.length
                    ).toPrecision(3)}
                  {Number.isNaN(
                    ages.reduce((a: number, b: number) => a + b, 0) /
                      ages.length
                  ) && "N/A"}
                  <FaCalendarAlt />
                </h1>
              </CardBody>
            </Card>
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
            <Card className="my-7">
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
            <Card className="my-7">
              <CardHeader className="text-3xl justify-center ">
                Number of events you created:
              </CardHeader>
              <CardBody>
                <h1 className=" flex justify-center gap-5 text-6xl pb-4 text-primary">
                  {
                    events.filter((event: any) => event.organizerId === user.id)
                      .length
                  }
                  <IoMdCreate />
                </h1>
              </CardBody>
            </Card>
            <Card className="my-7">
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
