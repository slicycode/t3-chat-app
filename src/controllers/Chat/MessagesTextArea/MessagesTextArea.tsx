import IconButton from "~/components/IconButton/IconButton";
import useOnChange from "~/hooks/useOnChange";
import { IoSend } from "react-icons/io5";
import { useEffect, useRef } from "react";

export default function MessagesSection() {
  const {
    values: { message },
    setValues,
    handleChange,
  } = useOnChange({ message: "" });

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextArea = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "";
      textAreaRef.current.style.height = `${Math.min(
        textAreaRef.current.scrollHeight,
        144
      )}px`;
    }
  };

  const sendMessage = () => {
    setValues({ message: "" });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    resizeTextArea();
  }, [message]);

  return (
    <div className="flex items-center space-x-1">
      <textarea
        ref={textAreaRef}
        name="message"
        value={message}
        onKeyDown={onKeyDown}
        onChange={handleChange}
        className="h-10 max-h-36 w-full resize-none rounded-lg bg-level2 px-3 py-2 placeholder:text-quaternaryText focus:outline-none"
        placeholder="Message"
      />
      {message !== "" && (
        <IconButton>
          <IoSend />
        </IconButton>
      )}
    </div>
  );
}
