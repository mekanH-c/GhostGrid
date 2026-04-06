import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/layout";
import { Home } from "@/pages/home";
import { Analyze } from "@/pages/analyze";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter>
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/analyze" component={Analyze} />
            <Route>404 - Page Not Found</Route>
          </Switch>
        </Layout>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;