'use client'

import { blogApi } from '@/lib/apis/blog.api'
import { Blog, BlogStatus } from '@/types/blog'
// import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Hospital } from '@/types/hospital'

export default function HomePage() {

    const [hospitals, setHospitals] = useState<Hospital[]>([]);

    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/hospitals`)
                const data = await res.json()

                console.log('Fetched hospitals:', data)

                if (data?.data) {
                    setHospitals(data.data)
                }
            } catch (error) {
                console.error('Error fetching hospitals:', error)
            }
        }

        fetchHospitals()
    }, [])



    const [blogs, setBlogs] = useState<Blog[]>([])

    useEffect(() => {
        const handleBlogs = async () => {
            try {
                const res = await blogApi.getBlogs({
                    status: BlogStatus.PUBLISHED,
                    limit: 4
                })
                console.log('Fetched blogs:', res.payload.data.data);
                if (res.payload?.data) {
                    setBlogs(res.payload.data.data)
                }
            } catch (error) {
                console.error('Error fetching blogs:', error)
            }
        }
        handleBlogs()
    }, [])

    return (
        <div className='flex flex-col gap-16 py-12 px-6 bg-white'>

            <section
                className="bg-[url('/homeBanner.png')] bg-cover bg-center min-h-[60vh] px-6 flex items-center justify-center"
            >
                <div className='rounded-xl p-8 max-w-screen-xl w-full flex flex-col items-start gap-4'>
                    <h2 className='text-4xl font-bold text-[#DC2626]'>HIẾN MÁU CỨU NGƯỜI</h2>
                    <p className='text-lg text-black'>Một giọt máu cho đi – Một cuộc đời ở lại</p>
                    <Link
                        href='/donationRequest'
                        className='mt-4 inline-block bg-[#DC2626] text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-red-700 transition'
                    >
                        Đăng ký hiến máu
                    </Link>
                </div>
            </section>

            <section className='py-12 px-6 bg-gradient-to-r bg-white'>
                <h2 className='text-3xl font-bold text-center text-[#DC2626] mb-10'>
                    Giới thiệu các cơ sở y tế
                </h2>

                <div className='grid md:grid-cols-2 gap-8'>
                    {hospitals.length === 0 ? (
                        <div>Loading...</div>
                    ) : (
                        hospitals.map((hospital: Hospital, index: number) => (
                            <div key={index} className='bg-white rounded-lg shadow-md p-6'>
                                <h3 className='text-xl font-semibold text-[#333]'>{hospital.name}</h3>
                                <p className='text-sm text-gray-500 mb-3'>
                                    {hospital.address}, {hospital.province}
                                </p>

                                <div className='mb-4'>
                                    <h4 className='font-medium text-[#DC2626]'>Liên hệ</h4>
                                    <p className='text-sm text-gray-600'>Điện thoại: {hospital.contactInfo.phone}</p>
                                    {hospital.contactInfo.email && (
                                        <p className='text-sm text-gray-600'>Email: {hospital.contactInfo.email}</p>
                                    )}
                                </div>

                                <div className='mb-4'>
                                    <h4 className='font-medium text-[#DC2626]'>Dịch vụ</h4>
                                    <ul className='list-disc pl-6 text-sm text-gray-600'>
                                        {hospital.services.map((service: string, index: number) => (
                                            <li key={index}>{service}</li>
                                        ))}
                                    </ul>
                                </div>

                                <p className='text-sm text-gray-700'>{hospital.description}</p>
                            </div>
                        ))
                    )}

                </div>

                <div className='mt-4 flex justify-center'>
                    <Link
                        href='/'
                        className='text-[#DC2626] bg-gray-100 px-6 py-2 rounded-full hover:bg-gray-200 transition duration-300 text-center'
                    >
                        Xem thêm bệnh viện
                    </Link>
                </div>
            </section>

            <section className='py-12 px-6 bg-[#fff]'>
                <h2 className='text-3xl font-bold mb-10 text-[#DC2626] text-center'>
                    Bài viết chia sẻ kinh nghiệm hiến máu
                </h2>

                <div className='grid md:grid-cols-3 gap-8 max-w-7xl mx-auto'>
                    {blogs.length > 0 && blogs.map((blog, index) => (
                        <div
                            key={blog._id}
                            className='flex flex-col bg-white rounded-lg shadow-lg overflow-hidden'
                        >
                            <div className='relative'>
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className='object-cover w-full h-48'
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src =
                                            'https://via.placeholder.com/600x400/e5e7eb/6b7280?text=Image+Not+Found';
                                    }}
                                />
                            </div>
                            <div className='p-4 '>
                                <Link href={`/blog:id/${blog._id}`}>
                                    <h3 className='text-lg font-bold text-[#DC2626] mb-2'>{blog.title}</h3>
                                    <p className='text-sm text-black/80 mb-3'>{blog.summary}</p>
                                    <p className='text-xs text-black/50 line-clamp-3'>{blog.content}</p>
                                </Link>
                            </div>
                        </div>

                    ))}
                </div>
                <div className='mt-4 flex justify-center'>
                    <Link
                        href='/vi/blog'
                        className='text-[#DC2626] bg-gray-100 px-6 py-2 rounded-full hover:bg-gray-200 transition duration-300 text-center'
                    >
                        Xem thêm bài viết
                    </Link>
                </div>
            </section>

            <section>
                <h3 className='text-3xl font-bold mb-10 text-center text-[#DC2626]'>Quyền lợi của người hiến máu</h3>
                <div className='grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-sm'>
                    <div className='bg-white p-5 rounded-xl shadow border border-[#DC2626]'>
                        <h4 className='font-bold text-[#DC2626] text-base mb-2'>Được cấp Giấy chứng nhận</h4>
                        <ul className='list-decimal list-inside text-black space-y-1'>
                            <li>Nhận giấy ngay sau khi hiến máu</li>
                            <li>Miễn phí truyền máu tại BV công</li>
                            <li>Trình giấy để được truyền máu miễn phí</li>
                            <li>Cơ sở y tế xác nhận vào giấy</li>
                        </ul>
                    </div>

                    <div className='bg-white p-5 rounded-xl shadow border border-[#DC2626]'>
                        <h4 className='font-bold text-[#DC2626] text-base mb-2'>Được tư vấn về sức khỏe</h4>
                        <ul className='list-disc list-inside text-black space-y-1'>
                            <li>Hiểu quy trình & biến chứng</li>
                            <li>Tư vấn bệnh lây qua máu (HIV, viêm gan...)</li>
                            <li>Xét nghiệm miễn phí</li>
                            <li>Hướng dẫn chăm sóc sau hiến</li>
                            <li>Bảo mật kết quả</li>
                        </ul>
                    </div>

                    <div className='bg-white p-5 rounded-xl shadow border border-[#DC2626]'>
                        <h4 className='font-bold text-[#DC2626] text-base mb-2'>Được bồi dưỡng trực tiếp</h4>
                        <ul className='list-disc list-inside text-black space-y-1'>
                            <li>Ăn nhẹ & nước uống trị giá ~30.000đ</li>
                            <li>Hỗ trợ tiền đi lại: 50.000đ</li>
                            <li>Quà tặng:
                                <ul className='ml-4 list-disc'>
                                    <li>100.000đ (250ml)</li>
                                    <li>150.000đ (350ml)</li>
                                    <li>180.000đ (450ml)</li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            <section className='py-12 px-6 bg-white'>
                <h3 className='text-3xl font-bold mb-10 text-[#DC2626] text-center'>
                    Vì sao nên hiến máu?
                </h3>
                <div className='max-w-6xl mx-auto'>
                    {[
                        {
                            icon: "🩸",
                            title: "Cứu người",
                            text: "Hiến máu giúp cứu sống bệnh nhân trong các ca cấp cứu, phẫu thuật, thiếu máu nghiêm trọng."
                        },
                        {
                            icon: "🤝",
                            title: "Chia sẻ cộng đồng",
                            text: "Mỗi giọt máu là sự chia sẻ yêu thương – đóng góp cho ngân hàng máu quốc gia."
                        },
                        {
                            icon: "❤️",
                            title: "Tốt cho sức khỏe",
                            text: "Kích thích tủy xương sản sinh tế bào máu mới – giảm sắt dư, phòng tránh bệnh tim mạch."
                        }
                    ].map((item, i) => (
                        <div key={i} className='flex items-center mb-8 bg-gradient-to-r from-[#FFE5E5] via-[#FFF5F5] to-[#FFE5E5] p-4 rounded-xl border border-[#fff] shadow-md hover:shadow-xl transition-all duration-300 w-[70%] mx-auto'>
                            <div className='text-[#DC2626] text-5xl mr-4'>
                                {item.icon}
                            </div>
                            <div>
                                <h4 className='font-bold text-lg text-black mb-2'>{item.title}</h4>
                                <p className='text-sm text-black/70 leading-relaxed'>{item.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>




            <section>
                <h3 className='text-3xl font-bold mb-6 text-[#DC2626] text-center'>Tiêu chuẩn tham gia hiến máu</h3>
                <div className='grid md:grid-cols-3 gap-6 max-w-6xl mx-auto text-sm'>
                    {[
                        "Mang theo CMND hoặc hộ chiếu",
                        "Không nhiễm HIV, viêm gan B/C, bệnh lây qua máu",
                        "Không nghiện ma túy, rượu bia, chất kích thích",
                        "Cân nặng: Nam ≥ 45kg, Nữ ≥ 45kg",
                        "Không mắc bệnh mãn tính về tim mạch, huyết áp...",
                        "Hb ≥120g/l (≥125g/l nếu hiến ≥350ml)",
                        "Tuổi từ 18 đến 60, sức khỏe tốt",
                        "Cách 2 lần hiến máu ít nhất 12 tuần",
                        "Âm tính nhanh với siêu vi B"
                    ].map((item, index) => (
                        <div key={index} className='bg-white text-black p-4 rounded-xl shadow border border-[#DC2626]'>{item}</div>
                    ))}
                </div>
            </section>

            <section className='py-12 px-6 bg-white'>
                <h3 className='text-3xl font-bold mb-10 text-center text-[#DC2626]'>Lời khuyên trước và sau khi hiến máu</h3>
                <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-sm'>
                    <div className='bg-gradient-to-b from-[#B0DB9C] to-[#DDF6D2] text-black p-6 rounded-xl shadow border border-[#fff] hover:shadow-lg transition'>
                        <h4 className='font-bold text-[#DC2626] mb-3 text-base'>✅ Nên làm:</h4>
                        <ul className='list-disc list-inside space-y-2'>
                            <li>Uống 300–500ml nước trước khi hiến</li>
                            <li>Giữ băng dán ít nhất 4–6 tiếng</li>
                            <li>Chườm lạnh nếu có bầm tím</li>
                            <li>Nghỉ ngơi tại chỗ 10 phút</li>
                        </ul>
                    </div>
                    <div className='bg-gradient-to-b from-[#FF8A8A] to-[#FFEAEA] text-black p-6 rounded-xl shadow border border-[#fff] hover:shadow-lg transition'>
                        <h4 className='font-bold text-[#DC2626] mb-3 text-base'>❌ Không nên:</h4>
                        <ul className='list-disc list-inside space-y-2'>
                            <li>Uống sữa hoặc rượu bia trước khi hiến</li>
                            <li>Làm việc nặng, lái xe đường dài sau khi hiến</li>
                        </ul>
                        <p className='text-xs mt-3 text-black/50'>– BS Ngô Văn Tân, BV Truyền máu Huyết học</p>
                    </div>
                    <div className='bg-gradient-to-b from-[#FFF9BD] to-[#FEFAE0] text-black p-6 rounded-xl shadow border border-[#fff] hover:shadow-lg transition'>
                        <h4 className='font-bold text-[#DC2626] mb-3 text-base'>⚠️ Lưu ý:</h4>
                        <ul className='list-disc list-inside space-y-2'>
                            <li>Nếu chóng mặt: nằm nghỉ và giơ cao chân</li>
                            <li>Nếu chảy máu: giơ tay cao & ấn nhẹ vùng tiêm</li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    )
}
