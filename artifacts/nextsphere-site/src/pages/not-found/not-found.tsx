import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { useTranslation } from "../../hooks/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">404 Page Not Found</h1>
        <p className="mt-2 text-sm text-gray-600 mb-8">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link href="/">
          <span className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors">
            Torna alla Home
          </span>
        </Link>
      </div>
    </div>
  );
}