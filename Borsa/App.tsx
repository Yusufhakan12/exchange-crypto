import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './screens/Home';
import Detail from './screens/Detail';
import { io } from 'socket.io-client';
const Stack = createNativeStackNavigator();
 export const socket=io('http://10.100.100.232:3000');
socket.on('connect',()=>{
  console.log('connected');
});
const App = () => {
  return (
    
    <NavigationContainer  >
      <Stack.Navigator screenOptions={{headerTitleStyle:{fontFamily:'TiltWarp-Regular',fontSize:25}  }}>     
        <Stack.Screen name="Crypto" component={Home}  />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>

  );
};

const styles=StyleSheet.create({

divider:{
  height:StyleSheet.hairlineWidth,
  backgroundColor:'#A9ABB1',
  marginHorizontal:16,
  marginTop:16

},
});

export default App;