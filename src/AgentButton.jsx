import { LuMessageCircleMore } from "react-icons/lu";

export function AgentButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-10 right-10 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg transition hover:scale-105"
    >
      <LuMessageCircleMore className="h-6 w-6" />
    </button>
  );
}
