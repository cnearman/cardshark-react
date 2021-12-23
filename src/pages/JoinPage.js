import { useContext } from "react";
import { GameStateContext } from "../providers/gameStatusProvider";

const JoinPage = (props) => {
    const socketProvider = useContext(GameStateContext);

    return (
      <div className="wrapper">
        <h1>Join</h1>
        <button onClick={() => socketProvider.newSession()}>New Session</button>
      </div>
    );
}

export default JoinPage;