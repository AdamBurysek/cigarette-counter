import { TimestampData } from "./types";

export const getLastTimestamp = (data: TimestampData[]): string | null => {
  if (data.length === 0) return null;
  const lastTimestamp = data[data.length - 1].timestamp;
  const date = new Date(parseInt(lastTimestamp));
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const countTodayTimestamps = (data: TimestampData[]): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startOfDay = today.getTime();
  today.setHours(23, 59, 59, 999);
  const endOfDay = today.getTime();

  return data.filter((timestampData) => {
    const timestamp = parseInt(timestampData.timestamp);
    return timestamp >= startOfDay && timestamp <= endOfDay;
  }).length;
};

export const countYesterdayTimestamps = (data: TimestampData[]): number => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);

  const startOfDay = yesterday.getTime();
  yesterday.setHours(23, 59, 59, 999);
  const endOfDay = yesterday.getTime();

  return data.filter((timestampData) => {
    const timestamp = parseInt(timestampData.timestamp);
    return timestamp >= startOfDay && timestamp <= endOfDay;
  }).length;
};

export const updateTimeSinceLast = (data: TimestampData[]): string | null => {
  if (data.length === 0) {
    return null;
  }

  const lastTimestamp = parseInt(data[data.length - 1].timestamp);
  const now = Date.now();
  const diffInMinutes = Math.floor((now - lastTimestamp) / 60000);

  let timeString = "";
  if (diffInMinutes < 60) {
    timeString = `${diffInMinutes} min. ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    timeString = `${hours} hr${hours !== 1 ? "s" : ""}${
      minutes > 0 ? ` and ${minutes} min.` : ""
    } ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    const hours = Math.floor((diffInMinutes % 1440) / 60);
    timeString = `${days} day${days !== 1 ? "s" : ""}${
      hours > 0 ? ` and ${hours} hr${hours !== 1 ? "s" : ""}` : ""
    } ago`;
  }

  return timeString;
};

export const averageSmokingFrequencyYesterday = (
  yesterdayCount: number
): string | null => {
  if (yesterdayCount < 2) return null;

  const totalMinutesInDay = 1440; // 24 hours * 60 minutes
  const averageIntervalInMinutes = totalMinutesInDay / (yesterdayCount - 1);

  const hours = Math.floor(averageIntervalInMinutes / 60);
  const minutes = Math.round(averageIntervalInMinutes % 60);

  if (minutes === 0) {
    return `${hours} hr${hours !== 1 ? "s" : ""}`;
  }

  return `${
    hours > 0 ? `${hours} hr${hours !== 1 ? "s" : ""} ` : ""
  }${minutes} min.`;
};

export const leftForToday = (
  dailyCigarettes: number,
  cigarettes: number
): number => {
  return Math.max(dailyCigarettes - cigarettes, 0);
};

export const leftForTodayFrequency = (todayLeft: number): string | null => {
  if (todayLeft < 1) return null;

  const remainingMinutesInDay =
    1440 - new Date().getHours() * 60 - new Date().getMinutes();
  const averageIntervalInMinutes = remainingMinutesInDay / todayLeft;

  const hours = Math.floor(averageIntervalInMinutes / 60);
  const minutes = Math.round(averageIntervalInMinutes % 60);

  if (minutes === 0) {
    return `${hours} hr${hours !== 1 ? "s" : ""}`;
  }

  return `${
    hours > 0 ? `${hours} hr${hours !== 1 ? "s" : ""} ` : ""
  }${minutes} min`;
};
