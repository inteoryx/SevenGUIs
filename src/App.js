import './App.css';
import Counter from './components/Counter';
import TemperatureConverter from './components/TemperatureConverter';
import Booker from './components/Booker';

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
        <Timer />
      </div>
      <div className="gui"></div>
      <div className="gui"></div>
      <div className="gui"></div>
      <div></div>
    </div>
  );
}

export default App;
