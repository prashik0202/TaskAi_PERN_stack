import { createContext, useContext, useReducer } from "react";
import { type Project, type Task } from "@/types/types";

interface PlatformContextIntf {
  project: Project[];
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

type ACTION =
  | { type: "SET_PROJECTS"; payload: Project[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "ADD_PROJECT"; payload: Project }
  | { type: "SET_TASKS"; payload: Task[] }
  | { type: "ADD_TASK"; payload: Task }
  | { type: "UPDATE_TASK"; payload : Task }

const initialState: PlatformContextIntf = {
  project: [],
  tasks: [],
  loading: false,
  error: null,
};

export const PlatFormContext = createContext<{
  state: PlatformContextIntf;
  dispatch: React.Dispatch<ACTION>;
}>({
  state: initialState,
  dispatch: () => undefined,
});

const reducer = (
  state: PlatformContextIntf,
  action: ACTION
): PlatformContextIntf => {
  switch (action.type) {
    case "SET_PROJECTS":
      return {
        ...state,
        project: action.payload,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "ADD_PROJECT":
      return {
        ...state,
        project: [...state.project, action.payload],
      };
    case "ADD_TASK":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
    case "SET_TASKS":
      return {
        ...state,
        tasks: action.payload,
      };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks : state.tasks.map((task) => (
          task.id === action.payload.id ? action.payload : task
        ))
      }
  }
};

export const PlatformContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <PlatFormContext.Provider value={{ dispatch, state }}>
      {children}
    </PlatFormContext.Provider>
  );
};

export function usePlatform() {
  const context = useContext(PlatFormContext);
  if (!context) {
    throw new Error(
      "usePlatform must be used within a PlatformContextProvider"
    );
  }
  return context;
}
