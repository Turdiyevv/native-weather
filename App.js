import { StatusBar } from 'expo-status-bar';
import {Alert, StyleSheet, Text, View} from 'react-native';
import Loader from "./components/loader";
import {useEffect, useState} from "react";
import Weather from "./components/weather";
import * as Location from 'expo-location';
import axios from "axios";

// https://api.openweathermap.org/data/2.8/onecall?lat=41.1896946&lon=69.1377997&exclude=minutely,alerts&appid=9dd86907fe501cec50da3d087e4e9dc0&units=metric&lang=uz

const API_KEY = '9dd86907fe501cec50da3d087e4e9dc0&units=metric&lang=uz';
export default function App() {
      const [isLoading, setIsLoading] = useState(true);
      const [location, setLocation] = useState(null);

      const getWeather = async (latitude, longitude) => {
            const {data} = await axios.get(
                `https://api.openweathermap.org/data/2.8/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,
                        alerts&appid=${API_KEY}`
            );
            setLocation(data);
            setIsLoading(false);
      }

      const getLocation = async () => {
            try {
                  const {status} = await Location.requestForegroundPermissionsAsync();
                  if(status !== 'granted'){
                        Alert.alert('Permission to access location was denied');
                        return;
                  }

                  const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({});

                  getWeather(latitude, longitude);
            }catch (error){
                  Alert.alert("I can't find your current location, so bad :(")
            }
      }

      useEffect(()=>{
            getLocation();
      },[])

      return isLoading ? (<Loader/>) : (
          <Weather
              location = {location.current.temp}
              // temp={Math.round(location.main.temp)}
              // name={location.name}
              // condition={location.weather[0].main}
          />
      );
  // return (
    // <View style={styles.container}>
    //   <View style={styles.box1}></View>
    //   <View style={styles.box2}></View>
    //   <View style={styles.box3}></View>
    // </View>
  // );
}

const styles = StyleSheet.create({
  // container:{
  //   flex:1,
  // },
  // box1: {
  //     flex: 2,
  //     backgroundColor: 'yellow'
  // },
  // box2:{
  //     flex:2,
  //     backgroundColor: 'green'
  // },
  // box3:{
  //     flex:2,
  //     backgroundColor: 'red'
  // }
});
