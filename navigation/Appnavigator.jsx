import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import TicketsPage from '../screens/TicketsPage'

function Appnavigator() {
    const Stack = createNativeStackNavigator()
    return (
        <>
            <Stack.Navigator>
                <Stack.Screen name="Tickets" component={TicketsPage}/>
            </Stack.Navigator> 
        </>
    )
}

export default Appnavigator
