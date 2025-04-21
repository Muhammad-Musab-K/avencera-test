export interface Task {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'completed';
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}
