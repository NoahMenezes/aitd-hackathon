import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-background overflow-hidden">
      <Navbar />
      <Hero />
    </main>
  );
}
