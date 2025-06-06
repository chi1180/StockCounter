import BoughtGraph from "@/components/bought-graph";
import Footer from "@/components/Footer";
import Header from "@/components/header";

export default function Home() {
  return (
    <>
      <Header />

      <main className="p-3 sm:p-6">
        <BoughtGraph />
      </main>

      <Footer />
    </>
  );
}
