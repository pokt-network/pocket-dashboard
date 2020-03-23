import express from "express";

const router = express.Router();

router.get("/", (request, response) => {
  response.send("Welcome to Pocket dasboard API");
});

export default router;
