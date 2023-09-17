import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Blog App',
  description: 'This is worlds best blog app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>
    </html>
  )
}
