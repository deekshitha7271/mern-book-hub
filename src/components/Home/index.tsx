import Header from "../Header";
// import Topratedbooks from "../Topratedbooks";
import Contact from "../Contact";
import { Link } from "react-router";
import './index.css';

const Home = (): React.ReactElement => {
  return (
    <div className="bg-cont">
      <Header />
      <div className="home-cont">
        <div className="des">
          <h1 className="head">Find Your Next Favorite Books</h1>
          <p className="paragraph">
            You are in the right place. Tell us what titles or genres you’ve
            enjoyed in the past, and we’ll surprise you with brilliant
            recommendations from across the literary universe.
          </p>
          <Link to="/bookshelves">
            <button className="find-a">Find Books</button>
          </Link>
        </div>
        {/* <Topratedbooks /> */}
        <Contact />
      </div>
    </div>
  );
};

export default Home;
