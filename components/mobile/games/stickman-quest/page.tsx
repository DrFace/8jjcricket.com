'use client'

import dynamic from 'next/dynamic'

const StickmanQuest = dynamic(() => import('@/components/games/StickmanQuest'), {
    ssr: false,
})

export default function StickmanQuestPage() {
    return (
        <div className="p-4">
            <StickmanQuest />
        </div>
    )
}
