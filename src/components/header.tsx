import { Link } from "react-router";
import logo from '../assets/images/logo.webp';
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/public/auth/context/AuthContext";

export function Header() {
const { logout } = useAuth();

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
            <Link to="/home/restaurants" className="hover:text-red-200 transition-colors">
              Restaurantes
            </Link>
            <Link to="/home/ranking" className="hover:text-red-200 transition-colors">
              Ranking
            </Link>
            <Link to="/home/qr" className="hover:text-red-200 transition-colors">
              Generar QR
            </Link>
            <Link to="/home/configuration" className="hover:text-red-200 transition-colors">
              Configuración
            </Link>
          
          </nav>

          <div className="flex items-center">
            <Link to="/">
              <img src={logo} alt="Food Rank" className="h-12 w-auto" />
            </Link>
            <div className="ml-5 cursor-pointer" onClick={logout}>
              <LogOut />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
