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
                setBlog(res.payload)
            } catch (error) {
                console.error('Error fetching blog:', error)
            }
        }

        if (id) fetchBlog()
    }, [id])

    if (!blog) {
        return <div className='text-center py-10'>Đang tải bài viết...</div>
    }

    return (
        <div className='max-w-2xl mx-auto px-4 py-10'>
            <div className='bg-white shadow-lg rounded-xl overflow-hidden'>
                {/* Image */}
                <div className='w-full h-64'>
                    <img
                        src={blog.image || 'https://via.placeholder.com/600x400?text=No+Image'}
                        alt={blog.title}
                        className='w-full h-full object-cover'
                        onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.src = 'https://via.placeholder.com/600x400?text=No+Image'
                        }}
                    />
                </div>

                {/* Content */}
                <div className='p-6'>
                    {/* Tags / Date / Views */}
                    <div className='flex items-center justify-between text-xs text-gray-500 mb-3'>
                        <span className='bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[11px]'>Published</span>
                        <span>
                            {new Date(blog.createdAt || '').toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                            })}
                        </span>
                        <span>{blog.viewCount} lượt xem</span>
                    </div>

                    {/* Title */}
                    <h1 className='text-2xl font-semibold text-gray-900 mb-4'>{blog.title}</h1>

                    {/* Summary */}
                    <p className='text-gray-600 mb-4'>{blog.summary}</p>

                    {/* Main Content */}
                    <div className='text-sm text-gray-800 leading-7 whitespace-pre-line'>
                        {blog.content}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogDetailHome
