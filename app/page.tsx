import BoughtGraph from "@/components/bought-graph";
import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />

      <main className="p-6">
        <BoughtGraph />
      </main>
    </>
  );
}
