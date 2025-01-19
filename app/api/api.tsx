import { z } from "zod";
import { todoFormSchema } from "../read-todos/update-todo";
import { Todo } from "../read-todos/columns";
import { enGB } from "date-fns/locale";
import { format, parse } from "date-fns";

const contextPath = 'http://localhost:8080/api/v1';

function formattedDeadline(deadline: Date) {
  return format(deadline, "dd-MM-yyyy");
}

export async function getTodos(): Promise<Todo[]> {
  const res = await fetch(`${contextPath}/todos`, {
    method: "GET",
    credentials: "include"
  });

  console.log("Get request sent")

  if (!res.ok) {
    throw new Error(`Failed to fetch todos: ${res.statusText}`);
  }

  const todos: Todo[] = await res.json(); 
  console.log(todos); //Returns a javascript objec not json

  return todos.map((todo) => ({
    ...todo,
    deadline: todo.deadline ? parse(todo.deadline.toString(), "dd-MM-yyyy", new Date(), { locale: enGB }) : new Date(),
  }));
}

export async function postTodo(values: z.infer<typeof todoFormSchema>) {
  const res = await fetch(`${contextPath}/create-todo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      ...values,
      deadline: () => formattedDeadline(values.deadline),
    }),
  });

  console.log("Post request sent")

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
      ...values,
      deadline: () => formattedDeadline(values.deadline),
    }),
  });

  console.log(formattedDeadline(values.deadline))

  console.log("Put request sent")

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

  console.log("Delete request sent")

  if (!res.ok) {
    throw new Error(`Failed to DELETE todo: ${res.statusText}`)
  }
};