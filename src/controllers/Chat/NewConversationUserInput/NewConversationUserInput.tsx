import Image from "next/image";
import { useEffect, useState } from "react";
import useOnChange from "~/hooks/useOnChange";
import { ChatState } from "../Chat";

const users = [
  {
    id: "5",
    name: "Kayden",
    image:
      "https://res.cloudinary.com/esport-coaching/image/upload/v1679275848/esport-coaching_media/ta6zowapbroauge9heem.jpg",
    username: "kayden",
  },
  {
    id: "3",
    name: "Bachira",
    image:
      "https://res.cloudinary.com/esport-coaching/image/upload/v1679872101/esport-coaching_media/fdesb8zh4ekl79fv4f30.jpg",
    username: "bachira",
  },
];

type Props = Pick<ChatState, "setCurrentRecipient">;

export default function NewConversationUserInput({
  setCurrentRecipient,
}: Props) {
  const {
    values: { user },
    setValues,
    handleChange,
  } = useOnChange({
    user: "",
  });

  const [searchResults, setSearchResults] = useState<typeof users>();
  let timer: ReturnType<typeof setTimeout>;

  const fetchUsers = () => {
    if (!user) return setSearchResults([]);
    setSearchResults(
      users.filter(
        (userEntry) =>
          userEntry.name.toLowerCase().includes(user.toLowerCase()) ||
          userEntry.username.toLowerCase().includes(user.toLowerCase())
      )
    );
  };

  useEffect(() => {
    clearTimeout(timer);
    setTimeout(fetchUsers, 200);
  }, [user]);

  return (
    <div className="relative">
      <input
        type="text"
        className="h-10 w-full rounded-lg bg-level2 px-3 py-2 placeholder:text-quaternaryText focus:outline-none"
        placeholder="Search User"
        value={user}
        name="user"
        onChange={handleChange}
        autoComplete="off"
      />
      {searchResults && (
        <ul className="top-[calc(100% + 12px)] absolute left-0 right-0 rounded-lg bg-level2">
          {searchResults.map((userEntry) => (
            <li
              className="first:rounded-t-lg last:rounded-b-lg hover:bg-level2Hover"
              key={userEntry.id}
            >
              <button
                onClick={() => setCurrentRecipient(userEntry)}
                className="flex  w-full p-3 text-left"
              >
                <Image
                  src={userEntry.image}
                  alt="avatar profile image"
                  width={128}
                  height={128}
                  className="mr-2 h-11 w-11 rounded-full"
                />
                <div>
                  <p>{userEntry.name}</p>
                  <p className="text-sm text-tertiaryText">
                    {userEntry.username}
                  </p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
