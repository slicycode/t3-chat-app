import Image from "next/image";
import { IoMoonOutline } from "react-icons/io5";
import IconButton from "../IconButton/IconButton";
import Chat from "~/controllers/Chat/Chat";
import { signIn, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: sessionData } = useSession();

  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-end space-x-2 bg-level1 px-4 shadow-sm">
      {sessionData?.user ? (
        <>
          <IconButton>
            <IoMoonOutline />
          </IconButton>

          <Chat />
          <div className="flex h-10 w-10 items-center justify-center">
            <Image
              alt="avatar image"
              src={sessionData.user.image || ""}
              className="h-8 w-8 rounded-full"
              width={128}
              height={128}
            />
          </div>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign in</button>
      )}
    </nav>
  );
}
