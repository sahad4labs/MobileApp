import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import Appnavigator from './navigation/Appnavigator';
import BootSplash from 'react-native-bootsplash';
import { NativeEventEmitter, NativeModules } from 'react-native';

function App() {
  useEffect(() => {
    const init = async () => {
    
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log('BootSplash has been hidden successfully');
    });

    
    const eventEmitter = new NativeEventEmitter(NativeModules.ToastExample); 
   
    const subscription = eventEmitter.addListener(
      'CallRecordingSaved',
      (filePath) => {
        console.log('📂 Recording file captured at:', filePath);
      
      }
    );

    return () => subscription.remove();
  }, []);

  return (
    <NavigationContainer>
      <Appnavigator />
    </NavigationContainer>
  );
}

export default App;
