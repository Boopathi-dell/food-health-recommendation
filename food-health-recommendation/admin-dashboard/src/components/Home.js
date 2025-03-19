import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Welcome to Food & Health Recommendation</h2>
      <p>Please select your role:</p>
      <div>
        <Link to="/admin/login">
          <button style={{ margin: "10px", padding: "10px 20px" }}>Admin</button>
        </Link>
        <Link to="/user/login">
          <button style={{ margin: "10px", padding: "10px 20px" }}>User</button>
        </Link>
      </div>
    </div>
  );
};

export default Home;
