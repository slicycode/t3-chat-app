import Image from "next/image";
import { IoMoonOutline } from "react-icons/io5";
import IconButton from "../IconButton/IconButton";
import Chat from "~/controllers/Chat/Chat";

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 flex h-14 w-full items-center justify-end space-x-2 bg-level1 px-4 shadow-sm">
      <IconButton>
        <IoMoonOutline />
      </IconButton>

      <Chat />
      <div className="flex h-10 w-10 items-center justify-center">
        <Image
          alt="avatar image"
          src="https://res.cloudinary.com/esport-coaching/image/upload/v1679943176/esport-coaching_media/hn2dts8isvugah7n93a4.jpg"
          className="h-8 w-8 rounded-full"
          width={128}
          height={128}
        />
      </div>
    </nav>
  );
}
