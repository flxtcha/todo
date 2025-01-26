import { z } from "zod";
import { todoFormSchema } from "../read-todos/update-todo";
import { Todo } from "../read-todos/columns";

const contextPath = 'https://api.t-fletcher.co.uk';

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${contextPath}/todos`, {
    method: "GET",
    credentials: "include"
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch todos: ${res.statusText}`);
  }

  const todos: Todo[] = await res.json(); 
  console.log(todos); 

  return todos; 
}

export async function postTodo(values: z.infer<typeof todoFormSchema>) {
  console.log(values.deadline)
  const res = await fetch(`${contextPath}/create-todo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ...values
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to POST todo: ${res.statusText}`)
  }

  return res.json();
}

export async function putTodo({ values, todoId, }: { values: z.infer<typeof todoFormSchema>, todoId: string }) {// Format deadline to 'dd-MM-yyyy'

  const res = await fetch(`${contextPath}/update-todo/${todoId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ...values
    }),
  });

  if (!res.ok) {
    throw new Error(`Failed to PUT (Update) todo: ${res.statusText}`);
  }

  return res.json(); // Return the response
}



export async function deleteTodo(todoId: string) {
  const res = await fetch(`${contextPath}/delete-todo/${todoId}`, {
    credentials: 'include',
    method: 'DELETE'
  });

  if (!res.ok) {
    throw new Error(`Failed to DELETE todo: ${res.statusText}`)
  }
};