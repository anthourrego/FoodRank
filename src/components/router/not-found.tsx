import { AlertCircle, ArrowLeft, Home } from "lucide-react";

import { Link, Navigate, useNavigate } from "react-router";
import { Button } from "../ui/button";


export default function NotFound() {

  
  return (
    <div className="h-full bg-background  overflow-auto">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 ">
        <div className="max-w-2xl mx-auto text-center">
          {/* Error icon and code */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
              <AlertCircle className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-8xl md:text-9xl font-light text-primary/80 mb-2 tracking-tight">404</h1>
          </div>

          {/* Main content */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">Página no encontrada</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Lo sentimos, la página que está buscando no existe o ha sido movida a otra ubicación.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3">
              <Link to="/home">
                <Home className="mr-2 h-4 w-4" />
                Ir al inicio
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.history.back()}
              className="border-border text-foreground hover:bg-accent hover:text-accent-foreground px-8 py-3"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver atrás
            </Button>
          </div>



          {/* Footer info */}
          <div className="mt-16 pt-8 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Si el problema persiste, por favor contacte con nuestro equipo de soporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
