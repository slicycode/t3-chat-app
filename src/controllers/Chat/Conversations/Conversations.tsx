import IconButton from "~/components/IconButton/IconButton";
import { IoChevronBack, IoAddOutline } from "react-icons/io5";
import Image from "next/image";
import { User } from "../Chat";

const conversations = [
  {
    userId: "1",
    conversation: {
      id: "2",
      conversationUsers: [
        {
          id: "1",
          name: "Me",
          image:
            "https://res.cloudinary.com/esport-coaching/image/upload/v1679943176/esport-coaching_media/hn2dts8isvugah7n93a4.jpg",
          username: "me",
        },
        {
          id: "3",
          name: "Bachira",
          image:
            "https://res.cloudinary.com/esport-coaching/image/upload/v1679872101/esport-coaching_media/fdesb8zh4ekl79fv4f30.jpg",
          username: "bachira",
        },
      ],
      messages: [
        {
          id: "4",
          messageText: "hello world!",
        },
      ],
    },
  },
];

interface Props {
  selectConversation: (
    currentConversationId: string,
    recipient: User | null
  ) => void;
}

export default function Conversations({ selectConversation }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 flex flex-col space-y-5 bg-level1 p-5 md:bottom-[unset] md:left-[unset] md:right-4 md:top-[76px] md:h-[540px] md:w-96 md:rounded-xl md:shadow-sm">
      <div className="flex items-center justify-between">
        <IconButton className="md:hidden">
          <IoChevronBack />
        </IconButton>
        <p className="text-lg">Messages</p>
        <IconButton onClick={() => selectConversation("newMessage", null)}>
          <IoAddOutline />
        </IconButton>
      </div>
      <ul>
        {conversations.map((conversationInfo) => {
          const recipient =
            conversationInfo.conversation.conversationUsers[0]?.id ===
            conversationInfo.userId
              ? conversationInfo.conversation.conversationUsers[1]
              : conversationInfo.conversation.conversationUsers[0];

          return (
            <li
              className="rounded-lg hover:bg-level1Hover"
              key={conversationInfo.conversation.id}
            >
              <button
                className="mx-2 flex w-full items-center space-x-2 py-2 text-left"
                onClick={() =>
                  selectConversation(
                    conversationInfo.conversation.id,
                    recipient!
                  )
                }
              >
                <Image
                  alt="avatar image"
                  src={recipient!.image}
                  className="h-12 w-12 rounded-full"
                  width={128}
                  height={128}
                />
                <div className="flex flex-col space-y-2">
                  <p>{recipient!.name}</p>
                  <p className="text-sm text-tertiaryText">
                    {conversationInfo.conversation.messages[0]?.messageText}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
