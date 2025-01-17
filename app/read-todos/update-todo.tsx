"use client";

import { Button } from "@/components/ui/button";
import { DateField } from "@/components/ui/date-field";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Todo } from "./columns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { putTodo } from "../api/api";
import { useRouter } from "next/navigation";

export const todoFormSchema = z.object({
  title: z.string({ required_error: "A title is required" }).max(30, {
    message: "Title cannot be more than 30 characters"
  }),
  deadline: z.date({ required_error: "A deadline is required" }).refine((date) => date >= new Date(), {
    message: "Deadline cannot be earlier than today",
  }),
  priority: z.enum(["High", "Medium", "Low"], {
    required_error: "A priority is required",
  }),
  status: z.enum(["Not Started", "In Progress", "Completed"], {
    required_error: "A status is required",
  }),
}).required();

interface Props {
  todo: Todo;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export function UpdateTodo({ todo, dialogOpen, setDialogOpen }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof todoFormSchema>>({
    resolver: zodResolver(todoFormSchema),
    defaultValues: {
      title: todo.title,
      priority: todo.priority,
      deadline: todo.deadline,
      status: todo.status,
    },
  });

  // Mutation for updating the todo
  const mutation = useMutation({
    mutationFn: putTodo,
    onSuccess: (data) => {
      toast.success("Todo updated successfully!");
      queryClient.invalidateQueries(); 
      setDialogOpen(false);
    },
    onError: () => {
      toast.error("Failed to update the todo.");
    },
  });

  const onSubmit = (values: z.infer<typeof todoFormSchema>) => {
    mutation.mutate({ values, todoId: todo.id });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>Make changes to your Todo here. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="grid gap-2" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Title Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <div className="col-span-3">
                <Input
                  id="title"
                  placeholder="Name of your Todo"
                  {...form.register("title")}
                />
                {form.formState.errors.title?.message && (
                  <p className="text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>
            </div>

            {/* Deadline Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deadline" className="text-right">
                Deadline
              </Label>
              <div className="col-span-3">
                <Controller
                  name="deadline"
                  control={form.control}
                  render={({ field }) => (
                    <DateField
                      selected={field.value} // Ensure it's a valid Date
                      onChange={(date) => field.onChange(date)} // Pass date to field
                    />
                  )}
                />
                {form.formState.errors.deadline?.message && (
                  <p className="text-red-500">
                    {form.formState.errors.deadline.message}
                  </p>
                )}
              </div>
            </div>

            {/* Priority Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <div className="col-span-3">
                <Controller
                  name="priority"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.priority?.message && (
                  <p className="text-red-500">
                    {form.formState.errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Status Field */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <div className="col-span-3">
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {form.formState.errors.status?.message && (
                  <p className="text-red-500">
                    {form.formState.errors.status.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
