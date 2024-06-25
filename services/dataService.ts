import http from "./httpHeader";

class CigarettesDataService {
  getData(userId: string) {
    return http.get(`/data?userId=${userId}`);
  }

  sendTimestamp(timestamp: number) {
    return http.put(`/data`, timestamp);
  }
}

export default new CigarettesDataService();
