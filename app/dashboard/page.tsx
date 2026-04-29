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
    <div className="bg-white min-h-screen flex flex-col relative z-20">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
        <div className="w-full max-w-7xl h-[85vh] bg-background border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <TooltipProvider delayDuration={0}>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "calc(var(--spacing) * 48)",
                  "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
              }
            >
              <AppSidebar variant="inset" className="bg-transparent" />
              <SidebarInset className="bg-transparent overflow-hidden">
                <SiteHeader />
                <div className="flex flex-1 flex-col overflow-auto bg-transparent">
                  <div className="@container/main flex flex-1 flex-col gap-2 bg-transparent">
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 bg-transparent">
                      <SectionCards />
                      <div className="px-4 lg:px-6">
                        <ChartAreaInteractive />
                      </div>
                      <DataTable data={data} />
                    </div>
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </TooltipProvider>
        </div>
      </main>
    </div>
  )
}
