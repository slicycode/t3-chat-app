import Image from "next/image";
import { type Dispatch, type SetStateAction, useState } from "react";
import IconButton from "~/components/IconButton/IconButton";
import Conversations from "./Conversations/Conversations";
import Messages from "./Messages/Messages";
import { IoChatboxOutline } from "react-icons/io5";

export interface User {
  id: string;
  username: string;
  image: string;
  name: string;
}

export interface ChatState {
  currentConversationId: string | null;
  currentRecipient: User | null;
  setCurrentConversationId: Dispatch<SetStateAction<string | null>>;
  setCurrentRecipient: Dispatch<SetStateAction<User | null>>;
}

export default function Chat() {
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [currentRecipient, setCurrentRecipient] = useState<User | null>(null);
  const [conversationQueue, setConversationQueue] = useState<
    { conversationId: string; recipient: User }[]
  >([]);
  const [showConversations, setShowConversations] = useState(false);

  const selectConversation = (
    currentConversationId: string,
    recipient: User | null
  ) => {
    setCurrentConversationId(currentConversationId);
    setCurrentRecipient(recipient);
    setShowConversations(false);
  };

  const addToConvoQueue = (conversationId: string, recipient: User) => {
    setConversationQueue((queue) => [{ conversationId, recipient }, ...queue]);
    closeMessages();
  };

  const removeFromConvoQueue = (conversationId: string) => {
    setConversationQueue((queue) =>
      queue.filter((convoEntry) => convoEntry.conversationId !== conversationId)
    );
  };

  const closeMessages = () => {
    setCurrentConversationId(null);
    setCurrentRecipient(null);
  };

  return (
    <div>
      <IconButton
        onClick={() => setShowConversations((conversations) => !conversations)}
        shouldFill={showConversations}
      >
        <IoChatboxOutline />
      </IconButton>
      {showConversations && (
        <Conversations selectConversation={selectConversation} />
      )}
      {currentConversationId && (
        <Messages
          currentRecipient={currentRecipient}
          currentConversationId={currentConversationId}
          setCurrentRecipient={setCurrentRecipient}
          closeMessages={closeMessages}
          addToConvoQueue={addToConvoQueue}
          queueLength={conversationQueue.length}
        />
      )}
      {conversationQueue.length > 0 && (
        <ul className="fixed bottom-4 right-4 space-y-3 leading-[0]">
          {conversationQueue.map((convoEntry) => {
            return (
              <li key={convoEntry.conversationId}>
                <button
                  onClick={() => {
                    setCurrentConversationId(convoEntry.conversationId);
                    setCurrentRecipient(convoEntry.recipient);
                    removeFromConvoQueue(convoEntry.conversationId);
                  }}
                >
                  <Image
                    src={convoEntry.recipient.image}
                    alt="profile picture"
                    width={64}
                    height={64}
                    className="h-12 w-12 rounded-full"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
