import { StyleSheet, Text, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History & Stats</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: "red",
    borderStyle: "solid",
    marginTop: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
