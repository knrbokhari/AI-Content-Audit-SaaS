import { SiteHeader } from '@/components/ui/site-header'
import AiUsesList from '@/components/ai-uses/ai-uses-list'

const Page = () => {
  return (
    <div>
      <SiteHeader title="AI Report" />
      <div className="p-4">
        <AiUsesList />
      </div>
    </div>
  )
}

Page.displayName = "AiUsesPage"

export default Page
