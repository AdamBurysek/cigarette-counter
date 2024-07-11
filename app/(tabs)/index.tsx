import { FontAwesome } from "@expo/vector-icons";
import Colors from "../../constants/Colors";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { useUser } from "@clerk/clerk-expo";
import CigarettesDataService from "../../services/dataService";
import {
  averageSmokingFrequencyYesterday,
  countTodayTimestamps,
  countYesterdayTimestamps,
  getLastTimestamp,
  leftForToday,
  leftForTodayFrequency,
  updateTimeSinceLast,
} from "@/utils/smokingStats";

const STATUS_BAR_HEIGHT = StatusBar.currentHeight;

interface TimestampData {
  userId: string;
  timestamp: string;
}

export default function TabOneScreen() {
  const [cigarettes, setCigarettes] = useState(0);
  const [data, setData] = useState<TimestampData[]>([]);
  const [lastCigaretteTime, setLastCigaretteTime] = useState<string | null>(
    null
  );
  const [yesterdayCount, setYesterdayCount] = useState(0);
  const [yesterdayAverage, setYesterdayAverage] = useState<string | null>(null);
  const [timeSinceLast, setTimeSinceLast] = useState<string | null | undefined>(
    null
  );
  const [todayLeft, setTodayLeft] = useState(0);
  const [todayLeftAverage, settodayLeftAverage] = useState<string | null>(null);

  const dailyCigarettes = 20;

  const { user } = useUser();

  useEffect(() => {
    const getCigarettesData = () => {
      CigarettesDataService.getData(user?.id!).then((response) =>
        setData(response.data)
      );
    };

    getCigarettesData();
  }, []);

  const handlePlusButtonClick = () => {
    setCigarettes(cigarettes + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newTimestamp: TimestampData = {
      userId: user?.id!,
      timestamp: Date.now().toString(),
    };
    CigarettesDataService.sendTimestamp(newTimestamp);
    setData((prevData) => [...(prevData || []), newTimestamp]);
  };

  useEffect(() => {
    setLastCigaretteTime(getLastTimestamp(data));
    setCigarettes(countTodayTimestamps(data));
    setYesterdayCount(countYesterdayTimestamps(data));
    setTimeSinceLast(updateTimeSinceLast(data));
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceLast(updateTimeSinceLast(data));
      settodayLeftAverage(leftForTodayFrequency(todayLeft));
    }, 10000); // Update every minute

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [data, lastCigaretteTime]);

  useEffect(() => {
    setYesterdayAverage(averageSmokingFrequencyYesterday(yesterdayCount));
  }, [yesterdayCount]);

  useEffect(() => {
    setTodayLeft(leftForToday(dailyCigarettes, cigarettes));
  }, [dailyCigarettes, cigarettes]);

  useEffect(() => {
    settodayLeftAverage(leftForTodayFrequency(todayLeft));
  }, [todayLeft]);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.lastCigarette}>
          Last Cigarette at {lastCigaretteTime}
        </Text>
        <Text style={styles.lastCigaretteTime}>{timeSinceLast}</Text>
      </View>
      <Text style={styles.today}>Today</Text>
      <View style={styles.counterBox}>
        <Text style={styles.cigaretteCount}>{cigarettes}</Text>
        <Text style={styles.cigaretteCountText}>Cigarettes</Text>
      </View>
      <View style={styles.statsContainer}>
        <View>
          <Text style={styles.statsDay}>Yesterday</Text>
          <Text
            style={[
              styles.statsYesterdayNumber,
              { color: yesterdayCount > dailyCigarettes ? "red" : "green" },
            ]}
          >
            {yesterdayCount}
          </Text>
          <Text style={styles.statsTime}>every {yesterdayAverage}</Text>
        </View>
        <View>
          <Text style={styles.statsDay}>Left for today</Text>
          <Text
            style={[
              styles.statsTodayNumber,
              { color: todayLeft === 0 ? "red" : "green" },
            ]}
          >
            {todayLeft}
          </Text>
          <Text style={styles.statsTime}>
            {todayLeft === 0 ? "" : `every ${todayLeftAverage}`}
          </Text>
        </View>
      </View>
      <View style={styles.plusBtnContainer}>
        <GestureHandlerRootView>
          <TouchableOpacity
            style={styles.plusBtn}
            onPress={handlePlusButtonClick}
          >
            <FontAwesome name="plus" size={40} style={styles.plusBtnIcon} />
          </TouchableOpacity>
        </GestureHandlerRootView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    borderColor: "red",
    borderStyle: "solid",
    marginTop: 100,
  },
  title: {
    fontSize: 20,
    fontFamily: "Roboto-Bold",
  },
  counterBox: {
    backgroundColor: Colors.green,
    padding: 130,
    borderRadius: 300,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
  },
  cigaretteCount: {
    position: "absolute",
    color: Colors.grey,
    fontSize: 144,
    fontFamily: "Roboto-Medium",
    top: Platform.OS === "android" ? 30 - (STATUS_BAR_HEIGHT ?? 0) : 30,
  },
  cigaretteCountText: {
    position: "absolute",
    fontSize: 24,
    fontFamily: "Roboto-Medium",
    color: Colors.grey,
    top: 190,
  },
  topContainer: {
    display: "flex",
    paddingStart: 25,
    paddingTop: 25,
    alignSelf: "flex-start",
    flexDirection: "column",
  },
  today: {
    fontSize: 48,
    fontFamily: "Roboto-Medium",
  },
  plusBtnContainer: {
    marginBottom: 40,
  },
  plusBtn: {
    backgroundColor: Colors.grey,
    paddingVertical: 14,

    borderRadius: 10,
  },
  plusBtnIcon: {
    color: Colors.green,
    paddingHorizontal: 150,
  },
  lastCigarette: {
    fontFamily: "Roboto-Medium",
    fontSize: 24,
  },
  lastCigaretteTime: {
    fontFamily: "Roboto-Medium",
    fontSize: 18,
    color: Colors.grey,
  },
  statsContainer: {
    width: "83%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsDay: { fontFamily: "Roboto-Medium", fontSize: 18 },
  statsYesterdayNumber: {
    fontFamily: "Roboto-Medium",
    fontSize: 24,
  },
  statsTodayNumber: {
    fontFamily: "Roboto-Medium",
    fontSize: 24,
  },
  statsTime: { fontFamily: "Roboto-Medium", fontSize: 18, color: Colors.grey },
});
