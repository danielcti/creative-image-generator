import Layout from "@/components/layout";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

interface HomeProps {
  user: any;
}

export default function Home({ user }: HomeProps) {
  const [input, setInput] = useState("");
  const [imageSrc, setImageSrc] = useState(null);

  const generateImage = async () => {
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          origin: window.location.origin,
        },
        body: JSON.stringify({
          userId: user.id,
          prompt: input,
          size: "256x256",
        }),
      });
      const data = await response.json();
      setImageSrc(data.generatedImage.imageUrl);
      user.credits -= 1;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await generateImage();
  };

  const buyCredit = async () => {
    const response = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        origin: window.location.origin,
      },
      body: JSON.stringify({
        email: user?.email,
        items: [
          {
            price: "price_1MiTa4FCIc3HUpnmJ8C0pncg",
            quantity: 1,
          },
        ],
      }),
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  if (!user)
    return (
      <Layout>
        <div>Please log in.</div>
      </Layout>
    );

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
        <p className="text-lg mb-2">
          You have {user.credits} credits remaining. Use them wisely!
        </p>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-8"
          onClick={buyCredit}
        >
          Buy 1 credit
        </button>
        <form onSubmit={handleSubmit} className="mb-8">
          <label htmlFor="text" className="block text-lg mb-2">
            Enter some text for generate an image:
          </label>
          <input
            type="text"
            id="text"
            name="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border border-gray-400 p-2 mb-4"
          />
          <button
            disabled={user.credits <= 0}
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Generate Image
          </button>
        </form>
        {imageSrc && (
          <div className="border border-gray-400 w-[256px] h-[256px]">
            <Image
              src={imageSrc}
              alt="Generated Image"
              width={256}
              height={256}
            />
          </div>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession({ ctx: context });
  const host = context.req.headers.host as string;
  const httpProtocol = ["localhost", ":3000"].some((t) => host.includes(t))
    ? "http"
    : "https";
  const url = `${httpProtocol}://${host}/api/user/get_by_email?email=${session?.user?.email}`;
  const response = await fetch(url);
  const { data } = await response.json();
  return {
    props: {
      user: data,
    },
  };
}
