
import { AuthButton } from "@/components/AuthButton";
import { PageTransition } from "@/components/PageTransition";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <PageTransition>
      <div className="page-container">
        <motion.div 
          className="flex flex-col items-center justify-center space-y-8 text-center max-w-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-display">
              Welcome to MultiAdvancedFlow
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect and stream with ease
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/register" className="flex-1">
              <AuthButton className="w-full">
                Register
              </AuthButton>
            </Link>
            <Link to="/login" className="flex-1">
              <AuthButton variant="secondary" className="w-full">
                Login
              </AuthButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default Home;
