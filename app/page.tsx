import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Timeline } from "@/components/Timeline";
import { Features } from "@/components/Features";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative z-10">
      <Navbar />
      <Hero />
      <Features />
      <Timeline />
      <footer className="py-12 border-t border-border text-center text-sm text-muted-foreground bg-background/80 backdrop-blur-sm">
        © 2026 FinPilot AI. All rights reserved.
      </footer>
    </main>
  );
}
