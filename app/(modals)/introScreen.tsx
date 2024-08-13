import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

const Page = () => {
  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name="cigar" size={180}></MaterialCommunityIcons>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 26,
    marginBottom: 250,
  },
  loadingText: {
    fontFamily: "Roboto-Medium",
    fontSize: 14,
    color: Colors.grey,
    paddingTop: 20,
  },
});

export default Page;
