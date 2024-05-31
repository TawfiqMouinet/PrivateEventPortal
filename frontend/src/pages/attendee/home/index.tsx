import {
  Card,
  CardHeader,
  CardBody,
  Listbox,
  ListboxItem,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import AttendeeNav from "@/components/AttendeeNav";
import { useUserContext } from "@/hooks/useUserContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { apiurl } from "@/context/apiURL";
import { FaArrowTrendUp, FaBolt, FaCircle } from "react-icons/fa6";
import toast from "react-hot-toast";
import { useEffect } from "react";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await fetch(`${apiurl}/api/auth/getuser`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  if (user.status !== 202) {
    return {
      props: {
        redirect: {
          destination: "/signin",
          permanent: false,
        },
      },
    };
  } else {
    const userData = await user.json();
    if (!userData.user.verified || !userData.user.emailVerified) {
      return {
        props: {
          redirect: {
            destination: "/signin/unverified",
            permanent: false,
          },
        },
      };
    }
  }
  const res = await fetch(`http://localhost:4000/api/registrations/get`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  const regEvents = (await res.json()).map((reg: any) => reg.event);

  return { props: { regEvents: regEvents } };
}

export default function Home({
  regEvents,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUserContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function calculate_days(dob: Date) {
    var diff_ms = Date.now() - dob.getTime();
    var daysDiff = Math.round(diff_ms / (1000 * 60 * 60 * 24));
    return daysDiff;
  }
  async function handleConsent() {
    const res = await fetch(`${apiurl}/api/auth/consent`, {
      method: "PUT",
      credentials: "include",
    });
    if (res.status === 200) {
      onOpenChange();
      toast("Thank you for your trust!", { icon: "🙏" });
    }
  }
  useEffect(() => {
    if (user && !user.consented) {
      onOpen();
    }
  }, [user]);
  return (
    <main className="h-screen ">
      <AttendeeNav />
      {user && (
        <>
          <div className="flex flex-row justify-center w-screen">
            <div className="grid grid-cols-3 grid-rows-2 max-w-[1200px] gap-2">
              <Card className="my-7 mt-10">
                <CardHeader className="text-3xl justify-center ">
                  Number of events you participated in:
                </CardHeader>
                <CardBody>
                  {regEvents && (
                    <h1 className=" flex justify-center gap-5 text-6xl pb-4 text-primary">
                      {regEvents.length}
                      <FaBolt />
                    </h1>
                  )}
                  {!regEvents && "You haven't participated in any events yet."}
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
                  {regEvents && (
                    <Listbox>
                      {regEvents
                        .filter(
                          (event: any) =>
                            new Date(event.date) >
                            new Date(Date.now() - 7776000000)
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
                  )}
                  {!regEvents && "You haven't participated in any events yet."}
                </CardBody>
              </Card>
            </div>
          </div>
          <Modal
            size="3xl"
            isDismissable={false}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader>
                    <h1 className="font-bold text-3xl">Consent Form:</h1>
                  </ModalHeader>
                  <ModalBody>
                    <h1 className="font-semibold text-2xl">
                      By using our services, you agree to the following terms
                      and conditions:
                    </h1>
                    <ul className="flex-col space-y-6 ml-7 text-xl ">
                      <li className="flex flex-row gap-2">
                        <FaCircle className="text-primary mt-2 text-sm flex-shrink-0" />
                        We will not share your personal information with any
                        third party.
                      </li>
                      <li className="flex flex-row gap-2 ">
                        <FaCircle className="text-primary mt-2 text-sm flex-shrink-0" />
                        We will not use your personal information for any
                        purpose other than the intended purpose.
                      </li>
                      <li className="flex flex-row gap-2 flex-shrink-0">
                        <FaCircle className="text-primary mt-2 text-sm flex-shrink-0" />
                        We will not use your personal information for any
                        marketing purposes.
                      </li>
                      <li className="flex flex-row gap-2 flex-shrink-0">
                        <FaCircle className="text-primary mt-2 text-sm flex-shrink-0" />
                        We will not use your personal information for any
                        research purposes.
                      </li>
                      <li className="flex flex-row gap-2 flex-shrink-0">
                        <FaCircle className="text-primary mt-2 text-sm flex-shrink-0" />
                        We will use cookies strictly for authentication and
                        session persistence.
                      </li>
                    </ul>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      size="lg"
                      onPress={handleConsent}
                      color="primary"
                      className="text-lg font-semibold"
                    >
                      I Consent
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </>
      )}
    </main>
  );
}
