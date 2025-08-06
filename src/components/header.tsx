import { Link } from "react-router";

export function Header() {
  return (
    <header className="bg-red-800/80 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <nav className="flex items-center space-x-8">
            <Link to='/' className="hover:text-red-200 transition-colors">
              Inicio
            </Link>
            <Link to="/rate-product" className="hover:text-red-200 transition-colors">
              Participantes
            </Link>
          
          </nav>

          <div className="flex items-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold text-sm">Food Rank</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
