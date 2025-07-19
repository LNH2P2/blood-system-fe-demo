'use client'

import Footer from '@/components/AppFooter'
import BlogList from './BlogList'
import AppHeader from '@/components/AppHeader'

function page() {
    return (
        <>
            <AppHeader activeMenu='facility' showNotifications={false} setShowNotifications={() => { }} />
            <BlogList />
            <Footer />
        </>
    )
}

export default page