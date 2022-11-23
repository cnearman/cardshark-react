import { useContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginPage = (props) => {
    const { loginWithRedirect } = useAuth0();

    return (
      <div className="wrapper">
        <h1>Login</h1>
        <button onClick={() => loginWithRedirect()}>Login</button>
      </div>
    );
}

export default LoginPage;