import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import Appnavigator from './navigation/Appnavigator'
import BootSplash from "react-native-bootsplash";
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

function App() {
   useEffect(() => {
      const init = async () => {
      };
  
      init().finally(async () => {
        await BootSplash.hide({ fade: true });
        console.log("BootSplash has been hidden successfully");
      });
    }, []);
  return (
    <>
    
    <NavigationContainer>
    < Appnavigator/>
    </NavigationContainer>
    </>
  )
}


export default App
