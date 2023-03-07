import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();

  if (req.method === "GET") {
    try {
      const data = await prisma.user.findMany({
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

  if (req.method === "POST") {
    try {
      const data = await prisma.user.create({
        data: JSON.parse(req.body),
      });
      return res.status(200).json({ data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }

  if (req.method === "PUT") {
    try {
      const data = await prisma.user.update({
        where: {
          id: req.body.id,
        },
        data: req.body,
      });
      return res.status(200).json({ data });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const data = await prisma.user.delete({
        where: {
          id: req.body.id,
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
