import { PrismaClient } from "@prisma/client";
import AWS from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const prisma = new PrismaClient();
  const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  });

  if (req.method === "POST") {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: req.body.userId,
        },
      });

      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }

      if (user.credits < 1) {
        return res.status(403).json({ msg: "Not enough credits" });
      }

      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            prompt: req.body.prompt,
            size: req.body.size,
          }),
        }
      );
      const { data } = await response.json();

      const imageURL = data[0].url;
      const imgRes = (await fetch(imageURL)) as any;
      const blob = await imgRes.buffer();
      const uploadedImage = await s3
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME as string,
          Key: `user-${user.id}/img-${new Date().getTime()}.png`,
          Body: blob,
        })
        .promise();

      const generatedImage = await prisma.generatedImage.create({
        data: {
          imageUrl: uploadedImage.Location,
          description: req.body.prompt,
          User: {
            connect: {
              id: req.body.userId,
            },
          },
        },
      });

      await prisma.user.update({
        where: {
          id: req.body.userId,
        },
        data: {
          credits: {
            decrement: 1,
          },
        },
      });

      return res.status(200).json({ generatedImage });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ msg: "Something went wrong" });
    }
  }

  return res.status(405).json({ msg: "Method not allowed" });
}
