import Image from 'next/image'
import styles from './page.module.css'
import Navbar from '@/components/Navbar/Navbar'

export default function Profile() {
  return (
    <main>
      <Navbar/>
      <h1>This is profile page</h1>
    </main>
  )
}
