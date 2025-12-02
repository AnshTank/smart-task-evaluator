import EnhancedNavbar from '@/components/EnhancedNavbar'
import EnhancedDashboard from '@/components/EnhancedDashboard'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedNavbar />
      <EnhancedDashboard />
    </div>
  )
}