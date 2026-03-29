
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import UnitsPage from './pages/UnitsPage';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} ></Route>
      <Route path="ua" element={<UnitsPage who="ua" />} />
      <Route path="ru" element={<UnitsPage who="ru" />} />
      <Route path="/*" element={<Navigate to="/" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default App;