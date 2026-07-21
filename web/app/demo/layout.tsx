import DemoHeader from "@/components/DemoHeader";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-wwgSurface">
      <DemoHeader />
      <main>{children}</main>
    </div>
  );
}
