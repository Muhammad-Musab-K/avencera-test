import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    dueDate: string;
    createdAt?: string;
    updatedAt?: string;
}

interface TaskState {
    tasks: Task[];
    singleTask: Task | null;
}

const initialState: TaskState = {
    tasks: [],
    singleTask: null
}

const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTasks: (state, action: PayloadAction<Task[]>) => {
            state.tasks = action.payload;
        },

        addTask: (state, action: PayloadAction<Task>) => {
            state.tasks.push(action.payload);
        },

        updateTask: (state, action: PayloadAction<Task>) => {
            const index = state.tasks.findIndex(task => task.id === action.payload.id);
            if (index !== -1) {
                state.tasks[index] = action.payload;
            }
        },

        deleteTask: (state, action: PayloadAction<number>) => {
            state.tasks = state.tasks.filter(task => task.id !== action.payload);
        },

        setSingleTask: (state, action: PayloadAction<Task | null>) => {
            state.singleTask = action.payload;
        }
    }
});

export const { setTasks, addTask, updateTask, deleteTask, setSingleTask } = taskSlice.actions;

export default taskSlice.reducer;