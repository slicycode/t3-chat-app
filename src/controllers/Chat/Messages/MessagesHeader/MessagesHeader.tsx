import IconButton from "~/components/IconButton/IconButton";
import type { ChatState } from "../../Chat";
import { IoRemoveOutline, IoCloseOutline } from "react-icons/io5";
import Image from "next/image";
import type { MessagesState } from "../Messages";

type Props = Omit<
  ChatState,
  "setCurrentConversationId" | "setCurrentRecipient"
> &
  MessagesState;

export default function MessagesHeader({
  currentRecipient,
  closeMessages,
  currentConversationId,
  addToConvoQueue,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      {!currentRecipient ? (
        <p>New Message</p>
      ) : (
        <div className="flex items-center space-x-2">
          <Image
            src={currentRecipient.image}
            alt="avatar profile image"
            width={128}
            height={128}
            className="h-11 w-11 rounded-full"
          />
          <div className="flex flex-col">
            <p>{currentRecipient.name}</p>
            <p className="text-sm text-tertiaryText">
              {currentRecipient.username}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center">
        {currentRecipient && (
          <IconButton
            onClick={() =>
              addToConvoQueue(currentConversationId!, currentRecipient)
            }
          >
            <IoRemoveOutline />
          </IconButton>
        )}
        <IconButton onClick={closeMessages}>
          <IoCloseOutline />
        </IconButton>
      </div>
    </div>
  );
}
