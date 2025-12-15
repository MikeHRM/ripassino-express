import { Router } from "express";
import { getDB } from "../db/mongodb.js";
import { redisClient } from "../db/redis.js";

const apiRouter = Router();

const getRestaurantsCollection = () => {
  const restaturantsDB = getDB("sample_restaurants");
  const restaurantsCollection = restaturantsDB.collection("restaurants");
  return restaurantsCollection;
};

apiRouter.get("/filter", async (req, res) => {
  const restaurantsCollection = getRestaurantsCollection();
  const restaturants = await restaurantsCollection
    .find({
      $and: [
        {
          borough: req.query.borough,
        },
        { cuisine: req.query.cuisine },
      ],
    })
    .toArray();

  res.status(200).json({
    message: "ok filter",
    restaturants,
  });
});

apiRouter.get("/:restaurant_id", async (req, res) => {
  const cachedRestaurant = await redisClient.get(
    `restaurant-${req.params.restaurant_id}`
  );

  if (cachedRestaurant !== null) {
    res.status(200).json({
      message: " ok",
      restaturant: JSON.parse(cachedRestaurant),
    });
  } else {
    const restaurantsCollection = getRestaurantsCollection();
    const restaturant = await restaurantsCollection.findOne({
      restaurant_id: req.params.restaurant_id,
    });

    res.status(200).json({
      message: " ok",
      restaturant,
    });

    await redisClient.set(
      `restaurant-${req.params.restaurant_id}`,
      JSON.stringify(restaturant)
    );
  }
});

apiRouter.get("/", async (req, res) => {
  const restaurantsCollection = getRestaurantsCollection();
  const restaturants = await restaurantsCollection.find({}).toArray();

  res.status(200).json({
    message: " ok",
    restaturants,
  });
});

export default apiRouter;
