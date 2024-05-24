import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import GuestNav from "@/components/GuestNav";
import Image from "next/image";
import Illustration from "@/assets/Illustration.png";
import AnimatedText from "@/components/AnimatedText";

export default function Landing() {
  return (
    <main>
      <GuestNav />

      <section className="flex flex-col items-center justify-center h-[87.5vh] relative ">
        <Image
          src={Illustration}
          alt="Illustration"
          fill
          style={{ objectFit: "cover" }}
          className="z-0"
        />
        <div className="flex flex-col items-center justify-center z-10 w-screen">
          <h1 className="flex text-7xl font-bold mb-10 ">
            <AnimatedText text="Organize." />
            <AnimatedText text="Participate." className="text-blue-700" />
            <AnimatedText text="Connect." />
          </h1>
          <p className="text-2xl break-words w-[80%] text-center pb-2 mb-7 text-slate-900 font-bold hover:bg-white transition-transform-colors duration-300">
            Unlock exclusive events with our Private Event Portal. Connect with
            like-minded individuals, discover tailored experiences, and engage
            in a secure, private environment. Register today and elevate your
            event journey.
          </p>
          <Button
            color="primary"
            size="lg"
            as={Link}
            href="/signup"
            variant="shadow"
            className="w-64 h-16 text-xl"
          >
            Get Started
          </Button>
        </div>
      </section>
    </main>
  );
}
