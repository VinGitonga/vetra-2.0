import { withSessionRoute } from "@/lib/withSession";
import vaultSchema from "@/schemas/vault";
import { IVaultItem } from "@/types/Secret";
import redisClient from "@/utils/redis-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getSecretKey(req, res);
    default:
      return res.status(405).json({
        status: "error",
        msg: "Method not allowed",
      });
  }
}

async function getSecretKey(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.query;
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
    const vaultRepo = (await client).fetchRepository(vaultSchema);

    await vaultRepo.createIndex();

    const vaultItem = await vaultRepo
      .search()
      .where("owner")
      .equals(address as string)
      .return.first();

    const newVaultItem = vaultItem.toJSON() as IVaultItem;

    res.status(200).json({
      status: "ok",
      data: {
        publicKey: newVaultItem.sharePrivateKey,
      },
      msg: "Secret key retrieved successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Secret key could not be retrieved",
    });
  } finally {
    // await redis.closeClient();
  }
}