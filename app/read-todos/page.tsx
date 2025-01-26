"use client"

import { columns, Todo } from "@/app/read-todos/columns";
import { DataTable } from "@/app/read-todos/data-table";
import * as React from "react";
import Navigation from "@/components/ui/navigation";
import { useQuery } from "@tanstack/react-query";
import { getTodos } from "../api/api";

export default function ReadTodos() {
  const { isLoading, error, data } = useQuery<Todo[]>({
    queryKey: ['todoData'],
    queryFn: getTodos,
  });

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred:";

  return (
    <div className="read-todos flex flex-col ml-4 mr-4 h-screen">
      <Navigation />
      <DataTable columns={columns} data={data ? data : []} />
    </div> 
  );
}