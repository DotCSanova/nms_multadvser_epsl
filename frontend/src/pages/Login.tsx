
import { AuthButton } from "@/components/AuthButton";
import { AuthLayout } from "@/components/AuthLayout";
import { PageTransition } from "@/components/PageTransition";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.password) {
      return;
    }
    
    const success = await login(formData.username, formData.password);
    if (success) {
      // Store username in localStorage
      localStorage.setItem('username', formData.username);
      // Important: Let's add this to ensure the isAuthenticated flag is also set in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      navigate("/dashboard");
    }
  };

  return (
    <PageTransition>
      <AuthLayout 
        title="Welcome back" 
        subtitle="Enter your credentials to access your account"
        backTo="/"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                placeholder="username123"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-sm text-destructive">
                {error}
              </div>
            )}
          </div>
          
          <AuthButton
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </AuthButton>
        </form>
      </AuthLayout>
    </PageTransition>
  );
};

export default Login;
