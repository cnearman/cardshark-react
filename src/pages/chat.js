import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";
import { useEffect, useContext } from "react";
import { useParams } from "react-router";
import { GameStateContext } from "../providers/gameStatusProvider";

const ChatPage = () => {
  const { user, error, isAuthenticated, isLoading } = useAuth0();
  const { session_id } = useParams();
  const gameStateContext = useContext(GameStateContext);

  useEffect(() => {
    gameStateContext.joinSession(session_id, user.name);
  }, []);

  if (error) {
    console.error(error.message);
    return <div>An error has occurred.</div>
  }

  if (!isAuthenticated) {
    return <div>Unauthenticated</div>
  }

  if (!gameStateContext.gameState) {
    return <div>Loading...</div>
  }

  return (
    (
      <div>
        {
            gameStateContext.gameState.players.map((player) =>{
                <div>{player.name}</div>
            })
        }
      </div>
    )
  );
};

export default withAuthenticationRequired(ChatPage);