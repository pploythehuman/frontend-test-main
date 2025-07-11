export default function AppSideBar() {
  return (
    <div className="w-[250px] bg-neutral-50 border-r border-gray-200 flex flex-col p-4">
      <div className="space-y-2">
        <button className="w-full">LOGO</button>
        <button className="w-full">{`<`}</button>
        <button className="w-full">New Chat</button>
        <button className="w-full">Clear Chat History</button>
        <button className="w-full">Library</button>
      </div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <button key={i} className="w-full">first_question</button>
        ))}
      </div>
    </div>
  );
}
