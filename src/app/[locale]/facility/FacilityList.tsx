import React, { useEffect, useState } from 'react'
import { Hospital } from '@/types/hospital'

const FacilityList: React.FC = () => {
    const [hospitals, setHospitals] = useState<Hospital[]>([])

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

    return (
        <div className='container mx-auto py-12 px-6'>
            <h2 className='text-3xl font-bold text-center text-[#DC2626] mb-10'>
                Danh sách các cơ sở y tế
            </h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                {hospitals.length === 0 ? (
                    <div>Loading...</div>
                ) : (
                    hospitals.map((hospital, index) => (
                        <div
                            key={index}
                            className='bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-500 hover:scale-105 hover:shadow-xl'
                        >
                            <div className='bg-[#58A0C8] text-white p-6'>
                                <h3 className='text-2xl font-semibold'>{hospital.name}</h3>
                                <p className='text-lg'>{hospital.province}</p>
                            </div>

                            <div className='p-6'>
                                <p className='text-sm text-gray-600 mb-4'>{hospital.address}</p>

                                {/* Thêm giờ làm việc và liên hệ khẩn cấp */}
                                <div className='mb-4'>
                                    <h4 className='text-[#DC2626] font-semibold'>Giờ hoạt động</h4>
                                    <p className='text-sm text-gray-600'>{hospital.operatingHours}</p>
                                </div>

                                <div className='mb-4'>
                                    <h4 className='text-[#DC2626] font-semibold'>Liên hệ khẩn cấp</h4>
                                    <p className='text-sm text-gray-600'>{hospital.emergencyContact}</p>
                                </div>

                                {/* (Tuỳ chọn) Tồn kho máu */}
                                {hospital.bloodInventory.length > 0 && (
                                    <div className='mb-4'>
                                        <h4 className='text-[#DC2626] font-semibold'>Tồn kho máu</h4>
                                        <ul className='list-disc pl-6 text-sm text-gray-600'>
                                            {hospital.bloodInventory.map((item, i) => (
                                                <li key={i}>
                                                    Nhóm {item.bloodType} - {item.component}: {item.quantity} đơn vị (hết hạn {new Date(item.expiresAt).toLocaleDateString()})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}


                                <div className='mb-4'>
                                    <h4 className='text-[#DC2626] font-semibold'>Liên hệ</h4>
                                    <p className='text-sm text-gray-600'>Điện thoại: {hospital.contactInfo.phone}</p>
                                    {hospital.contactInfo.email && (
                                        <p className='text-sm text-gray-600'>Email: {hospital.contactInfo.email}</p>
                                    )}
                                </div>

                                <div className='mb-4'>
                                    <h4 className='text-[#DC2626] font-semibold'>Dịch vụ</h4>
                                    <ul className='list-disc pl-6 text-sm text-gray-600'>
                                        {hospital.services.map((service, i) => (
                                            <li key={i}>{service}</li>
                                        ))}
                                    </ul>
                                </div>

                                <p className='text-sm text-gray-700'>{hospital.description}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default FacilityList
