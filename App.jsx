import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Appnavigator from "./navigation/Appnavigator";
import BootSplash from "react-native-bootsplash";
import { UserProvider } from "./Context/userContext";

function App() {
  useEffect(() => {
    const init = async () => {};
    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("✅ BootSplash hidden successfully");
    });
  }, []);

  return (
    <NavigationContainer>
      <UserProvider>
      <Appnavigator />
      </UserProvider>
    </NavigationContainer>
  );
}

export default App;
