import React, {useState, useEffect, useRef} from "react";
import {Text, View, Pressable, StyleSheet, Image} from "react-native";
import {Crypto} from "../models/crypto";
import {FlatList} from "react-native";
import {socket} from "../App";
import {Colors} from "react-native/Libraries/NewAppScreen";
//navigation uyarısını silmek için any yazdık

const Home = ({navigation}: {navigation: any}) => {
  const [cryptoList, setCrypto] = useState();
  const ref = useRef<Crypto[]>();

  useEffect(() => {
    socket.on("crypto", data => {
      setCrypto(data);
    });
  }, []);

  useEffect(() => {
    ref.current = cryptoList;
  }, [cryptoList]);

  const navigate = (id: string) => {
    navigation.navigate("Detail", {id: id});
  };

  const renderItem = ({item}: {item: Crypto}) => {
    const oldDataArray = ref.current;
    const oldData: Crypto | undefined = oldDataArray?.find(
      it => it.id === item.id,
    );

    let diff: number = 0;
    if (oldData) {
      diff = Math.round((((item.price - oldData.price)*100)/item.price)*100)/10 ;
    }

    let color = "gray";
    if (diff > 0) {
      color = "green";
      
    }else if (diff<0){
        color="red";
    }

    return (
      <Pressable onPress={() => navigate(item.id)} style={styles.buttonStyle}>
        <Text style={styles.textStyle}>{item.name}</Text>
        <Text style={styles.rightText}>
          ${Math.round(item.price * 100) / 100}
        </Text>
        <Text style=
        {{color:color,
            marginLeft:0,
            paddingBottom:0,
            paddingTop:24,
        }}>
            
         %{diff}</Text>
      </Pressable>
    );
  };

  return (
    <View style={{backgroundColor: "gray"}}>
      <FlatList
        data={cryptoList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    backgroundColor: "black",
    margin: 2,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 7,
  },
  textStyle: {
    fontSize: 18,
    marginBottom: 5,
    fontFamily: "TiltWarp-Regular",
    color: "white",
  },
  
  rightText: {
    right: 6,
    top: 8.33,
    color:'white',
    position:'absolute',
    fontSize:16
  },
});

export default Home;
