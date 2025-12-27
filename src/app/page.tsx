import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GraduationCap, Bot, BarChart, Trophy } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Interviews',
    description: 'Engage in realistic mock interviews with our advanced AI.',
  },
  {
    icon: <Trophy className="h-8 w-8 text-primary" />,
    title: 'Instant Feedback',
    description: 'Receive detailed feedback on your performance right after your answer.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-primary" />,
    title: 'Track Your Progress',
    description: 'Monitor your improvement over time with our performance analytics.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container z-40">
        <div className="flex h-20 items-center justify-between py-6">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">MockMate AI</span>
          </Link>
          <nav>
            <Button asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
            <div className="text-center lg:text-start space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl font-headline">
                    Ace Your Next Interview with AI
                </h1>
                <p className="mt-6 max-w-2xl mx-auto lg:mx-0 text-lg text-muted-foreground">
                    Practice mock interviews, get instant feedback, and track your progress to land your dream job.
                </p>
                <div className="mt-8 space-x-4">
                    <Button size="lg" asChild>
                        <Link href="/dashboard">Start Practicing Now</Link>
                    </Button>
                </div>
            </div>
            {heroImage && (
                <div className="z-10">
                    <Image
                        src={heroImage.imageUrl}
                        alt={heroImage.description}
                        width={600}
                        height={400}
                        className="rounded-lg shadow-lg"
                        data-ai-hint={heroImage.imageHint}
                        priority
                    />
                </div>
            )}
        </section>
        
        <section id="features" className="py-20 lg:py-32 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold text-center lg:text-4xl mb-12">Why MockMate AI?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center text-center p-6 rounded-lg">
                  <div className="bg-primary/10 p-4 rounded-full">{feature.icon}</div>
                  <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0 bg-card border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MockMate AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
