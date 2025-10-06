"use client"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-4 sm:px-6">
      <div className="flex-1">
        <h1 className="text-xl font-semibold text-foreground lg:pl-0 pl-12">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
      </div>
    </header>
  )
}