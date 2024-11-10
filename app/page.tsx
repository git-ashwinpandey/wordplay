import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen pt-[10vh]">
      <div className="flex flex-col gap-4 items-center justify-between w-full max-w-2xl mx-auto px-4">
        {/* HEAD */}
        <div className="text-center w-full">
          <h1 className="text-3xl font-bold mb-2">Wordplay Sprint</h1>
          <p className="text-lg mb-4 text-center mx-auto max-w-prose break-words">Wordplay Spring is a fast-paced word game that challenges players to think creatively and quickly, naming a word starting with a specific letter for each category: Name, Place, Animal, Thing.</p>
          {/* <Image src="/images/wordplay.jpg" alt="Wordplay" width={500} height={500} /> */}
        </div>

        {/* BODY */}
        <div className="flex flex-col gap-2 sm:max-w-md">

          <div className="flex flex-col xxs:flex-row gap-2 w-full">
            <Link href="/create-game" passHref>
              <Button>Create Lobby</Button>
            </Link>
            <Separator orientation="vertical" className="hidden sm:block mx-1" />
            <Link href="/join-lobby" passHref>
              <Button>Join Lobby</Button>
            </Link>
          </div>

          <Separator className="" />
          <Link href="/how-to-play" passHref>
            <Button className="w-full">How to Play</Button>
          </Link>
        </div>

      </div>
    </div>


  );
}
