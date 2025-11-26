import React from 'react';
import LifePlanner from '@/components/planner/LifePlanner';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <LifePlanner />
      <Toaster position="bottom-right" theme="dark" />
    </>
  );
}

export default App;