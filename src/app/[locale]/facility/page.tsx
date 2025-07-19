'use client'

import Footer from '@/components/AppFooter'
import FacilityList from './FacilityList'
import AppHeader from '@/components/AppHeader'

function page() {
    return (
        <>
            <AppHeader activeMenu='facility' showNotifications={false} setShowNotifications={() => { }} />
            <FacilityList />
            <Footer />
        </>
    )
}

export default page