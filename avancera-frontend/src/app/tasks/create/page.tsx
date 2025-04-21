"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/app/store'
import { createTaskReducer, allTaskReducer } from '@/app/store/actions/task.action'

// Define the form data type
type TaskFormData = {
    title: string
    description: string
    status: string
    dueDate: string
}

function Create() {
    const router = useRouter()
    const dispatch = useDispatch<AppDispatch>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Initialize React Hook Form with validation
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<TaskFormData>({
        defaultValues: {
            title: '',
            description: '',
            status: 'pending',
            dueDate: ''
        }
    })

    // Form submission handler
    const onSubmit = async (data: TaskFormData) => {
        try {
            setIsSubmitting(true)
            setError(null)

            // Create task using Redux
            await dispatch(createTaskReducer({
                title: data.title,
                description: data.description,
                status: data.status as 'pending' | 'completed',
                dueDate: data.dueDate
            }))

            await dispatch(allTaskReducer())

            reset()
            router.push('/')
        } catch (error) {
            console.error("Error creating task:", error)
            setError("Failed to create task. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Create New Task</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <Controller
                        name="title"
                        control={control}
                        rules={{
                            required: 'Title is required',
                            minLength: { value: 3, message: 'Title must be at least 3 characters' }
                        }}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                id="title"
                                className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : ''}`}
                                placeholder="Enter task title"
                            />
                        )}
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                    <Controller
                        name="description"
                        control={control}
                        rules={{
                            required: 'Description is required',
                            minLength: { value: 10, message: 'Description must be at least 10 characters' }
                        }}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                id="description"
                                rows={4}
                                className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : ''}`}
                                placeholder="Enter task description"
                            />
                        )}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                <div>
                    <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                    <Controller
                        name="status"
                        control={control}
                        rules={{ required: 'Status is required' }}
                        render={({ field }) => (
                            <select
                                {...field}
                                id="status"
                                className={`w-full p-2 border rounded-md ${errors.status ? 'border-red-500' : ''}`}
                            >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>
                        )}
                    />
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                </div>

                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium mb-1">Due Date</label>
                    <Controller
                        name="dueDate"
                        control={control}
                        rules={{ required: 'Due date is required' }}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="date"
                                id="dueDate"
                                className={`w-full p-2 border rounded-md ${errors.dueDate ? 'border-red-500' : ''}`}
                            />
                        )}
                    />
                    {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>}
                </div>

                <div className="flex space-x-4 pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Creating...' : 'Create Task'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/')}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Create
