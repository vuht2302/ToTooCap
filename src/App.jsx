import React from "react";
import MainRoute from "./routes/MainRoute";
import { UserProvider } from "./context/UserContext"; 
function App() {
  return (
    <UserProvider>
      <MainRoute />
    </UserProvider>
    //
  );
}

export default App;
