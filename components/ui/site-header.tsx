
export function SiteHeader({title, children}: {title: string, children?: React.ReactNode  }) {
  return (
    <header className="flex h-(--header-height) shrink-0 border-dashed items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 pb-4 lg:gap-2">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="ml-auto flex items-center gap-2">
          {children}
        </div>
      </div>
    </header>
  )
}
