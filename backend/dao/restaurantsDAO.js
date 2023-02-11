import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;
let restaurants;

export default class RestaurantsDAO {
  static async injectDB(conn) {
    if (restaurants) {
      return;
    }
    try {
      restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants");
    } catch (e) {
      console.error(`Unable to establish a collection handle in restaurantsDAO: ${e}`);
    }
  }

  static async getRestaurants({ filters = null, page = 0, restaurantsPerPage = 20 } = {}) {
    let query;
    if (filters) {
      if ("name" in filters) {
        query = {
          // for a text search, a field needs to be specified in the mongodb atlas website so that it knows where to look for the text
          $text: {
            $search: filters["name"],
          },
        };
      } else if ("cuisine" in filters) {
        query = {
          // this is a database field "cuisine", so we don't need to set it up in mongodb atlas (it already knows where to search)
          cuisine: {
            $eq: filters["cuisine"],
          },
        };
      } else if ("zipcode" in filters) {
        query = {
          "address.zipcode": {
            $eq: filters["zipcode"],
          },
        };
      }
    }

    let cursor;

    try {
      cursor = await restaurants.find(query);
    } catch (e) {
      console.error(`Unable to issue find command, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }

    // limit to a certain number of restaurants per page (the default is 20) and skip to get the actual page number
    const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page);

    try {
      const restaurantsList = await displayCursor.toArray();
      const totalNumRestaurants = await restaurants.countDocuments(query);
      return { restaurantsList, totalNumRestaurants };
    } catch (e) {
      console.error(`Unable to convert cursor to array or problem counting documents, ${e}`);
      return { restaurantsList: [], totalNumRestaurants: 0 };
    }
  }

  static async getRestaurantByID(id) {
    try {
      const pipeline = [
        {
          $match: {
            _id: new ObjectId(id),
          },
        },
        {
          $lookup: {
            from: "reviews",
            let: {
              id: "$_id",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$restaurant_id", "$$id"],
                  },
                },
              },
              {
                $sort: {
                  date: -1,
                },
              },
            ],
            as: "reviews",
          },
        },
        {
          $addFields: {
            reviews: "$reviews",
          },
        },
      ];
      return await restaurants.aggregate(pipeline).next();
    } catch (e) {
      console.error(`Something went wrong in getRestaurantByID: ${e}`);
      throw e;
    }
  }

  static async getCuisines() {
    let cuisines = [];
    try {
      cuisines = await restaurants.distinct("cuisine");
      return cuisines;
    } catch (e) {
      console.error(`Unable to get cuisines, ${e}`);
      return cuisines;
    }
  }
}
