import http from "./httpHeader";

type TimestampData = {
  userId: string;
  timestamp: string;
};

class CigarettesDataService {
  getData(userId: string) {
    return http.get(`/data?userId=${userId}`);
  }

  sendTimestamp(timestampData: TimestampData) {
    return http.post(`/data`, timestampData);
  }
}

export default new CigarettesDataService();
