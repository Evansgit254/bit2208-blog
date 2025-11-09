import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="w-full min-h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="max-w-5xl mx-auto p-8 text-center">
        <div className="flex justify-center gap-8">
          <a href="https://vite.dev" target="_blank" rel="noreferrer" className="hover:drop-shadow-[0_0_2em_#646cffaa]">
            <img src={viteLogo} className="h-24 p-6 transition-all" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" rel="noreferrer" className="hover:drop-shadow-[0_0_2em_#61dafbaa]">
            <img src={reactLogo} className="h-24 p-6 transition-all animate-[spin_20s_linear_infinite]" alt="React logo" />
          </a>
        </div>
        <h1 className="text-4xl font-bold my-8">Vite + React</h1>
        <div className="p-8">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="rounded-lg border border-transparent px-5 py-2.5 bg-[#1a1a1a] cursor-pointer transition-colors hover:border-[#646cff] focus:outline-none focus:ring-4"
          >
            count is {count}
          </button>
          <p className="mt-4">
            Edit <code className="font-mono bg-gray-700/30 rounded px-2 py-1">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <p className="text-gray-400">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
