import {Link} from 'react-router-dom';


const Home = () => {
  return (
    <div className="home">
      <h1>Units</h1>
      <div className="maxwrapper">
        <div className="select-country max-wrapper">
          <Link to="/ua" className="flag flag-ua"></Link> 
          <Link to="/ru" className="flag flag-ru"></Link>
        </div>
      </div>
    </div>
  )
};

export default Home;