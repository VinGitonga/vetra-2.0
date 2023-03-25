import blocSchema from "@/schemas/bloc";
import redisClient from "@/utils/redis-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return fetchBlocs(req, res);
  }
}

async function fetchBlocs(req: NextApiRequest, res: NextApiResponse) {
  const { owner } = req.query;
  const redis = new redisClient();
  const client = redis.initClient();
  const blocRepo = (await client).fetchRepository(blocSchema);

  await blocRepo.createIndex();
  try {
    const blocs = await blocRepo
      .search()
      .where("ownerAddress")
      .equals(owner as string)
      .return.all();

      

    res.status(200).json({
      status: "ok",
      data: blocs,
      msg: "Blocs fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Blocs could not be fetched",
    });
  } finally {
    await redis.closeClient();
  }
}
