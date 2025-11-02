import FlyingModiGame from "./components/FlyingModiGame";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
          Flying Modi
        </h1>
        <p className="text-lg text-gray-700 font-medium">
          Navigate through obstacles and set a high score!
        </p>
      </div>
      
      <FlyingModiGame />
      
      <div className="mt-8 text-center max-w-md">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border-2 border-orange-200">
          <h3 className="font-bold text-lg mb-3 text-gray-800">How to Play</h3>
          <ul className="text-left space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Press <kbd className="px-2 py-1 bg-gray-200 rounded text-sm font-mono">SPACE</kbd> or <strong>Click</strong> to make Modi fly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Avoid hitting the green pipes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Each pipe you pass increases your score</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-orange-500 font-bold">•</span>
              <span>Try to beat your high score!</span>
            </li>
          </ul>
        </div>
      </div>
      
      <footer className="mt-8 text-gray-600 text-sm">
        <p>Made with ❤️ for viral fun!</p>
      </footer>
    </div>
  );
}
