import { withSessionRoute } from "@/lib/withSession";
import blocSchema from "@/schemas/bloc";
import redisClient from "@/utils/redis-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return fetchBlocs(req, res);
  }
}

async function fetchBlocs(req: NextApiRequest, res: NextApiResponse) {
  const redis = new redisClient();
  const client = redis.initClient();

  const user = req.session.user;

  if (!user) {
    return res.status(401).json({
      status: "error",
      msg: "You are not authenticated",
    });
  }

  const owner = user.address;

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
    // await redis.closeClient();
  }
}
