import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import NewSessionButton from "../components/new_session_button";

const IndexPage = () => {
  const { user, error, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (error) {
    console.error(error.message);
    return <div>An error has occurred.</div>
  }

  return (
    isAuthenticated && (
      <div>
        <h2>Hello, {user.name}!</h2>
        <NewSessionButton />
      </div>
    )
  );
};

export default withAuthenticationRequired(IndexPage);