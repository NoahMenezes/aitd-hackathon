import { Separator } from "@/components/ui/separator"

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-4 px-6 md:px-8">
        <h1 className="text-xl font-display font-semibold tracking-tight">Financial Overview</h1>
      </div>
    </header>
  )
}
