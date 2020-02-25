import express from 'express';

const router = express.Router();

router.get('/', function (request, response) {
  response.send({"greeting": "hello"});
});

export default router;
