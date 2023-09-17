"use client"
import Image from 'next/image'
import styles from './page.module.css'
import Navbar from '@/components/Navbar/Navbar'
import './addblog.css'
import { useEffect, useState, useRef } from 'react'
import { AiFillCloseCircle } from "react-icons/ai";
import { toast } from 'react-toastify';
import ClockLoader from "react-spinners/ClockLoader";
import { getCookie, setCookie } from 'cookies-next';

interface ParagraphData {
  title: string;
  description: string;
  image: File | null;
  imageUrl: string;
  position: string;
  createdAt: Number | null;
}
interface FormData {
  title: string;
  description: string;
  image: File | null;
  imageUrl: string;
  paragraphs: ParagraphData[];
  category: string;
}


export default function AddBlog() {
  let [loading, setLoading] = useState(false);

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
        

        } else {
          
          window.location.href = "/pages/auth/signin"
            
        }
      })
      .catch((error) => {
        window.location.href =  "/pages/auth/signin"

      })
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const [blog, setBlog] = useState<FormData>({
    title: '',
    description: '',
    image: null,
    imageUrl: '',
    paragraphs: [],
    category: '',
  });

  const [categories, setCategories] = useState<string[]>([])


  const getCategories = () => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/blogcategories`)
      .then((res) => {
        return res.json()
      })
      .then((response) => {
        // console.log(response.categories)
        setCategories(response.categories)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    getCategories()
  }, [])


  const [paragraphForm, setParagraphForm] = useState<ParagraphData>({
    title: '',
    description: '',
    image: null,
    imageUrl: '',
    position: '',
    createdAt: null
  })
  const pushParagraphToBlog = () => {
    let tempPg = paragraphForm
    tempPg.createdAt = new Date().getTime();
    setBlog({
      ...blog,
      paragraphs: [
        ...blog.paragraphs, paragraphForm
      ]
    })

    let nextPosition = String(parseInt(paragraphForm.position) + 1);
    setParagraphForm({
      ...paragraphForm,
      title: '',
      description: '',
      position: nextPosition,
      createdAt: null
    })
  }
  const deleteParagraph = (paragraph: ParagraphData) => {
    const updatedParagraphs = blog.paragraphs.filter((p) => p.createdAt !== paragraph.createdAt);
    setBlog({
      ...blog,
      paragraphs: updatedParagraphs,
    });
  }
  const sortParagraphs = (a: ParagraphData, b: ParagraphData) => {
    if (a.position === b.position) {
      return b.createdAt! - a.createdAt!;
    }
    return a.position.localeCompare(b.position);
  }

  const uploadImage = async (image: File) => {
    try {
      const formData = new FormData();
      formData.append('myimage', image);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/image/uploadimage`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Image uploaded successfully:', data);
        // You can handle the response data here or return it to the caller.
        return data.imageUrl;
      } else {
        // Handle the case where the request failed (e.g., server error)
        console.error('Failed to upload the image.');
        return null;
      }

    }
    catch (error) {
      console.error('Error:', error);
      return null;
    }
  }
  const uploadBLog = async () => {
    checkLogin();
    if (!blog.title || !blog.description || !blog.category) {
      // Handle the case where required fields are missing
      toast("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    let tempblog = blog
    if (blog.image) {
      let imgUrl = await uploadImage(blog.image)
      tempblog.imageUrl = imgUrl
      // console.log(tempblog)
    }
    for (let i = 0; i < tempblog.paragraphs.length; i++) {
      let tempimg = tempblog.paragraphs[i].image
      if (tempimg) {
        let imgURL = await uploadImage(tempimg);
        tempblog.paragraphs[i].imageUrl = imgURL;
      }
    }

  console.log('BEFORE UPLOADING ' , blog)
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/blog`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blog),
      credentials : 'include'
    });

    if (response.ok) {
      const data = await response.json();
      toast('Blog post created successfully')
      setLoading(false);

      // console.log("Blog post created successfully:", data);
      // Optionally, you can navigate to another page or display a success message.
    }
    else {
      console.log(response)
      toast('Failed to create the blog post')
      setLoading(false);

      // Handle the case where the request failed (e.g., server error)
      // console.error("Failed to create the blog post.");
    }

  }



  useEffect(() => {
    console.log(blog)
  }, [blog])
  return (
    <div>
      {
        loading &&
        <div className='loaderfullpage'>
          <ClockLoader
            color="#36d7b7"
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      }
      <Navbar />
      <div className='addblog_in'>
        <h1 className='head1'>Add Blog</h1>
        <form style={{
          width: '70%',
          minWidth: '250px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div className='forminput_cont'>
            <label>Blog Name</label>
            <input
              type="text"
              placeholder='Enter Blog Title'
              value={blog.title}
              onChange={(e) => setBlog({ ...blog, title: e.target.value })}
            />
          </div>

          <div className='forminput_cont'>
            <label>Blog Category</label>
            <select
              value={blog.category} // Set the selected category value
              onChange={(e) => setBlog({ ...blog, category: e.target.value })} // Update the selected category
            >
              <option value="">Select a category</option> {/* Default option */}
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className='forminput_cont'>
            <label>Blog Description</label>
            <textarea
              placeholder="Enter Blog Description"
              value={blog.description}
              onChange={(e) => setBlog({ ...blog, description: e.target.value })}
            />
          </div>

          <div className='forminput_cont'>
            <label>Blog Image</label>
            <input type="file"
              onChange={(e) => {
                const selectedImage = e.target.files?.[0];// Get the selected image file
                if (selectedImage) {
                  setBlog({ ...blog, image: selectedImage }); // Update the paragraphImage state with the URL
                }
              }}
            />
          </div>


          <div className='blogtempparagraphs'>
            {
              blog.paragraphs.sort(sortParagraphs).map((paragraph) => (
                <div key={String(paragraph.createdAt)}>
                  <AiFillCloseCircle className="closebtn"
                    onClick={() => {
                      deleteParagraph(paragraph)
                    }}
                  />

                  <div className='section1'>
                    <h1>{paragraph.title}</h1>
                    <p>{paragraph.description}</p>
                  </div>
                  {paragraph.image && <img src={URL.createObjectURL(paragraph.image)} alt={`Image for ${paragraph.title}`} />}
                </div>
              ))
            }
          </div>


          <div className='paragraph' >
            <div className='forminput_cont'>
              <label>Paragraph Position</label>
              <input type="number"
                value={paragraphForm.position}

                placeholder="Enter paragraph Position"
                onChange={(e) => setParagraphForm({ ...paragraphForm, position: e.target.value })} />
            </div>
            <div className='forminput_cont'>
              <label>Paragraph Title</label>
              <input type="text" value={paragraphForm.title} placeholder="Enter paragraph Title" onChange={(e) => setParagraphForm({ ...paragraphForm, title: e.target.value })} />
            </div>
            <div className='forminput_cont'>
              <label>Paragraph Description</label>
              <textarea placeholder="Enter Paragraph Description" value={paragraphForm.description} onChange={(e) => setParagraphForm({ ...paragraphForm, description: e.target.value })} />
            </div>
            <div className='forminput_cont'>
              <label>Paragraph Image</label>
              <input type="file"
                id='pgimg'
                onChange={(e) => {
                  const selectedImage = e.target.files?.[0];// Get the selected image file
                  if (selectedImage) {
                    // const imageUrl = URL.createObjectURL(selectedImage); // Create a URL for the selected image
                    setParagraphForm({ ...paragraphForm, image: selectedImage }); // Update the paragraphImage state with the URL
                  }
                }}
              />
            </div>


            <button type="button" className="main_button" onClick={(e) => {
              e.preventDefault(); // Prevent the default form submission
              pushParagraphToBlog();
            }}>Add Paragraph To Blog</button>
          </div>

          <button type="submit" className="main_button"  onClick={(e) => {
              e.preventDefault(); // Prevent the default form submission
              uploadBLog();
            }}>Submit</button>

        </form>
      </div>
    </div>
  )
}
