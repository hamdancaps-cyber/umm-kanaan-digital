/** Root composition for the منصة أم كنعان الرقمية web application. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import AcademyPage from "./pages/AcademyPage";
import AboutPage from "./pages/AboutPage";
import CoursePage from "./pages/CoursePage";
import FreeResourcesPage from "./pages/FreeResourcesPage";
import AccountPage from "./pages/AccountPage";
import AdminPage from "./pages/AdminPage";
import BlogPage from "./pages/BlogPage";
import ErrorBoundary from "./components/ErrorBoundary";
import EcommercePage from "./pages/EcommercePage";
import MarketingPage from "./pages/MarketingPage";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import HowItWorksPage from "./pages/HowItWorksPage";
import LegalPage from "./pages/LegalPage";
import PathsPage from "./pages/PathsPage";
import ProductPage from "./pages/ProductPage";
import ProjectsPage from "./pages/ProjectsPage";
import ShopPage from "./pages/ShopPage";
import StartPage from "./pages/StartPage";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/start"} component={StartPage} />
      <Route path={"/how-it-works"} component={HowItWorksPage} />
      <Route path={"/marketing"} component={MarketingPage} />
      <Route path={"/ecommerce"} component={EcommercePage} />
      <Route path={"/about"} component={AboutPage} />
      <Route path={"/paths"} component={PathsPage} />
      <Route path={"/academy"} component={AcademyPage} />
      <Route path={"/academy/:slug"} component={CoursePage} />
      <Route path={"/account"} component={AccountPage} />
      <Route path={"/admin"} component={AdminPage} />
      <Route path={"/shop/:handle"} component={ProductPage} />
      <Route path={"/shop"} component={ShopPage} />
      <Route path={"/opportunities"} component={HowItWorksPage} />
      <Route path={"/projects"} component={ProjectsPage} />
      <Route path={"/free"} component={FreeResourcesPage} />
      <Route path={"/blog"} component={BlogPage} />
      <Route path={"/privacy"} component={LegalPage} />
      <Route path={"/terms"} component={LegalPage} />
      <Route path={"/refund"} component={LegalPage} />
      <Route path={"/disclaimer"} component={LegalPage} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
