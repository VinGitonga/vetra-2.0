import { withSessionRoute } from "@/lib/withSession";
import fileSchema from "@/schemas/file";
import vaultSchema from "@/schemas/vault";
import { IVaultItem } from "@/types/Secret";
import redisClient from "@/utils/redis-client";
import type { NextApiRequest, NextApiResponse } from "next";

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getUserPublicKey(req, res);
    case "POST":
      return addAddressToAccessFile(req, res);
    default:
      return res.status(405).json({
        status: "error",
        msg: "Method not allowed",
      });
  }
}

async function getUserPublicKey(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.query;
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
      .equals(walletAddress as string)
      .return.first();

    const newVaultItem = vaultItem.toJSON() as IVaultItem;

    res.status(200).json({
      status: "ok",
      data: {
        publicKey: newVaultItem.sharePublicKey,
      },
      msg: "Public key retrieved successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Public key could not be retrieved",
    });
  } finally {
    await redis.closeClient();
  }
}

async function addAddressToAccessFile(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { address, entityId } = req.body;
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

    const fileItem = await fileRepo.fetch(entityId as string);

    fileItem.addAllowedAddress(address);

    await fileRepo.save(fileItem);

    res.status(200).json({
      status: "ok",
      msg: "Address added to access list successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Address could not be added to access list",
    });
  } finally {
    await redis.closeClient();
  }
}
