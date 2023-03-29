import { withSessionRoute } from "@/lib/withSession";
import { generateSecret } from "@/utils/locks";
import redisClient from "@/utils/redis-client";
import { NextApiRequest, NextApiResponse } from "next";
import vaultSchema from "@/schemas/vault";
import { IVaultItem } from "@/types/Secret";
import { generateKeyPair } from "@/utils/asymetric";

export default withSessionRoute(handler);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return generateSecretKey(req, res);
    case "GET":
      return getVaultEncryptedSecret(req, res);
  }
}

async function generateSecretKey(req: NextApiRequest, res: NextApiResponse) {
  const { walletAddress } = req.body;
  const redis = new redisClient();
  const client = redis.initClient();

  try {
    const { encryptedSecret, encryptedNounce, timestamp } =
      await generateSecret(walletAddress);
    const { publicKey, secretKey } = generateKeyPair();
    const vaultRepo = (await client).fetchRepository(vaultSchema);
    const newVaultItem = vaultRepo.createEntity({
      owner: walletAddress,
      encryptedSecret,
      created: timestamp,
      sharePublicKey: publicKey,
      sharePrivateKey: secretKey,
    });

    await vaultRepo.save(newVaultItem);

    res.status(200).json({
      status: "ok",
      data: {
        encryptedNounce,
      },
      msg: "Secret generated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Secret could not be generated",
    });
  } finally {
    await redis.closeClient();
  }
}

async function getVaultEncryptedSecret(
  req: NextApiRequest,
  res: NextApiResponse
) {
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
    const vaultRepo = (await client).fetchRepository(vaultSchema);
    await vaultRepo.createIndex();

    const vaultItem = await vaultRepo
      .search()
      .where("owner")
      .equals(user.address)
      .return.first();

    const newVaultItem = vaultItem.toJSON() as IVaultItem;

    // check if encryped secret is preset
    if (!newVaultItem.encryptedSecret) {
      res.status(200).json({
        status: "ok",
        data: {
          encryptedSecret: null,
        },
      });
      return;
    }

    res.status(200).json({
      status: "ok",
      data: {
        encryptedSecret: newVaultItem.encryptedSecret,
      },
      msg: "Secret generated successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Something went wrong",
    });
  } finally {
    await redis.closeClient();
  }
}
