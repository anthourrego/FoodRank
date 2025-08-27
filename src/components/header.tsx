import { Link } from "react-router";
import logo from '../assets/images/logo.png';

export function Header() {
  return (
    <header className="bg-red-800/80 backdrop-blur-sm text-white sticky top-0 z-50">
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
            <Link to="/">
              <img src={logo} alt="Food Rank" className="h-12 w-auto" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
