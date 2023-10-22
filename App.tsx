import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Button, Alert } from 'react-native';

import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// import axios from 'axios';
import FormData from 'form-data';
import { PROVIDER_GOOGLE } from 'react-native-maps';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

const Stack = createStackNavigator();


export default function App() {
 const [position, setPosition] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
 });
 
 const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)


 const pushRideRequest = async () => {

  const rideFormData = new FormData();
  rideFormData.append('long', position.longitude);
  rideFormData.append('lat', position.latitude);

  try{

    Alert.alert(
      "Ride request sent",
      "Your ride request has been sent.",
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );

  } catch(error){
    console.log(error)
  }
}

const onRegionChange = (region: { latitude: any; longitude: any; latitudeDelta: any; longitudeDelta: any; }) => {
  setPosition({
    latitude: region.latitude,
    longitude: region.longitude,
    latitudeDelta: region.latitudeDelta,
    longitudeDelta: region.longitudeDelta,
  })
}

useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setPosition({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  })();
}, []);

return (
  <View style={styles.container}>
    <MapView 
      style={styles.map}
      region={position}
      onRegionChangeComplete={onRegionChange}>
        <Marker 
          coordinate={{
            latitude: position.latitude, 
            longitude: position.longitude
          }} 
          tracksViewChanges={true}>
          </Marker>
    </MapView>
    <View style={styles.pickupButton}>
      <Button title="Request pickup" onPress={pushRideRequest}/>
    </View>
    <StatusBar style="auto" />
  </View>
);


}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},
map: {
  width: '100%',
  height: '100%',
},
pickupButton:{
  position: 'absolute',
  top: '90%', 
  alignSelf: 'center', 
  width: '80%'
}


});



