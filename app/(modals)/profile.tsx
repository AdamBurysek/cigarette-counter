import {
  View,
  Text,
  Button,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Link, useNavigation, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { defaultStyles } from "../../constants/Styles";
import Colors from "../../constants/Colors";
import {
  GestureHandlerRootView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";

const Page = () => {
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.emailAddresses[0].emailAddress);
  const [edit, setEdit] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    if (!user) return;

    setFirstName(user.firstName);
    setLastName(user.lastName);
    setEmail(user.emailAddresses[0].emailAddress);
  }, [user]);

  const onSaveUser = async () => {
    try {
      if (!firstName || !lastName) return;
      await user?.update({ firstName, lastName });
    } catch (err) {
      console.error(err);
    } finally {
      setEdit(false);
    }
  };

  const onCaptureImage = async () => {
    const restult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
      base64: true,
    });
    if (!restult.canceled) {
      const base64 = `data:image/png;base64,${restult.assets[0].base64}`;
      user?.setProfileImage({
        file: base64,
      });
    }
  };

  const logOut = () => {
    router.back();
    router.push("/(modals)/login");
    signOut();
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerTransparent: true,
      headerLeft: () => (
        <GestureHandlerRootView>
          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={24} color={"white"} />
          </TouchableOpacity>
        </GestureHandlerRootView>
      ),
    });
  }, []);

  return (
    <SafeAreaView style={defaultStyles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Profile</Text>
      </View>

      {user && (
        <View style={styles.card}>
          {/* <GestureHandlerRootView>
            <TouchableOpacity onPress={onCaptureImage}>
              <Image
                source={{ uri: user?.imageUrl }}
                style={styles.avatar}
              ></Image>
            </TouchableOpacity>
          </GestureHandlerRootView> */}
          <View style={{ flexDirection: "row", gap: 6 }}>
            {edit ? (
              <View style={styles.editRow}>
                <TextInput
                  placeholder="First name"
                  value={firstName || ""}
                  onChangeText={setFirstName}
                  style={[defaultStyles.inputField, { width: 100 }]}
                ></TextInput>
                <TextInput
                  placeholder="Last name"
                  value={lastName || ""}
                  onChangeText={setLastName}
                  style={[defaultStyles.inputField, { width: 100 }]}
                ></TextInput>
                <GestureHandlerRootView>
                  <TouchableOpacity onPress={onSaveUser}>
                    <Ionicons
                      name="checkmark-outline"
                      size={24}
                      color={Colors.darks}
                    ></Ionicons>
                  </TouchableOpacity>
                </GestureHandlerRootView>
              </View>
            ) : (
              <View style={styles.editRow}>
                <Text style={{ fontFamily: "Roboto-Bold", fontSize: 22 }}>
                  {firstName} {lastName}
                </Text>
                <GestureHandlerRootView>
                  <TouchableOpacity onPress={() => setEdit(true)}>
                    <Ionicons
                      name="create-outline"
                      size={24}
                      color={Colors.darks}
                    ></Ionicons>
                  </TouchableOpacity>
                </GestureHandlerRootView>
              </View>
            )}
          </View>
          <Text>{email}</Text>
          <Text>Since {user?.createdAt?.toLocaleDateString()}</Text>
        </View>
      )}

      {isSignedIn && (
        <Button title="Log Out" onPress={logOut} color={Colors.darks}></Button>
      )}

      {!isSignedIn && (
        <Link href={"/(modals)/login"} asChild>
          <Button title="Log In" color={Colors.darks} />
        </Link>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: 10,
  },
  header: {
    fontFamily: "Roboto-Bold",
    fontSize: 24,
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    marginHorizontal: 24,
    marginTop: 24,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: {
      width: 1,
      height: 2,
    },
    alignItems: "center",
    gap: 14,
    marginBottom: 24,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.grey,
  },
  editRow: {
    height: 60,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Page;
