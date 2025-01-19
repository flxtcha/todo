"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { UpdateTodo } from "./update-todo";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTodo } from "../api/api";
import { useRouter } from "next/navigation";

export type Todo = {
  id: string;
  title: string;
  priority: "Low" | "Medium" | "High";
  deadline: Date;
  status: "Not Started" | "In Progress" | "Completed";
};

// Create a separate ActionsCell component to handle the hooks
const ActionsCell = ({ todo }: { todo: Todo }) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      toast.success("Deleted Todo", {
        description: new Date().toDateString(),
        action: {
          label: "Undo",
          onClick: () => console.log("Implement Undo"),
        },
      });
      queryClient.invalidateQueries(["todoData"]);
      router.refresh();
    },
    onError: () => {
      toast.error("Failed to delete todo.");
    },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `${todo.title},${todo.priority},${todo.deadline},${todo.status}`
      );
      toast.success("Copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
      console.error(error);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleCopy}>Copy Todo</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpen(true)}>Edit Todo</DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutation.mutate(todo.id)}>Delete Todo</DropdownMenuItem>
      </DropdownMenuContent>
      <UpdateTodo todo={todo} dialogOpen={open} setDialogOpen={setOpen} />
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Todo>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Priority
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "deadline",
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Deadline
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        className="p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const todo = row.original;
      return <ActionsCell todo={todo} />;
    },
  },
];
