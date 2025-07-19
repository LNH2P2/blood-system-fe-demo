'use client'

import Footer from '@/components/AppFooter'
import BlogDetail from './BlogDetail'
import AppHeader from '@/components/AppHeader'

function page() {
    return (
        <>
            <AppHeader activeMenu='blogdetail' showNotifications={false} setShowNotifications={() => { }} />
            <BlogDetail />
            <Footer />
        </>
    )
}

export default page