"use client"
import Image from 'next/image'
import styles from './page.module.css'
import Navbar from '@/components/Navbar/Navbar'
import HomeSlider from '@/components/HomeSlider/HomeSlider'
import CategoriesSlider from '@/components/Categories/CategoriesSlider'
import BlogsSlider from '@/components/blogcards/BlogsSlider'
import Footer from '@/components/Footer/Footer'
import { useEffect } from 'react'

export default function Home() {

  const checkLogin = async () => {


    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/auth/checklogin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log(response)



        if (response.ok) {
          // toast(response.message, {
          //     type: 'success',
          //     position: 'top-right',
          //     autoClose: 2000
          // })

          // window.location.href = "/"


        } else {
          // toast(response.message, {
          //     type: 'error',
          //     position: 'top-right',
          //     autoClose: 2000
          // });
          window.location.href = "/pages/auth/signin"
            
        }
      })
      .catch((error) => {
        window.location.href = "/"

      })
  };

  useEffect(() => {
    checkLogin();
}, []);
  return (
    <main>
      <Navbar/>
      <HomeSlider/>
      <CategoriesSlider/>
      <BlogsSlider/>
      <Footer/>
    </main>
  )
}
