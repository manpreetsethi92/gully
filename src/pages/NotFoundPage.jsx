import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Syne:wght@400;500;600;700;800&display=swap');
        .font-display { font-family: 'Playfair Display', serif; }
        .font-syne { font-family: 'Syne', sans-serif; }
      `}</style>
      
      <div className="text-center max-w-md">
        {/* Butterfly */}
        <div className="mb-8 flex justify-center">
          <img 
            src="/butterfly.png" 
            alt="Titli" 
            className="w-32 h-auto opacity-50"
          />
        </div>
        
        {/* 404 */}
        <h1 className="font-display text-8xl md:text-9xl font-bold text-white/10 mb-4">
          404
        </h1>
        
        {/* Message */}
        <h2 className="font-display text-3xl md:text-4xl text-white mb-4 lowercase">
          page not found
        </h2>
        <p className="font-syne text-white/50 mb-8">
          the page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#E50914] text-white font-syne font-semibold transition-all hover:shadow-lg hover:shadow-red-500/25"
          >
            <Home size={18} />
            go home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/70 font-syne font-medium hover:bg-white/5 transition-all"
          >
            <ArrowLeft size={18} />
            go back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
