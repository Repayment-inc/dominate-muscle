import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-background border-t">
      {/* <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8"> */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">会社情報</h2>
            <ul className="space-y-2">
              <li><a href="/about" className="text-foreground hover:text-primary">会社概要</a></li>
              <li><a href="/team" className="text-foreground hover:text-primary">チーム</a></li>
              <li><a href="/careers" className="text-foreground hover:text-primary">採用情報</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">サービス</h2>
            <ul className="space-y-2">
              <li><a href="/services" className="text-foreground hover:text-primary">サービス一覧</a></li>
              <li><a href="/pricing" className="text-foreground hover:text-primary">料金プラン</a></li>
              <li><a href="/faq" className="text-foreground hover:text-primary">よくある質問</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">お問い合わせ</h2>
            <ul className="space-y-2">
              <li><a href="/contact" className="text-foreground hover:text-primary">お問い合わせフォーム</a></li>
              <li><a href="/support" className="text-foreground hover:text-primary">サポート</a></li>
              <li><a href="/feedback" className="text-foreground hover:text-primary">フィードバック</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-primary">フォローする</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground hover:text-primary" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-foreground hover:text-primary" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-foreground hover:text-primary" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-foreground hover:text-primary" aria-label="LinkedIn">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div> */}
        <div className="mt-4 flex flex-col justify-between items-center">
        {/* <div className="mt-8 border-t pt-8 flex flex-col md:flex-row justify-between items-center"> */}
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Repayment, inc. All rights reserved.</p>
          {/* <nav className="flex space-x-4 mt-4 md:mt-0">
            <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary">プライバシーポリシー</a>
            <a href="/terms" className="text-sm text-muted-foreground hover:text-primary">利用規約</a>
          </nav> */}
        </div>
      {/* </div> */}
    </footer>
  )
}