
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageTransition } from "@/components/PageTransition";

const Index = () => {
  const { t } = useLanguage();

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100">
        <div className="max-w-3xl mx-auto text-center p-6">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            MultiAdvancedFlow
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Stream and receive content in real-time with advanced features
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Index;
