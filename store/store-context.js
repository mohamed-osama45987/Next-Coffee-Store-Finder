import { createContext, useReducer } from "react";

export const ACTION_TYPES = {
  //will be used in our reducer function
  SET_LAT_LONG: "SET_LAT_LONG",
  SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const storeReducer = (state, action) => {
  //this is our reducer function
  switch (action.type) {
    case ACTION_TYPES.SET_LAT_LONG: {
      return { ...state, latLong: action.payload.latLong };
    }
    case ACTION_TYPES.SET_COFFEE_STORES: {
      return {
        ...state,
        nearByCoffeeStores: action.payload.nearByCoffeeStores,
      };
    }
    default:
      throw new Error(`Unhandeled action type ${action.type}`);
  }
};

const StoreContext = createContext();

const StoreProvider = ({ children }) => {
  const initailState = {
    latLong: "",
    nearByCoffeeStores: [],
  };

  const [state, dispatch] = useReducer(storeReducer, initailState);
  //we wired the reducer function with our intial stat

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export { StoreProvider, StoreContext };
