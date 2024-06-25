import http from "./httpHeader";

class DataService {
  getData(userId: string) {
    return http.get(`/data?userId=${userId}`);
  }
}
