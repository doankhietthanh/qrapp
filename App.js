import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Login from "./scene/Login";
import Scanner from "./scene/Scanner";

export default function App() {
  const [token, setToken] = useState("");

  useEffect(() => {
    const run = async () => {
      try {
        const value = await AsyncStorage.getItem("token");
        if (value !== null && value !== "") {
          setToken(value);
        }
      } catch (error) {}
    };
    run();
  }, []);

  return (
    <>
      {token == undefined || token == "" ? (
        <Login setToken={setToken} />
      ) : (
        <Scanner token={token} setToken={setToken} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
