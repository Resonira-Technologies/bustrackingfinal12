import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bus, Eye, EyeOff, ArrowLeft, Key, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

const DEFAULT_CREDENTIALS = {
  admin: { email: "admin@bustrack.com", password: "123" },
  parent: { email: "parent@bustrack.com", password: "123" },
  driver: { email: "driver@bustrack.com", password: "123" },
};

export default function Login() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!role || !['admin', 'parent', 'driver'].includes(role)) {
      navigate("/");
    }
  }, [role, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get default credentials for the current role
    const credentials = DEFAULT_CREDENTIALS[role as keyof typeof DEFAULT_CREDENTIALS];

    // Artificial delay for realism
    setTimeout(() => {
      if (email === credentials.email && password === credentials.password) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', role || '');

        toast.success(`Welcome back, ${role ? role.charAt(0).toUpperCase() + role.slice(1) : ''}!`);

        if (role === 'admin') {
          navigate("/admin");
        } else if (role === 'parent') {
          navigate("/parent");
        } else if (role === 'driver') {
          navigate("/driver");
        }
      } else {
        toast.error("Invalid email or password. Please use the demo credentials.");
      }
      setIsLoading(false);
    }, 1000);
  };

  const autofill = () => {
    const creds = DEFAULT_CREDENTIALS[role as keyof typeof DEFAULT_CREDENTIALS];
    if (creds) {
      setEmail(creds.email);
      setPassword(creds.password);
      toast.info("Credentials filled!");
    }
  };

  const formattedRole = role ? role.charAt(0).toUpperCase() + role.slice(1) : "";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 gap-2"
        onClick={() => navigate("/")}
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Role Selection
      </Button>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative animate-fade-in shadow-2xl border-primary/10">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg relative group">
              <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bus className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight">{formattedRole} Portal</CardTitle>
            <CardDescription className="text-base text-muted-foreground">Sign in to access your dashboard</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={`yourname@${role || 'example'}.com`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 bg-muted/50 focus:bg-background transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" name="password" className="text-sm font-medium flex items-center gap-2">
                <Key className="w-4 h-4" /> Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 pr-10 bg-muted/50 focus:bg-background transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 rounded-md transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="rounded border-input text-primary focus:ring-primary h-4 w-4" />
                <span className="text-muted-foreground group-hover:text-foreground transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-primary font-medium hover:underline">
                Forgot password?
              </button>
            </div>
            <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </div>
              ) : "Sign In"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t py-4 text-xs text-muted-foreground">
          © 2024 BusTrack Analytics. All rights reserved.
        </CardFooter>
      </Card>
    </div>
  );
}
