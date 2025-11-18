import HomeFooter from '@/components/HomeFooter'
import { TopNavbar } from '@/components/Navbar'
import SmoothScroll from '@/components/ScrollSmooth'
import React from 'react'

const ProtectLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div>
         <SmoothScroll />
                  <div className="fixed top-2 w-full z-50">
                        <TopNavbar />
                  </div>
        
                <main className="pt-24">
                  {children}
                </main>
                <HomeFooter/>
    </div>
  )
}

export default ProtectLayout