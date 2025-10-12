import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AssistantFAB } from '../atoms/AssistantFab';
import { AssistantPanel } from '../Organisms/AssistantPanel';

export function RootLayout() {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  return (
    <>
      <Outlet />
      <AssistantFAB onClick={() => setIsAssistantOpen(true)} />
      <AssistantPanel isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </>
  );
}