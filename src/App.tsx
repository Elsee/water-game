import {Route, Router, Switch} from 'wouter';
import {useHashLocation} from 'wouter/use-hash-location';
import {HomePage} from "./pages/home";
import {GamePage} from "./pages/game";
import {CounterPage} from "./pages/counter";
import {WaterGamePage} from "./pages/WaterGamePage";
import "@platform-ui/themes/tui-themes.css";
import "./App.css";
import {NotFoundPage} from "./pages/404";

function App() {
  return (
    <Router hook={useHashLocation}>
      <div data-tui-theme="dark">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/game" component={GamePage} />
          <Route path="/counter" component={CounterPage} />
          <Route path="/water-game" component={WaterGamePage} />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
