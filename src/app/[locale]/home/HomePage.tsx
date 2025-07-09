'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
    return (
        <div className='flex flex-col gap-16 py-12 px-6 bg-white'>

            <section
                className="bg-[url('/homeBanner.png')] bg-cover bg-center min-h-[60vh] px-6 flex items-center justify-center"
            >
                <div className='bg-white/80 backdrop-blur-sm rounded-xl p-8 max-w-screen-xl w-full flex flex-col items-start gap-4'>
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

            <section className='py-12 px-6 bg-gradient-to-r from-[#FFE5E5] via-[#FFF5F5] to-[#FFE5E5]'>
                <h3 className='text-3xl font-bold mb-10 text-[#DC2626] text-center'>Vì sao nên hiến máu?</h3>
                <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto'>
                    {[
                        { icon: "🩸", title: "Cứu người", text: "Hiến máu giúp cứu sống bệnh nhân trong các ca cấp cứu, phẫu thuật, thiếu máu nghiêm trọng." },
                        { icon: "🤝", title: "Chia sẻ cộng đồng", text: "Mỗi giọt máu là sự chia sẻ yêu thương – đóng góp cho ngân hàng máu quốc gia." },
                        { icon: "❤️", title: "Tốt cho sức khỏe", text: "Kích thích tủy xương sản sinh tế bào máu mới – giảm sắt dư, phòng tránh bệnh tim mạch." }
                    ].map((item, i) => (
                        <div key={i} className='rounded-xl p-6 border border-[#DC2626] bg-white shadow-md hover:shadow-xl transition duration-300'>
                            <div className='text-[#DC2626] text-5xl mb-4'>{item.icon}</div>
                            <h4 className='font-bold text-lg text-black mb-2'>{item.title}</h4>
                            <p className='text-sm text-black/70 leading-relaxed'>{item.text}</p>
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

            <section className='py-12 px-6 bg-gradient-to-b from-[#FFF5F5] to-[#FFEAEA]'>
                <h3 className='text-3xl font-bold mb-10 text-center text-[#DC2626]'>Lời khuyên trước và sau khi hiến máu</h3>
                <div className='grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-sm'>
                    <div className='bg-white text-black p-6 rounded-xl shadow border border-[#DC2626] hover:shadow-lg transition'>
                        <h4 className='font-bold text-[#DC2626] mb-3 text-base'>✅ Nên làm:</h4>
                        <ul className='list-disc list-inside space-y-2'>
                            <li>Uống 300–500ml nước trước khi hiến</li>
                            <li>Giữ băng dán ít nhất 4–6 tiếng</li>
                            <li>Chườm lạnh nếu có bầm tím</li>
                            <li>Nghỉ ngơi tại chỗ 10 phút</li>
                        </ul>
                    </div>
                    <div className='bg-white text-black p-6 rounded-xl shadow border border-[#DC2626] hover:shadow-lg transition'>
                        <h4 className='font-bold text-[#DC2626] mb-3 text-base'>❌ Không nên:</h4>
                        <ul className='list-disc list-inside space-y-2'>
                            <li>Uống sữa hoặc rượu bia trước khi hiến</li>
                            <li>Làm việc nặng, lái xe đường dài sau khi hiến</li>
                        </ul>
                        <p className='text-xs mt-3 text-black/50'>– BS Ngô Văn Tân, BV Truyền máu Huyết học</p>
                    </div>
                    <div className='bg-white text-black p-6 rounded-xl shadow border border-[#DC2626] hover:shadow-lg transition'>
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
