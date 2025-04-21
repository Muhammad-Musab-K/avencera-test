"use client"

import React from 'react'
import { useRouter } from 'next/navigation'

function CreateButton() {
    const router = useRouter()

    return (
        <button
            onClick={() => router.push('/tasks/create')}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 mb-4"
        >
            Create New Task
        </button>
    )
}

export default CreateButton 