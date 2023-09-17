"use client"
import React, { FC, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Navbar from '@/components/Navbar/Navbar';
import './blogPage.css';
import Image from 'next/image';
import BlogsSlider from '@/components/blogcards/BlogsSlider';
import Footer from '@/components/Footer/Footer';
import ClockLoader from "react-spinners/ClockLoader";



interface ParagraphData {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    position: string;
    createdAt: Number | null;
}
interface Blog {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    paragraphs: ParagraphData[];
    category: string;
    owner: string;
    createdAt: string;
    updatedAt: string;
}


const BlogPage = () => {
    const searchParams = useSearchParams()
    const blogid = searchParams.get('blogid')
    const [loading, setLoading] = useState(false)
    //   console.log(blogid)

    const [blog, setBlog] = useState<Blog>({
        _id: '',
        title: '',
        description: '',
        imageUrl: '',
        paragraphs: [],
        category: '',
        owner: '',
        createdAt: '',
        updatedAt: ''
    });

    const [blogcreatedat, setBlogcreatedat] = useState<String>('')
    const getBlogbyId = () => {
        setLoading(true)
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/blog/${blogid}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                setLoading(false)
                if (response.ok) {
                    console.log(response.data.blog)
                    setBlog(response.data.blog);
                    const formattedDate = formatDate(response.data.blog.createdAt);
                    setBlogcreatedat(formattedDate)
                }
                else {
                    toast(response.message, {
                        type: 'error',
                    })
                }
            })
            .catch((error) => {
                setLoading(false)

                toast(error.message, {
                    type: 'error',
                })

            })
    }

    useEffect(() => {
        getBlogbyId()
        window.scrollTo(0, 0);
    }, [])
    function formatDate(inputDate: string) {
        const date = new Date(inputDate);
        const day = date.getDate();
        const monthNames = [
            'January', 'February', 'March', 'April',
            'May', 'June', 'July', 'August',
            'September', 'October', 'November', 'December'
        ];
        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        return `${day} ${monthNames[monthIndex]} ${year}`;
    }
    return (
        <div className='blogpage-out'>
            <Navbar />

            {
                loading && blog._id == '' ?
                    <div className='loaderfullpage'>
                        <ClockLoader
                            color="#36d7b7"
                            loading={loading}
                            size={150}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                        />
                    </div>
                    :
                    <div className='blogpage'>
                        <div className='c1'>
                            <p className='createdat'>Created at {blogcreatedat}</p>
                            <p className='title'>{blog.title}</p>
                            <p className='category'>{blog.category}</p>

                           {
                            blog.imageUrl.length>0 && 
                            <Image src={blog.imageUrl} alt={blog.title} width={100} height={100} className='blogimg' unoptimized />
                           }
                            <p className='description'>{blog.description}</p>
                        </div>
                        {
                            blog.paragraphs.map((paragraph: ParagraphData, index) => (
                                <div className={
                                    index % 2 === 0 ? 'c2left' : 'c2right'
                                } key={index}>
                                    {
                                        paragraph.imageUrl.length > 0 &&
                                        <Image src={paragraph.imageUrl} alt={blog.title} width={100} height={100}
                                            className='paraimg' unoptimized />
                                    }
                                    <div>
                                        <p className='title'>{paragraph.title}</p>
                                        <p className='description'>{paragraph.description}</p>
                                    </div>
                                </div>
                            ))
                        }
                        <BlogsSlider />
                    </div>
            }

            <Footer />
        </div>
    )
}

export default BlogPage