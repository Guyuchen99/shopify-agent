import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { Spinner } from "@heroui/spinner";
import axios from "axios";
import { useRef, useState } from "react";
import { AgentButton } from "./AgentButton";

export default function Widget() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [messages, setMessages] = useState([{ role: "ai", text: "How can I help you today?" }]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() && !imageFile) return;

    setMessages((prev) => [...prev, { role: "user", text: query || "[Uploaded Image]" }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("query", query);
      if (imageFile) formData.append("image", imageFile);

      setQuery("");
      setImageFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      const { data } = await axios.post("http://localhost:8000/chat", formData);

      const newMessages = [{ role: "ai", text: data.generated || "Sorry, no match found." }];

      if (Array.isArray(data.recommendations)) {
        data.recommendations.forEach((product) => {
          newMessages.push({
            role: "ai",
            text: (
              <div className="my-3 w-full rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
                {product.images?.[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.product_name}
                    className="mb-2 h-32 w-full rounded object-contain"
                  />
                )}
                <div className="text-sm font-semibold text-gray-800">{product.product_name}</div>
              </div>
            ),
          });
        });
      }

      setMessages((prev) => [...prev, ...newMessages]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: "Something went wrong on the server. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AgentButton onClick={onOpen} />

      <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="opaque">
        <ModalContent className="!fixed !bottom-12 !right-6 w-96">
          <ModalHeader className="border-b px-4 py-2 text-base font-semibold text-black">AI Assistant</ModalHeader>

          <ModalBody className="max-h-80 min-h-80 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-2 w-fit max-w-[85%] rounded-md px-3 py-2 ${
                  msg.role === "ai" ? "bg-gray-100 text-gray-700" : "ml-auto bg-blue-500 text-white"
                }`}
              >
                {typeof msg.text === "string" ? msg.text : <div className="w-full">{msg.text}</div>}
              </div>
            ))}
            {loading && (
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <Spinner size="sm" className="text-blue-500" />
                Generating response...
              </div>
            )}
          </ModalBody>

          <ModalFooter className="border-t px-3 py-2">
            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2" encType="multipart/form-data">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                ref={fileInputRef}
              />
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Ask me something..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="text-sm"
                />
                <Button type="submit" size="sm" className="bg-blue-400 text-white" isDisabled={loading}>
                  Send
                </Button>
              </div>
            </form>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
