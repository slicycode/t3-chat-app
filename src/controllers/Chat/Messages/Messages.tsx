import type { ChatState, User } from "../Chat";
import MessagesSection from "../MessagesSection/MessagesSection";
import NewConversationUserInput from "../NewConversationUserInput/NewConversationUserInput";
import MessagesHeader from "./MessagesHeader/MessagesHeader";
import MessagesTextArea from "../MessagesTextArea/MessagesTextArea";

export interface MessagesState {
  addToConvoQueue: (conversationId: string, recipient: User) => void;
  closeMessages: () => void;
}

type Props = Omit<ChatState, "setCurrentConversationId"> &
  MessagesState & {
    queueLength: number;
  };

export default function Messages({
  currentRecipient,
  currentConversationId,
  setCurrentRecipient,
  queueLength,
  addToConvoQueue,
  closeMessages,
}: Props) {
  return (
    <div
      className={`fixed bottom-0 right-0 flex flex-col space-y-5 rounded-xl bg-level1 p-5 px-5 shadow-sm max-md:left-0 max-md:top-0 md:bottom-4 md:right-4 md:h-[540px] md:w-96 ${
        queueLength ? "md:right-[76px]" : ""
      }`}
    >
      <MessagesHeader
        currentRecipient={currentRecipient}
        addToConvoQueue={addToConvoQueue}
        closeMessages={closeMessages}
        currentConversationId={currentConversationId}
      />
      {currentRecipient === null && (
        <NewConversationUserInput setCurrentRecipient={setCurrentRecipient} />
      )}
      <MessagesSection currentRecipient={currentRecipient} />
      {currentRecipient !== null && <MessagesTextArea />}
    </div>
  );
}
