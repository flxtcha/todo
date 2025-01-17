"use client"
import CreateTodo from "@/components/ui/create-todo"
import Navigation from "@/components/ui/navigation"
import * as React from "react"

export default function Create() {
    return (
        <div className="create-todo flex flex-col ml-4">
            <Navigation></Navigation>
            <CreateTodo></CreateTodo>
        </div>
    )
};