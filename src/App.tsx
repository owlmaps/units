
import { Routes, Route } from 'react-router-dom';
import Home from './Home';
import UnitsPage from './UnitsPage';

const App = () => {
  return (
  <Routes>
    <Route path="/" element={<Home />} ></Route>
    <Route path="ua" element={<UnitsPage who="ua"/>} />
    <Route path="ru" element={<UnitsPage who="ru"/>} />
  </Routes>
  );
};

export default App;