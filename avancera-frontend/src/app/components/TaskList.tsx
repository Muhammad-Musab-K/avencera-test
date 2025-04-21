"use client"

import React from 'react'
import useSWR from 'swr'
import AppTable from './Table'
import { Task } from '../store/slices/task.slice'
import { allTaskReducer } from '../store/actions/task.action'
import { store } from '../store'

const fetcher = async () => {
  try {
    const result = await store.dispatch(allTaskReducer())
    if (allTaskReducer.fulfilled.match(result)) {
      return result.payload.tasks
    }
    return []
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return []
  }
}

interface TaskListProps {
  initialTasks: Task[]
}

export default function TaskList({ initialTasks }: TaskListProps) {
  const { data: tasks = initialTasks, error } = useSWR<Task[]>('tasks', fetcher, {
    fallbackData: initialTasks,
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  })

  const tableData = tasks.map((task: Task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    DueDate: task.dueDate
  }))

  return (
    <AppTable 
      tableHeader={[ 'Title', 'Description', 'Status', 'Due Date','Actions']} 
      tableData={tableData} 
      edit={true} 
    />
  )
} 