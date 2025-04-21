import CreateButton from './components/CreateButton'
import TaskList from './components/TaskList'
import { store } from './store'
import { allTaskReducer } from './store/actions/task.action'
import { Task } from './store/slices/task.slice'

export default async function Page() {
  let initialTasks: Task[] = []

  try {
    const result = await store.dispatch(allTaskReducer())

    if (allTaskReducer.fulfilled.match(result)) {
      initialTasks = result.payload.tasks
    } else {
      console.error('Failed to fetch tasks:', result.error)
    }
  } catch (error) {
    console.error('Error fetching tasks:', error)
  }

  return (
    <div className='overflow-x-hidden p-3.5'>
      <h1 className='text-3xl mb-4'>
        Task Management System
      </h1>

      <CreateButton />

      <TaskList initialTasks={initialTasks} />
    </div>
  )
}
