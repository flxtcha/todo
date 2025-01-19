"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { DateField } from "./date-field";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTodo } from "@/app/api/api";

// Validation Schema
const formSchema = z.object({ 
  title: z.string().max(30, {
    message: "Title cannot be more than 30 characters",
  }),
  deadline: z.date().refine((date) => date >= new Date(), {
    message: "Deadline cannot be earlier than today",
  }),
  priority: z.enum(["High", "Medium", "Low"], {
    required_error: "Priority is required",
  }),
  status: z.enum(["Not Started", "In Progress", "Completed"], {
    required_error: "Status is required",
  }),
});

export default function CreateTodo() {
  const router = useRouter();
  const queryClient = useQueryClient(); 
  const date = new Date(); 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deadline: new Date(date.setDate(date.getDate() + 1)),
    },
  });

  const mutation = useMutation({
            mutationFn: postTodo,
            onSuccess: () => {
              toast("Aren't you glad thats off your mind :)", {
                description: new Date().toDateString(),
                action: {
                  label: "Undo",
                  onClick: () => console.log("Implement Undo")
                }
              });
              queryClient.invalidateQueries(["todoData"]);
              router.push("/read-todos");
            },
            onError: () => {
              toast.error("Failed to create todo.");
            },
          });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }


  return (
    <div className="create-todo">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Create a Todo</CardTitle>
          <CardDescription>Get something off your mind</CardDescription>
        </CardHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {/* Title Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Name of your Todo"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-red-500">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              {/* Deadline Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Controller
                  name="deadline"
                  control={form.control}
                  render={({ field }) => (
                    <DateField
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                    />
                  )}
                />
                {form.formState.errors.deadline && (
                  <p className="text-red-500">
                    {form.formState.errors.deadline.message}
                  </p>
                )}
              </div>

              {/* Priority Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
                <Controller
                  name="priority"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Current Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.priority && (
                  <p className="text-red-500">
                    {form.formState.errors.priority.message}
                  </p>
                )}
              </div>

              {/* Status Field */}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="status">Status</Label>
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Current Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.status && (
                  <p className="text-red-500">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="submit">Create</Button>
            <Button type="button" variant="destructive" onClick={() => router.push("/read-todos")}>
              Close
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}