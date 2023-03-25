import blocSchema from "@/schemas/bloc";
import redisClient from "@/utils/redis-client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "DELETE":
      return removeBloc(req, res);
  }
}

async function removeBloc(req: NextApiRequest, res: NextApiResponse) {
  const { blocId } = req.query;

  const redis = new redisClient();

  const client = redis.initClient();

  const blocRepo = (await client).fetchRepository(blocSchema);

  try {
    await blocRepo.remove(blocId as string);

    res.status(200).json({
      status: "ok",
      msg: "Bloc removed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Bloc could not be removed",
    });
  }
}
