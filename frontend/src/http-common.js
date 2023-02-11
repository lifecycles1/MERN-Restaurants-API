import axios from "axios";

export default axios.create({
  // server
  // baseURL: "http://localhost:5000/api/v1/restaurants",

  // serverless
  baseURL: "https://europe-west1.gcp.data.mongodb-api.com/app/restaurant-reviews-xszkw/endpoint/",
  headers: {
    "Content-type": "application/json",
  },
});
