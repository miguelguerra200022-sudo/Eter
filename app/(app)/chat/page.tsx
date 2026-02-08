"use client";

import dynamic from 'next/dynamic';

const ChatPageContent = dynamic(
    () => import('@/components/chat/ChatPageContent'),
    { ssr: false }
);

export default function ChatPage() {
    return <ChatPageContent />;
}
