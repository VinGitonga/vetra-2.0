import { withSessionRoute } from "@/lib/withSession";
import blocSchema from "@/schemas/bloc";
import redisClient from "@/utils/redis-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return createNewBloc(req, res);
  }
}

async function createNewBloc(req: NextApiRequest, res: NextApiResponse) {
  const redis = new redisClient();
  const client = redis.initClient();
  const user = req.session.user;

  if (!user) {
    res.status(401).json({
      status: "error",
      msg: "Unauthorized",
    });
    return;
  }

  try {
    const blocRepo = (await client).fetchRepository(blocSchema);

    const { displayName, ownerAddress, allowedAddresses, created, updated } =
      req.body;

    const newBloc = blocRepo.createEntity({
      displayName,
      ownerAddress,
      allowedAddresses,
      created,
      updated,
    });

    await blocRepo.save(newBloc);

    res.status(200).json({
      status: "ok",
      data: newBloc,
      msg: "File Bloc created successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Bloc could not be added",
    });
  } finally {
    await redis.closeClient();
  }
}
