import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className='bg-white border-t px-8 py-10 text-gray-600'>
            <div className='max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8'>
                <div>
                    <h2 className='text-[#DC2626] text-2xl font-bold mb-2'>BloodCare</h2>
                    <p className='text-sm'>Nền tảng quản lý hiến máu toàn diện, kết nối cộng đồng và bệnh viện.</p>
                </div>
                <div>
                    <h4 className='font-semibold mb-2'>Về chúng tôi</h4>
                    <ul className='space-y-1 text-sm'>
                        <li><Link href='/about'>Giới thiệu</Link></li>
                        <li><Link href='/team'>Đội ngũ</Link></li>
                        <li><Link href='/contact'>Liên hệ</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className='font-semibold mb-2'>Hướng dẫn</h4>
                    <ul className='space-y-1 text-sm'>
                        <li><Link href='/how-to-donate'>Cách hiến máu</Link></li>
                        <li><Link href='/faq'>Câu hỏi thường gặp</Link></li>
                        <li><Link href='/safety'>An toàn hiến máu</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className='font-semibold mb-2'>Kết nối</h4>
                    <ul className='space-y-1 text-sm'>
                        <li><a href='https://facebook.com' target='_blank'>Facebook</a></li>
                        <li><a href='https://zalo.me' target='_blank'>Zalo</a></li>
                        <li><a href='mailto:hotro@bloodcare.vn'>hotro@bloodcare.vn</a></li>
                    </ul>
                </div>
            </div>
            <div className='mt-10 text-center text-xs text-gray-400'>
                © 2025 BloodCare. Bảo trợ bởi cộng đồng y tế Việt Nam.
            </div>
        </footer>
    )
}