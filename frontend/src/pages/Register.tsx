
import { AuthButton } from "@/components/AuthButton";
import { AuthLayout } from "@/components/AuthLayout";
import { PageTransition } from "@/components/PageTransition";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      return;
    }
    
    const success = await register(formData.username, formData.password);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <PageTransition>
      <AuthLayout 
        title="Create an account" 
        subtitle="Enter your details to create your account"
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
                autoComplete="new-password"
                required
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="form-input"
                value={formData.confirmPassword}
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
            {isLoading ? "Creating account..." : "Create account"}
          </AuthButton>
        </form>
      </AuthLayout>
    </PageTransition>
  );
};

export default Register;
