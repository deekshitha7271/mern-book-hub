import Header from "../Header";
import Contact from "../Contact";
import { Link } from "react-router";
import './index.css';

const Home = (): React.ReactElement => {
  return (
    <div className="bg-cont">
      <Header />
      <div className="home-cont">
        <div className="des des-content">
          <h1 className="head premium-text">Find Your Next Favorite Books</h1>
          <p className="paragraph premium-p">
            You are in the right place. Tell us what titles or genres you’ve
            enjoyed in the past, and we’ll surprise you with brilliant
            recommendations from across the literary universe.
          </p>
          <Link to="/bookshelves" className="cta-link">
            <button className="find-a premium-button">Discover Books</button>
          </Link>
        </div>
        <Contact />
      </div>
    </div>
  );
};

export default Home;
