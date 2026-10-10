import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import Footer from "./components/Footer";
import Header from "./components/Header";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import AssetMetricsPage from "./pages/AssetMetricsPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import ShareholdersPage from "./pages/ShareholdersPage";
import YearlySavingsPage from "./pages/YearlySavingsPage";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const shareholdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/shareholders",
  component: ShareholdersPage,
});

const assetMetricsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/asset-metrics",
  component: AssetMetricsPage,
});

const yearlySavingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/yearly-savings",
  component: YearlySavingsPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/contact",
  component: ContactPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  shareholdersRoute,
  assetMetricsRoute,
  yearlySavingsRoute,
  contactRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
