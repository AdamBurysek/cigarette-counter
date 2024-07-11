import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Link, SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, Pressable } from "react-native";
import * as SecureStore from "expo-secure-store";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-expo";
import Colors from "../constants/Colors";
import { useColorScheme } from "react-native";
import { View } from "react-native";

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

const tokenCache = {
  async getToken(key: string) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
    >
      <RootLayoutNav />
    </ClerkProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    if (!isLoaded && !isSignedIn) {
      router.push("/(modals)/introScreen");
    }

    if (!isSignedIn && isLoaded) {
      router.push("/(modals)/login");
    }
    if (isSignedIn) {
      router.push("/(tabs)");
    }
  }, [isSignedIn]);

  const isDarkMode = useColorScheme() === "dark";

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: "white" },
        headerTintColor: "white",
      }}
    >
      <Stack.Screen
        name="(modals)/introScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          title: "",
          headerTitleStyle: {
            fontFamily: "Roboto-Bold",
            fontSize: 20,
          },
          headerTransparent: true,
          headerStyle: {
            backgroundColor: isDarkMode ? Colors.grey : undefined,
          },
          headerLeft: () => <View></View>,
          headerRight: () => (
            <Link href="/(modals)/profile" asChild>
              <Pressable style={{ marginBottom: 5 }}>
                <Image
                  source={{ uri: user?.imageUrl }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    borderWidth: 1,
                    marginEnd: 14,
                    borderColor: "grey",
                  }}
                ></Image>
              </Pressable>
            </Link>
          ),
        }}
      />
      <Stack.Screen name="(modals)/profile" options={{}} />
      <Stack.Screen name="(modals)/login" options={{ headerShown: false }} />
    </Stack>
  );
}
