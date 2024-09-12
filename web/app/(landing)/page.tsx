import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export const metadata: Metadata = {
    alternates: { canonical: "/" },
  };

export default function Home() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
            <div className="max-w-3xl mx-auto text-center space-y-8">
                <div className="inline-block bg-yellow-100 text-yellow-800 rounded-full px-4 py-2 text-sm font-semibold mb-4">
                <span role="img" aria-label="Trophy" className="mr-2">🏆</span>
                YOU ARE THE CHAMPION
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
                Dominate<br />Your Muscles
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {/* Your key to peak performance. Scientifically-backed workouts, precision tracking. Download now and rise above. */}
                あなたのトレーニングのパフォーマンスを最大、最適化し、精度の高いトレーニングを行うためのお手伝いをするアプリです。
                </p>

                <Link href="/register">
                    <Button size="lg" className="text-lg mt-6 px-8 py-6">
                    {/* Get Started */}
                        今すぐ始める
                    </Button>
                </Link>

                <p className="text-muted-foreground">
                {/* Trusted by 7,000+ productive users */}
                    「筋トレの結果をメモするのに時間がかかる。」

                    「トレーニングをアプリで管理できないかな？」<br /><br />

                    筋トレを真剣に取り組むあなたへ。<br />
                    メニュー、回数、結果の記録…<br />
                    それらを簡単に管理できたら？<br /><br />

                    筋トレをしっかり行うために、メニューや回数、結果など記録をしっかりしたい人もいると思います。<br />
                    しかしいちいちノートなどにメモするのは大変。
                    そんなあなたへ。もう紙のノートは必要ありません。<br />
                    どれぐらい成長したかがひと目でパッとわかるようになります!<br /><br />

                    Dominate Muscleが、あなたの筋トレライフのお手伝いをします。<br /><br />

                </p>
            </div>
        </main>
    )
}