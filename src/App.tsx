import React from 'react';
import { Game } from './components/Game';
import { Rocket } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="p-4 text-center">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
          <Rocket className="text-yellow-400" />
          Space Shooter
        </h1>
      </header>
      <main className="container mx-auto">
        <Game />
      </main>
    </div>
  );
}

export default App;