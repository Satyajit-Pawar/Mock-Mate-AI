"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type AuthFormProps = {
  mode: 'login' | 'signup';
};

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
      <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 109.8 512 0 402.2 0 261.8 0 122.4 109.8 13.6 244 13.6c70.3 0 129.8 27.8 174.4 72.4l-64 64c-21-20.5-49.3-33.5-84.4-33.5-68.2 0-123.3 54.9-123.3 123.3s55.1 123.3 123.3 123.3c76.3 0 104.3-54.9 108.5-82.9H244v-75.2h244z"></path>
    </svg>
);


export default function AuthForm({ mode }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { loginWithEmail, signupWithEmail, loginWithGoogle } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await loginWithEmail(values.email, values.password);
      } else {
        await signupWithEmail(values.email, values.password);
      }
    } catch (error) {
      // Error is handled in auth-context
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (error) {
       // Error is handled in auth-context
    } finally {
        setIsGoogleLoading(false);
    }
  };

  const anyLoading = isLoading || isGoogleLoading;

  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="name@example.com" {...field} disabled={anyLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} disabled={anyLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={anyLoading} size="lg" suppressHydrationWarning>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? 'Log In' : 'Sign Up'}
          </Button>
        </form>
      </Form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={anyLoading} size="lg" suppressHydrationWarning>
        {isGoogleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GoogleIcon />}
        Google
      </Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
        <Link href={mode === 'login' ? '/signup' : '/login'} className="underline hover:text-primary">
          {mode === 'login' ? 'Sign Up' : 'Log In'}
        </Link>
      </p>
    </div>
  );
}
