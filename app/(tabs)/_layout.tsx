import { Tabs } from "expo-router";
import Colors from "../../constants/Colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "black",
        tabBarLabelStyle: {
          fontFamily: "Roboto-Medium",
          fontSize: 18,
          paddingBottom: 15,
        },
        tabBarActiveBackgroundColor: Colors.grey,
        tabBarIcon: () => null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Overview",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: "History & Stats",
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
