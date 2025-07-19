'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Blog } from '@/types/blog'
import { blogApi } from '@/lib/apis/blog.api'

const BlogDetailHome = () => {
    const { id } = useParams()
    const [blog, setBlog] = useState<Blog | null>(null)

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await blogApi.getBlogById(id as string)
                if (res.payload?.data) {
                    setBlog(res.payload.data)
                }
            } catch (error) {
                console.error('Error fetching blog:', error)
            }
        }

        if (id) fetchBlog()
    }, [id])

    if (!blog) {
        return <div className='text-center py-16 text-gray-600 text-lg'>Đang tải bài viết...</div>
    }

    return (
        <div className='max-w-7xl mx-auto px-4 py-12'>
            <article className='bg-gradient-to-r from-[#FFE5E5] via-[#FFF5F5] to-[#FFE5E5] rounded-2xl overflow-hidden'>
                <div className='flex flex-col md:flex-row'>
                    <div className='md:w-1/2 w-full h-64 md:h-auto'>
                        <img
                            src={blog.image}
                            alt={blog.title}
                            className='w-full h-full object-cover'
                            onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'https://via.placeholder.com/600x400?text=No+Image'
                            }}
                        />
                    </div>

                    <div className='md:w-1/2 w-full p-6 md:p-8 flex-col justify-between'>
                        <div>
                            <div className='flex flex-wrap justify-between items-center text-sm text-gray-500 mb-4'>
                                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium'>
                                    Published
                                </span>

                                <div className='flex items-center gap-4'>
                                    <span>
                                        {new Date(blog.createdAt || '').toLocaleDateString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })}
                                    </span>
                                    <span>{blog.viewCount ?? 0} lượt xem</span>
                                </div>
                            </div>


                            <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-4'>
                                {blog.title}
                            </h1>

                            <p className='text-gray-700 mb-2 italic'>{blog.summary}</p>
                        </div>

                        <div className='text-sm md:text-base text-gray-800 leading-7 '>
                            {blog.content}
                        </div>
                    </div>
                </div>
            </article>
        </div>
    )
}

export default BlogDetailHome
