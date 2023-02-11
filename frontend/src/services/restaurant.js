import http from "../http-common.js";

class RestaurantDataService {
  getAll(page = 0) {
    // server
    // return http.get(`?page=${page}`);

    // serverless
    return http.get(`restaurants?page=${page}`);
  }

  get(id) {
    // server
    // return http.get(`/id/${id}`);

    // serverless
    return http.get(`/restaurant?id=${id}`);
  }

  find(query, by = "name", page = 0) {
    // server
    // return http.get(`?${by}=${query}&page=${page}`);

    // serverless
    return http.get(`restaurants?${by}=${query}&page=${page}`);
  }

  createReview(data) {
    // server
    // return http.post("/review", data);

    // serverless
    return http.post("/reviewnew", data);
  }

  updateReview(data) {
    // server
    // return http.put("/review", data);

    // serverless
    return http.put("/reviewedit", data);
  }

  deleteReview(id, userId) {
    // server
    // return http.delete(`/review?id=${id}`, { data: { user_id: userId } });

    // serverless
    return http.delete(`/reviewdelete?id=${id}`, { data: { user_id: userId } });
  }

  getCuisines(id) {
    // server and serverless
    return http.get(`/cuisines`);
  }
}

export default new RestaurantDataService();
