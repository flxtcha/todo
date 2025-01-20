import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import axios, { isAxiosError } from 'axios'; // Import AxiosError
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { useState } from "react";

// Define the schema
const formSchema = z.object({
  email: z.string().email({
    message: "Must be a valid email.",
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long'
  })
});

export function Login() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  // Define your form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  // Define the onSubmit function
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setServerError(null);
    try {
      const response = await axios.post(
        'https://mysterious-sada-tomfletcher-e440737c.koyeb.app/api/v1/login',
        new URLSearchParams({
          username: values.email, // Spring Security expects "username" by default
          password: values.password, // Spring Security expects "password" by default
        }).toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded', // Required for form submissions
          },
          withCredentials: true, // Ensure cookies are included for session-based authentication
        }
      );

      if (response.status === 200) {
        router.push('/read-todos');
      }
    } catch (error: unknown) { // Use `unknown` for better type safety
      if (isAxiosError(error)) { // Check if error is an AxiosError
        setServerError(error.response?.data?.message || 'Failed to login, try again...');
        form.setError('root.serverError', {
          type: 'manual',
          message: error.response?.data?.message || 'Failed to login',
        });
      } else {
        setServerError('An unexpected error occurred');
      }
      console.error('Error logging in:', error);
    }
  }

  function handleRegister() {
    router.push('/register');
  }

  return (
    <div className="login-form">
      <Form {...form}>
        <div className="border p-16 rounded">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="user@example.com" {...field} />
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
                    <Input placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="login-buttons flex justify-between">
              <Button type="submit" className="login-button">Login</Button>
              <Button variant="secondary" onClick={handleRegister}>Register</Button>
            </div>
            {serverError && <FormMessage>{serverError}</FormMessage>}
          </form>
        </div>
      </Form>
    </div>
  );
}
