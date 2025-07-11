export default function AppSideBar() {
  return (
    <div className="flex w-[250px] flex-col bg-inherit p-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <button className="flex items-center">
            <img
              src="/logo.png"
              alt="Logo"
              className="border-brand-500 border-1 h-8 w-auto rounded-full"
            />
          </button>
          <button className="p-2">{`<`}</button>
        </div>

        <button className="w-full">New Chat</button>
        <button className="w-full">Clear Chat History</button>
        <button className="w-full">Library</button>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} className="w-full">
            first_question
          </button>
        ))}
      </div>
    </div>
  );
}
