"use client"

import { AppDispatch, RootState } from '@/app/store'
import { detailTaskReducer, updateTaskReducer } from '@/app/store/actions/task.action'
import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'

type TaskFormData = {
    title: string
    description: string
    status: string
    dueDate: string
}

function Edit() {
    const params = useParams()
    const router = useRouter()
    const taskId = Number(params.id)
    const dispatch = useDispatch<AppDispatch>()

    const task = useSelector((state: RootState) => state.task.singleTask)

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
        defaultValues: {
            title: '',
            description: '',
            status: 'pending',
            dueDate: ''
        }
    })

    useEffect(() => {
        const fetchTask = async () => {
            try {
                await dispatch(detailTaskReducer(taskId))
            } catch (error) {
                console.error("Error fetching task:", error)
            }
        }

        fetchTask()
    }, [taskId, dispatch])

    useEffect(() => {
        if (task) {
            const formattedDate = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''

            reset({
                title: task.title,
                description: task.description,
                status: task.status,
                dueDate: formattedDate
            })
        }
    }, [task, reset])

    const onSubmit = async (data: TaskFormData) => {
        try {
            await dispatch(updateTaskReducer({
                id: taskId,
                data: {
                    title: data.title,
                    description: data.description,
                    status: data.status as 'pending' | 'completed',
                    dueDate: data.dueDate
                }
            }))

            router.push('/')
        } catch (error) {
            console.error("Error updating task:", error)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Edit Task</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                    <Controller
                        name="title"
                        control={control}
                        rules={{ required: 'Title is required' }}
                        render={({ field }) => (
                            <input
                                {...field}
                                type="text"
                                id="title"
                                className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : ''}`}
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
                        rules={{ required: 'Description is required' }}
                        render={({ field }) => (
                            <textarea
                                {...field}
                                id="description"
                                rows={4}
                                className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : ''}`}
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
                        {isSubmitting ? 'Saving...' : 'Save Changes'}
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

export default Edit
