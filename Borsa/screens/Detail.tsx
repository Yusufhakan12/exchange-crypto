import React from 'react';
import { Text,View } from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Detail=({route}:{route:any})=>{
const  id=route.params.id;
    return (

        <Text>{id}</Text>

    );
};

export default Detail;
