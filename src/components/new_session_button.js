import { useContext } from "react";
import { GameStateContext } from "../providers/gameStatusProvider";

const NewSessionButton = (props) => {
  const gameStateProvider = useContext(GameStateContext);
    
  return (
    <div>
        <button onClick={() => gameStateProvider.newSession()}>New Session</button>;
    </div>
  );
}

export default NewSessionButton;