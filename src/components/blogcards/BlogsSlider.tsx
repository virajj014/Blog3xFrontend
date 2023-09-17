import React, { useEffect, useState } from 'react'
import 'swiper/css';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import BlogCard from './BlogCard';
import { toast } from 'react-toastify';


interface ParagraphData {
    title: string;
    description: string;
    image: File | null;
    imageUrl: string;
    position: string;
    createdAt: Number | null;
}
interface Blog {
    _id: string;
    title: string;
    description: string;
    image: File | null;
    imageUrl: string;
    paragraphs: ParagraphData[];
    category: string;
}

const BlogsSlider = () => {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const get10latestblogs = () => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/blog`,
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
                if (response.ok) {
                    console.log(response)
                    setBlogs(response.data.blogs);
                }
                else {
                    toast(response.message, {
                        type: 'error',
                    })
                }
            })
            .catch((error) => {
                toast(error.message, {
                    type: 'error',
                })

            })
    }
    useEffect(() => {
        get10latestblogs();
    }, [])

    // const blogs = [
    //     {
    //         name: "Blog 1",
    //         path: "#",
    //         bgcolor: "black",
    //     },
    //     {
    //         name: "Blog 2",
    //         path: "#",
    //         bgcolor: "black",
    //     },
    //     {
    //         name: "Blog 3",
    //         path: "#",
    //         bgcolor: "black",
    //     },
    //     {
    //         name: "Blog 4",
    //         path: "#",
    //         bgcolor: "black",
    //     },
    //     {
    //         name: "Blog 5",
    //         path: "#",
    //         bgcolor: "black",
    //     },
    //     {
    //         name: "Blog 6",
    //         path: "#",
    //         bgcolor: "black",
    //     },
    //     {
    //         name: "Blog 7",
    //         path: "#",
    //         bgcolor: "black",
    //     },
    // ];
    return (
        <div className='sliderout'>
            <h1>Latest Blogs</h1>
            <Swiper
                slidesPerView={1}
                spaceBetween={1}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    '@0.00': {
                        slidesPerView: 1,
                        spaceBetween: 2,
                    },
                    '@0.75': {
                        slidesPerView: 2,
                        spaceBetween: 2,
                    },
                    '@1.00': {
                        slidesPerView: 3,
                        spaceBetween: 2,
                    },
                    '@1.50': {
                        slidesPerView: 5,
                        spaceBetween: 2,
                    },
                }}
                modules={[Pagination]}
                className="mySwiper"
            >
                {
                    blogs.map((blog) => {
                        return (
                            <SwiperSlide>
                                <BlogCard {...blog} />
                            </SwiperSlide>
                        );
                    })
                }

            </Swiper>
        </div>
    )
}

export default BlogsSlider