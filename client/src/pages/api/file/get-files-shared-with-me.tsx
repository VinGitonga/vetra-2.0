import { withSessionRoute } from "@/lib/withSession";
import fileSchema from "@/schemas/file";
import redisClient from "@/utils/redis-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getFilesSharedWithMe(req, res);
    default:
      return res.status(405).json({
        status: "error",
        msg: "Method not allowed",
      });
  }
}

async function getFilesSharedWithMe(req: NextApiRequest, res: NextApiResponse) {
  const redis = new redisClient();
  const client = redis.initClient();
  const user = req.session.user;
  if (!user) {
    return res.status(401).json({
      status: "error",
      msg: "Unauthorized",
    });
  }

  try {
    const fileRepo = (await client).fetchRepository(fileSchema);
    await fileRepo.createIndex();

    const files = await fileRepo
      .search()
      .where("ownerAddress")
      .not.eq(user.address)
      .where("allowedAddresses")
      .contain(user.address)
      .return.all();

    return res.status(200).json({
      status: "ok",
      data: files,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      status: "error",
      msg: "Internal server error",
    });
  } finally {
    await redis.closeClient();
  }
}
