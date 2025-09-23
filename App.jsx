import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Appnavigator from "./navigation/Appnavigator";
import BootSplash from "react-native-bootsplash";
import { UserProvider } from "./Context/userContext";
import Toast from "react-native-toast-message";
import ToastConfig from "./components/ToastConfig";

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
      <Toast config={ToastConfig}/>
      </UserProvider>
    </NavigationContainer>
  );
}

export default App;
