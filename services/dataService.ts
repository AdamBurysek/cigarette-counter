import http from "./httpHeader";
import { TimestampData } from "./dataService.d";

class CigarettesDataService {
  getData(userId: string) {
    return http.get(`/data?userId=${userId}`);
  }

  sendTimestamp(timestampData: TimestampData) {
    return http.post(`/data`, timestampData);
  }
}

export default new CigarettesDataService();
