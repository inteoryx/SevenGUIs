import './App.css';
import Counter from './components/Counter';
import TemperatureConverter from './components/TemperatureConverter';
import Booker from './components/Booker';
import Timer from './components/Timer';
import Crud from './components/Crud';

function App() {
  return (
    <div className="App">
      <div></div>
      <div className="gui">
        <Counter />
      </div>
      <div className="gui">
        <TemperatureConverter />
      </div>
      <div className="gui">
        <Booker />
      </div>
      <div className="gui">
        <div className="exposition" />
        <Timer />
        <div className="exposition">I know the "stop" behavior is not defined.  I just thought it would improve the timer.</div>
      </div>
      <div className="gui">
        <Crud />
      </div>
      <div className="gui"></div>
      <div className="gui"></div>
      <div></div>
    </div>
  );
}

export default App;
