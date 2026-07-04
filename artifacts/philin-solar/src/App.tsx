import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/auth-context";
import { Layout } from "@/components/layout";

import HomePage from "@/pages/home";
import ServicesPage from "@/pages/services";
import AccreditationsPage from "@/pages/accreditations";
import ContactPage from "@/pages/contact";
import AboutPage from "@/pages/about";
import PackagesPage from "@/pages/packages";
import GalleryPage from "@/pages/gallery";
import NewsPage from "@/pages/news";
import NewsDetailPage from "@/pages/news-detail";
import AdminLoginPage from "@/pages/admin/login";
import AdminDashboard from "@/pages/admin/dashboard";
import NewsEditorPage from "@/pages/admin/news-editor";
import GalleryUploadPage from "@/pages/admin/gallery-upload";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/news/new" component={NewsEditorPage} />
      <Route path="/admin/news/edit/:id" component={NewsEditorPage} />
      <Route path="/admin/gallery/upload" component={GalleryUploadPage} />
      <Route>
        <Layout>
          <Switch>
            <Route path="/" component={HomePage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/services" component={ServicesPage} />
            <Route path="/packages" component={PackagesPage} />
            <Route path="/gallery" component={GalleryPage} />
            <Route path="/news" component={NewsPage} />
            <Route path="/news/:id" component={NewsDetailPage} />
            <Route path="/accreditations" component={AccreditationsPage} />
            <Route path="/contact" component={ContactPage} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
