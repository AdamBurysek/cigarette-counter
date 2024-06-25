import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import { useWarmUpBrowser } from "../hooks/useWarmUpBrowser";
import { defaultStyles } from "../../constants/Styles";

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import Colors from "../../constants/Colors";

enum Strategy {
  Google = "oauth_google",
}

const Page = () => {
  useWarmUpBrowser();

  const router = useRouter();

  const { startOAuthFlow: googleAuth } = useOAuth({ strategy: "oauth_google" });

  const onSelectAuth = async (strategy: Strategy) => {
    const selectedAuth = {
      [Strategy.Google]: googleAuth,
    }[strategy];

    try {
      const { createdSessionId, setActive } = await selectedAuth();
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.back();
      }
    } catch (err) {
      console.error(err);
    }
  };

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
