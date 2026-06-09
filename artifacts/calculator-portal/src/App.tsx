import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Layout } from "@/components/layout";
import { LanguageProvider } from "@/i18n";

import Home from "@/pages/home";
import Shopping from "@/pages/shopping";
import Discount from "@/pages/discount";
import Profit from "@/pages/profit";
import Vat from "@/pages/vat";
import Hotel from "@/pages/hotel";
import Gold from "@/pages/gold";
import WordCount from "@/pages/word-count";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/shopping" component={Shopping} />
        <Route path="/discount" component={Discount} />
        <Route path="/profit" component={Profit} />
        <Route path="/vat" component={Vat} />
        <Route path="/hotel" component={Hotel} />
        <Route path="/gold" component={Gold} />
        <Route path="/word-count" component={WordCount} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Layout>
              <Router />
            </Layout>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
