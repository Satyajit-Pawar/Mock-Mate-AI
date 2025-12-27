import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { GraduationCap, Bot, BarChart, Trophy, Briefcase, Mic, ClipboardCheck } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

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

const howItWorks = [
    {
        icon: <Briefcase className="h-10 w-10 text-primary" />,
        title: '1. Select Your Interview',
        description: 'Choose from various interview types like Technical, HR, or Behavioral to match your needs.',
    },
    {
        icon: <Mic className="h-10 w-10 text-primary" />,
        title: '2. Answer with AI',
        description: 'Engage with our AI interviewer, answer questions, and simulate a real-life interview experience.',
    },
    {
        icon: <ClipboardCheck className="h-10 w-10 text-primary" />,
        title: '3. Get Instant Feedback',
        description: 'Receive a detailed analysis of your answers, including scores, strengths, and areas for improvement.',
    },
];

const testimonials = [
  {
    id: "testimonial-1",
    name: "Priya Sharma",
    title: "Software Engineer",
    quote: "MockMate AI was a game-changer for my job search. The feedback was incredibly detailed and helped me polish my answers. I landed my dream job at a top tech company!",
  },
  {
    id: "testimonial-2",
    name: "David Chen",
    title: "Recent Graduate",
    quote: "As a fresher, I was nervous about interviews. This platform gave me the confidence I needed. The AI is surprisingly realistic, and the progress tracking kept me motivated.",
  },
  {
    id: "testimonial-3",
    name: "Emily Rodriguez",
    title: "HR Specialist",
    quote: "I recommend MockMate AI to all my candidates. It's the best way to practice and get comfortable with different interview styles. A truly invaluable tool for career growth.",
  },
];


export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="z-40">
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
        <section className="grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-10">
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

        <section id="how-it-works" className="py-20 lg:py-32">
          <div className="container text-center">
            <h2 className="text-3xl font-bold lg:text-4xl mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {howItWorks.map((step, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="bg-primary/10 p-5 rounded-full mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground max-w-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 lg:py-32 bg-card">
          <div className="container">
            <h2 className="text-3xl font-bold text-center lg:text-4xl mb-12">Loved by Students and Professionals</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => {
                const image = PlaceHolderImages.find(p => p.id === testimonial.id);
                return (
                  <Card key={testimonial.id}>
                    <CardContent className="pt-6">
                      <blockquote className="text-muted-foreground">"{testimonial.quote}"</blockquote>
                      <div className="flex items-center mt-4">
                        {image && (
                          <Image
                            src={image.imageUrl}
                            alt={testimonial.name}
                            width={40}
                            height={40}
                            className="rounded-full mr-4"
                            data-ai-hint={image.imageHint}
                          />
                        )}
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
