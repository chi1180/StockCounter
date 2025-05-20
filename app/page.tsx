import BoughtGraph from "@/components/bought-graph";
import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />

      <main className="p-6">
        <div className="flex items-center gap-2 py-12">
          <div className="h-14 w-1.5 bg-(--accent-normal)" />
          <h2 className="text-4xl">売上推移</h2>
        </div>
        <BoughtGraph />
      </main>
    </>
  );
}
