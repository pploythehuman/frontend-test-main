import { Button } from "../components/ui/button";

export default function AppSideBar() {
  return (
    <div className="flex w-[250px] flex-col bg-inherit p-2">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="border-brand-500 border-1 h-8 w-auto rounded-full"
            />
          </Button>
          <Button className="rounded-md p-2 hover:bg-neutral-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="text-text-tertiary h-5 w-5"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" />
              <path d="M9 3v18" />
            </svg>
          </Button>
        </div>

        <Button className="w-full">New Chat</Button>
        <Button className="w-full">Clear Chat History</Button>
        <Button className="w-full">Library</Button>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Button key={i} className="w-full">
            first_question
          </Button>
        ))}
      </div>
    </div>
  );
}
