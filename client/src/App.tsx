import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";

import { EnergyBackground } from "@/components/EnergyBackground";

import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="relative min-h-screen text-foreground overflow-x-hidden">
          <EnergyBackground />
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/projects" component={Projects} />
            <Route component={NotFound} />
          </Switch>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
