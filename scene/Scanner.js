import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Vibration,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { getStatusBarHeight } from "react-native-status-bar-height";

export default function Scanner({ token, setToken }) {
  console.log(token);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    Vibration.vibrate();
    setScanned(true);
    fetch("https://qr-server-191.herokuapp.com/scanPerson", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        qr: data,
        token: token,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) {
          alert("success");
        } else {
          alert(result.message);
        }
      });
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const handleOnClickBack = async () => {
    try {
      await AsyncStorage.setItem("token", "");
      setToken("");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.title}>Scanner</Text>
        <TouchableOpacity onPress={handleOnClickBack}>
          <MaterialIcons
            style={styles.icon}
            name="exit-to-app"
            size={26}
            color="white"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.camarea}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    display: "flex",
  },
  topBar: {
    backgroundColor: "#bf6c0d",
    marginTop: getStatusBarHeight(),
    height: 70,
    width: "100%",

    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    flex: 1,
    fontSize: 30,
    fontWeight: "bold",
  },
  icon: {},
  camarea: {
    position: "relative",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
