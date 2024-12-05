import GlobalNav from '@/components/dashboardpageUI/Globalnav'
import Dashboard from '@/components/dashboardpageUI/Dashboard'


const page = () => {
  return (
    <div className='h-screen overflow-y-hidden'>
      <GlobalNav />
      <Dashboard />
    </div>
  )
}

export default page
