import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavBar } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import Home from "@/pages/home";
import Ingredients from "@/pages/ingredients";
import ProductDetail from "@/pages/product-detail";
import MorrowTrio from "@/pages/morrow-trio";
import NotFound from "@/pages/not-found";
import Checkout from "@/pages/checkout";
import Markets from "@/pages/markets";
import { Privacy, Shipping } from "@/pages/policy";
import { CartProvider } from "@/context/cart-context";
import { AuthProvider } from "@/context/auth-context";
import { CartDrawer } from "@/components/cart-drawer";
import Auth from "@/pages/auth";
import Account from "@/pages/account";
import ManageOrders from "@/pages/manage-orders";
import AdminDashboard from "@/pages/admin-dashboard";
import ManageProducts from "@/pages/manage-products";
import ManageCustomers from "@/pages/manage-customers";
import ManageUsers from "@/pages/manage-users";
import EmailLogs from "@/pages/email-logs";
import Settings from "@/pages/settings";
import ManageMarkets from "@/pages/manage-markets";
import { AdminLayout } from "@/components/admin-layout";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const isAdmin = ['/dashboard', '/manage-products', '/manage-orders', '/manage-customers', '/manage-markets', '/manage-users', '/email-logs', '/settings'].includes(location);
  if (isAdmin) return <><ScrollToTop /><AdminLayout><Switch><Route path="/manage-orders" component={ManageOrders} /><Route path="/dashboard" component={AdminDashboard} /><Route path="/manage-products" component={ManageProducts} /><Route path="/manage-customers" component={ManageCustomers} /><Route path="/manage-markets" component={ManageMarkets} /><Route path="/manage-users" component={ManageUsers} /><Route path="/email-logs" component={EmailLogs} /><Route path="/settings" component={Settings} /></Switch></AdminLayout></>;
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <NavBar />
      <div className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/ingredients" component={Ingredients} />
          <Route path="/markets" component={Markets} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/auth" component={Auth} />
          <Route path="/account" component={Account} />
          <Route path="/manage-orders" component={ManageOrders} />
          <Route path="/dashboard" component={AdminDashboard} />
          <Route path="/manage-products" component={ManageProducts} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/shipping" component={Shipping} />
          <Route path="/collection/morrow-trio" component={MorrowTrio} />
          <Route path="/collection/:slug" component={ProductDetail} />
          <Route component={NotFound} />
        </Switch>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <CartDrawer />
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
