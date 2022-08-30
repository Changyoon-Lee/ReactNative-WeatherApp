import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

const windowWidth = Dimensions.get('window').width;
const weatherName = {
  "clear sky": "weather-sunny",
  "few clouds": "weather-partly-cloudy",
  "overcast clouds": "weather-cloudy",
  "drizzle": "weather-partly-rainy",
  "rain": "weather-rainy",
  "shower rain": "weather-pouring",
  "thunderstorm": "weather-lightning",
  "snow": "weather-snowy",
  "mist": "weather-fog"
}
export default function App() {
  const [weathers, setWeathers] = useState([]);
  const [city, setCity] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const APIKEY = "409e8c18a45b452d7f7c87669236940c";

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
      const geoInfo = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
      setCity(geoInfo[0]["city"]);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${APIKEY}`);
      const json = await response.json();
      setWeathers(json.list);
    })();
  }, []);
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  }
  return (

    <View style={styles.container}>
      <View style={styles.container_1}>
        <Text style={styles.location}>{city !== "" ? city : text}</Text>
      </View>
      <ScrollView pagingEnabled horizontal contentContainerStyle={styles.container_2}>
        {weathers.length === 0 ? (
          <View style={{ ...styles.weatherEach, alignItems: "center" }}>
            <ActivityIndicator color="white" size="large" />
          </View>
        ) : (
          weathers.map((weather, index) => (
            <View key={index} style={styles.weatherEach}>
              <View style={{ width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={styles.temperature}>{weather.main.temp.toFixed(1)}</Text>
                <MaterialCommunityIcons style={{ marginTop: 0 }} name={weatherName[weather.weather[0].description]} size={60} color="white" />
              </View>
              <Text style={styles.dt}>{weather.dt_txt.slice(5, -3)}</Text>
              <Text style={styles.weather}>{weather.weather[0].description}</Text>
            </View>

          ))
        )}
      </ScrollView>
      <StatusBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  container_1: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1
  },
  container_2: {

  },
  weatherEach: {
    width: windowWidth,
    alignItems: "flex-start",
    paddingHorizontal: 30,
  },
  location: {
    fontWeight: "600",
    color: 'white',
    fontSize: 50
  },
  temperature: {
    fontWeight: "700",
    color: 'white',
    fontSize: 100
  },
  dt: {
    color: 'white',
    fontWeight: "700",
    fontSize: 20
  },
  weather: {
    color: 'white',
    fontWeight: "600",
    fontSize: 30
  }
});
