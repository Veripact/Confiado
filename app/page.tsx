"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePrivyAuth } from "@/contexts/PrivyContext";
import { Button } from "@/components/ui/button";
import { Plus, BarChart3 } from "lucide-react";

export default function HomePage() {
  const { isLoggedIn, isLoading, login, user, account } = usePrivyAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && !isLoading) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const ConfiladoLogo = () => (
    <div className="flex items-center space-x-3">
      <div className="relative w-10 h-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer circle with nodes */}
          <circle cx="50" cy="50" r="35" fill="none" stroke="#1e40af" strokeWidth="3"/>
          <circle cx="50" cy="15" r="4" fill="#84cc16"/>
          <circle cx="75" cy="30" r="4" fill="#1e40af"/>
          <circle cx="85" cy="50" r="4" fill="#84cc16"/>
          <circle cx="75" cy="70" r="4" fill="#1e40af"/>
          <circle cx="50" cy="85" r="4" fill="#84cc16"/>
          <circle cx="25" cy="70" r="4" fill="#1e40af"/>
          <circle cx="15" cy="50" r="4" fill="#84cc16"/>
          <circle cx="25" cy="30" r="4" fill="#1e40af"/>
          
          {/* Inner circle with nodes */}
          <circle cx="50" cy="50" r="20" fill="none" stroke="#1e40af" strokeWidth="2"/>
          <circle cx="50" cy="30" r="2" fill="#1e40af"/>
          <circle cx="65" cy="45" r="2" fill="#1e40af"/>
          <circle cx="65" cy="55" r="2" fill="#1e40af"/>
          <circle cx="50" cy="70" r="2" fill="#1e40af"/>
          <circle cx="35" cy="55" r="2" fill="#1e40af"/>
          <circle cx="35" cy="45" r="2" fill="#1e40af"/>
          
          {/* Center node */}
          <circle cx="50" cy="50" r="3" fill="#84cc16"/>
        </svg>
      </div>
      <span className="text-2xl font-bold text-primary">CONFIADO</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <ConfiladoLogo />
            
            {/* Navigation for authenticated users */}
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => router.push("/dashboard")}
                  variant="ghost"
                  className="text-sm"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  onClick={() => router.push("/debt/create")}
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Debt
                </Button>
              </div>
            ) : (
              <Button 
                onClick={login}
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Connecting..." : "Register"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-foreground mb-6 leading-tight">
            Manage & Track Debts,
            <br />
            <span className="text-primary">With One Click.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Track your debts and credits securely on blockchain. 
            Fast, transparent and decentralized debt management.
          </p>

          {!isLoggedIn && (
            <Button
              onClick={login}
              size="lg"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? "Connecting..." : "Register"}
            </Button>
          )}

          {/* Authenticated State Actions */}
          {isLoggedIn && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => router.push("/dashboard")}
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg rounded-full"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                View Dashboard
              </Button>
              <Button
                onClick={() => router.push("/debt/create")}
                size="lg"
                className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg rounded-full"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Debt
              </Button>
            </div>
          )}

          {/* User Info for authenticated users */}
          {isLoggedIn && user && (
            <div className="mt-8 p-4 bg-muted/50 rounded-lg inline-block">
              <p className="text-sm text-muted-foreground">
                Welcome back, <span className="font-medium text-foreground">{user.name || "User"}</span>
              </p>
              {account && (
                <p className="text-xs text-muted-foreground mt-1">
                  Connected: {account.slice(0, 6)}...{account.slice(-4)}
                </p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Secure & Transparent</h3>
            <p className="text-muted-foreground text-sm">
              Your data is protected by blockchain technology with full transparency.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Tracking</h3>
            <p className="text-muted-foreground text-sm">
              Monitor your debts and payments with intuitive dashboards and real-time KPIs.
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Collaborative</h3>
            <p className="text-muted-foreground text-sm">
              Share and manage debts with others securely and verifiably.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-muted-foreground text-sm">
            <p>&copy; 2024 Confiado. Decentralized debt management powered by Lisk.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
