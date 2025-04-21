import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { addTask, setSingleTask, setTasks, updateTask } from "../slices/task.slice";
import { Task } from "../slices/task.slice";

const BASE_URL = 'http://localhost:5000/api/tasks';

interface SingleTaskResponse {
    success: boolean;
    task: Task;
    message?: string;
}

interface TasksResponse {
    success: boolean;
    tasks: Task[];
    message?: string;
}

interface DeleteResponse {
    success: boolean;
    message: string;
}

interface TaskPayload {
    title: string;
    description?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    dueDate: string;
}

interface UpdateTaskPayload {
    id: number;
    data: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>;
}

interface AllTasksResponse {
    tasks: Task[];
    success: boolean;
}

export const createTaskReducer = createAsyncThunk<Task, TaskPayload>(
    'create/task',
    async (taskData, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.post<SingleTaskResponse>(BASE_URL, taskData);
            const { task, success } = response.data;

            if (success && task) {
                console.log({task})
                dispatch(addTask(task));
                return task;
            }

            return rejectWithValue('Failed to create task');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Error creating task');
        }
    }
);

export const allTaskReducer = createAsyncThunk<AllTasksResponse, void>(
    'get/tasks',
    async (_, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get<TasksResponse>(BASE_URL);

            if (response.data.success && response.data.tasks) {
                dispatch(setTasks(response.data.tasks));
                return {
                    tasks: response.data.tasks,
                    success: response.data.success
                };
            }

            return rejectWithValue('Failed to fetch tasks');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Error getting tasks');
        }
    }
);

export const updateTaskReducer = createAsyncThunk<Task, UpdateTaskPayload>(
    'task/update',
    async ({ id, data }, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.put<SingleTaskResponse>(`${BASE_URL}/${id}`, data);
            const { task, success } = response.data;

            if (success && task) {
                dispatch(updateTask(task));
                return task;
            }

            return rejectWithValue('Failed to update task');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Error updating task');
        }
    }
);

export const deleteTaskReducer = createAsyncThunk<string, number>(
    'task/delete',
    async (id, {dispatch ,  rejectWithValue }) => {
        try {
            const response = await axios.delete<DeleteResponse>(`${BASE_URL}/${id}`);
            const { success, message } = response.data;

            if (success && message) {
                dispatch(allTaskReducer())
                return message;
            }

            return rejectWithValue('Failed to delete task');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Error deleting task');
        }
    }
);

export const detailTaskReducer = createAsyncThunk<Task, number>(
    'task/details',
    async (id, { dispatch, rejectWithValue }) => {
        try {
            const response = await axios.get<SingleTaskResponse>(`${BASE_URL}/${id}`);
            const { task, success } = response.data;

            if (success && task) {
                dispatch(setSingleTask(task));
                return task;
            }

            return rejectWithValue('Failed to fetch task details');
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Error getting task detail');
        }
    }
); 