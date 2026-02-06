import { createContext } from "react";
import { defaultPlayState, type PlayState } from "../utils/types";

interface IPlayContext {
  state: PlayState;
  setPlayState: (state: PlayState) => void;
  gameReset: () => void;
}

export const PlayContext = createContext<IPlayContext>({
  state: defaultPlayState,
  setPlayState: () => {},
  gameReset: () => {},
});
