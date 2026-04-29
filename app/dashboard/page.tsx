import { Navbar } from "@/components/Navbar"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

import data from "./data.json"

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col relative z-20">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div 
          className="w-full max-w-7xl h-[85vh] rounded-3xl overflow-hidden flex flex-col bg-background shadow-[0_32px_120px_-10px_rgba(0,0,0,0.12)] border border-border"
        >
          <TooltipProvider delayDuration={0}>
            <div className="flex flex-1 flex-col overflow-auto bg-background">
              <SiteHeader />
              <div className="flex flex-1 flex-col overflow-auto">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 max-w-6xl mx-auto w-full">
                    <SectionCards />
                    <div className="px-4 lg:px-6">
                      <ChartAreaInteractive />
                    </div>
                    <DataTable data={data} />
                  </div>
                </div>
              </div>
            </div>
          </TooltipProvider>
        </div>
      </main>
    </div>
  )
}
