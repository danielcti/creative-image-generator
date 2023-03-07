import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  if (req.method === "GET") {
    try {
      const data = await prisma.user.findUnique({
        where: {
          email: req.query.email as string,
        },
        include: {
          generatedImages: true,
        },
      });
      return res.status(200).json({ data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }

  return res.status(405).json({ msg: "Method not allowed" });
}
