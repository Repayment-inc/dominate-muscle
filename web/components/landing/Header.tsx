import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import Link from "next/link"

export const Header = () => {
  return (
    <header className="bg-foreground border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-primary-foreground">
              DOMINATE MUSCLE
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">ログイン</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-700">サインアップ</Button>
            </Link>
          </div>
          {/* ハンバーガーメニュー */}
          <div className="md:hidden flex items-center">
            <Link href="/login">
              <Button variant="outline" size="sm" className="mr-2">
                ログイン
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="mr-2">
                サインアップ
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">メニューを開く</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}