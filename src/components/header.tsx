import { useState } from "react";
import { Link } from "react-router";
import logo from '../assets/images/logo.webp';
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "@/features/public/auth/context/AuthContext";
import { useAuthStore } from "@/store/useAuthStore";

export function Header() {
  const { logout } = useAuth();
  // is logged  
  const isLogged = useAuthStore((state) => state.isLogged);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-red-800/80 backdrop-blur-sm text-white sticky top-0 z-50 overflow-x-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - siempre visible */}
          <div className="flex items-center flex-shrink-0">
            <Link to="/" onClick={closeMobileMenu}>
              <img src={logo} alt="Food Rank" className="h-12 w-auto" />
            </Link>
          </div>

          {/* Menú Desktop - oculto en móvil */}
          <nav className="hidden md:flex items-center space-x-8 flex-1 ml-8">
            <Link to='/' className="hover:text-red-200 transition-colors whitespace-nowrap">
              Inicio
            </Link>
            {isLogged && (
              <>
                <Link to="/home/manage-events" className="hover:text-red-200 transition-colors whitespace-nowrap">
                  Eventos
                </Link>
                <Link to="/home/restaurants" className="hover:text-red-200 transition-colors whitespace-nowrap">
                  Restaurantes
                </Link>
                <Link to="/home/ranking" className="hover:text-red-200 transition-colors whitespace-nowrap">
                  Ranking
                </Link>
                <Link to="/home/qr" className="hover:text-red-200 transition-colors whitespace-nowrap">
                  Generar QR
                </Link>
                <Link to="/home/configuration" className="hover:text-red-200 transition-colors whitespace-nowrap">
                  Configuración
                </Link>
              </>)
            }
          </nav>

          {/* Botones de acción Desktop - oculto en móvil */}
          <div className="hidden md:flex items-center">
            {isLogged && (
              <button 
                className="flex items-center gap-2 hover:text-red-200 transition-colors cursor-pointer" 
                onClick={logout}
                aria-label="Cerrar sesión"
              >
                <span>Salir</span>
                <LogOut size={20} />
              </button>
            )}
          </div>

          {/* Botón hamburguesa - solo visible en móvil */}
          <div className="md:hidden flex items-center gap-4">
            {isLogged && (
              <button 
                className="cursor-pointer hover:text-red-200 transition-colors" 
                onClick={logout}
                aria-label="Cerrar sesión"
              >
                <LogOut size={20} />
              </button>
            )}
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none focus:ring-2 focus:ring-red-200 rounded p-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-red-700/50">
            <nav className="flex flex-col py-4 space-y-3">
              <Link 
                to='/' 
                className="hover:text-red-200 transition-colors px-2 py-1"
                onClick={closeMobileMenu}
              >
                Inicio
              </Link>
              {isLogged && (
                <>
                  <Link 
                    to="/home/manage-events" 
                    className="hover:text-red-200 transition-colors px-2 py-1"
                    onClick={closeMobileMenu}
                  >
                    Eventos
                  </Link>
                  <Link 
                    to="/home/restaurants" 
                    className="hover:text-red-200 transition-colors px-2 py-1"
                    onClick={closeMobileMenu}
                  >
                    Restaurantes
                  </Link>
                  <Link 
                    to="/home/ranking" 
                    className="hover:text-red-200 transition-colors px-2 py-1"
                    onClick={closeMobileMenu}
                  >
                    Ranking
                  </Link>
                  <Link 
                    to="/home/qr" 
                    className="hover:text-red-200 transition-colors px-2 py-1"
                    onClick={closeMobileMenu}
                  >
                    Generar QR
                  </Link>
                  <Link 
                    to="/home/configuration" 
                    className="hover:text-red-200 transition-colors px-2 py-1"
                    onClick={closeMobileMenu}
                  >
                    Configuración
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
