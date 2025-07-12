import { Button } from "./ui/button";

export default function ButtonTest() {
  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Shadcn/ui Button Test</h2>
      
      <div className="flex gap-4 flex-wrap">
        <Button>Default</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="destructive">Destructive</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
      </div>
      
      <div className="flex gap-4 flex-wrap">
        <Button size="sm">Small</Button>
        <Button size="default">Default</Button>
        <Button size="lg">Large</Button>
        <Button size="icon">🎯</Button>
      </div>
      
      <div className="flex gap-4 flex-wrap">
        <Button disabled>Disabled</Button>
      </div>
    </div>
  );
} 