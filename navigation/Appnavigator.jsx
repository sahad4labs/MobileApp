import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import Loginpage from '../screens/Loginpage'
import TicketsPage from '../screens/TicketsPage'
import ProfilePage from '../screens/ProfilePage'

function Appnavigator() {
    const Stack = createNativeStackNavigator()
    return (
        <>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Loginpage} options={{ headerShown: false }}/>
                <Stack.Screen name="Ticket" component={TicketsPage} options={{ headerShown: false }}/>
                <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }}/>
            </Stack.Navigator> 
        </>
    )
}

export default Appnavigator
