import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

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
                Your key to peak performance. Scientifically-backed workouts, precision tracking. Download now and rise above.
                </p>

                <Button size="lg" className="text-lg px-8 py-6">
                Get Started
                </Button>

                <p className="text-muted-foreground">
                Trusted by 7,000+ productive users
                </p>
            </div>
        </main>
    )
}