import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { blogApi } from '@/lib/apis/blog.api';
import { Blog, BlogStatus } from '@/types/blog';

const BlogListPage: React.FC = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        const handleBlogs = async () => {
            try {
                const res = await blogApi.getBlogs({
                    status: BlogStatus.PUBLISHED,
                    limit: 4,
                });
                if (res.payload?.data) {
                    setBlogs(res.payload.data.data);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            }
        };
        handleBlogs();
    }, []);

    return (
        <div className='flex justify-center'>
            <div className='w-full max-w-7xl px-4 py-12'>

                <div className='grid gap-8 sm:grid-cols-1 md:grid-cols-4'>
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className='bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-transform hover:scale-[1.02]'
                        >
                            <div className='relative h-48 w-full'>
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className='w-full h-full object-cover rounded-t-xl'
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.src =
                                            'https://via.placeholder.com/600x400/e5e7eb/6b7280?text=Image+Not+Found';
                                    }}
                                />
                            </div>

                            <div className='p-4'>
                                <Link href={`/vi/blog/${blog._id}`}>
                                    <div>
                                        <h3 className='text-xl font-semibold text-gray-800 mb-2 line-clamp-2'>
                                            {blog.title}
                                        </h3>
                                        <p className='text-sm text-gray-600 line-clamp-2'>{blog.summary}</p>

                                        <div className='flex items-center justify-between text-xs text-gray-500 mt-3'>
                                            {/* <span className='bg-gray-200 px-2 py-0.5 rounded text-gray-700 font-medium'>
                                                Published
                                            </span> */}

                                            <div className='flex items-center space-x-2'>
                                                <span className=''>
                                                    {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                <span className='flex items-center gap-1'>
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        fill='none'
                                                        viewBox='0 0 24 24'
                                                        strokeWidth={1.5}
                                                        stroke='currentColor'
                                                        className='w-4 h-4'
                                                    >
                                                        <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            d='M2.25 12s3.75-6.75 9.75-6.75 9.75 6.75 9.75 6.75-3.75 6.75-9.75 6.75S2.25 12 2.25 12z'
                                                        />
                                                        <path
                                                            strokeLinecap='round'
                                                            strokeLinejoin='round'
                                                            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                                                        />
                                                    </svg>
                                                    <span>{blog.viewCount}</span>
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogListPage;
