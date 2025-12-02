import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ice King AI - 爆款内容生成器',
  description: 'AI驱动的全平台爆款内容生成工具，支持Pinterest、Instagram、Twitter、YouTube四大平台',
  keywords: 'AI, 内容生成, 社交媒体, 营销, Pinterest, Instagram, Twitter, YouTube',
  authors: [{ name: 'Ice King AI' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0f172a',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  )
}