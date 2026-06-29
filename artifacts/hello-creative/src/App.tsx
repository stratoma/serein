import { Router, Route, Switch } from "wouter";
import Nav from "./components/nav";
import Footer from "./components/footer";
import Home from "./pages/home";
import About from "./pages/about";
import Studio from "./pages/studio";
import WorkWithUs from "./pages/work-with-us";
import Journal from "./pages/journal";
import Contact from "./pages/contact";

const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <Router base={base}>
      <Nav />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/about" component={About} />
        <Route path="/studio" component={Studio} />
        <Route path="/work-with-us" component={WorkWithUs} />
        <Route path="/journal" component={Journal} />
        <Route path="/contact" component={Contact} />
        <Route>
          <Home />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}
