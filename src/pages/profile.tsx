import Layout from "@/components/layout";
import { getSession } from "next-auth/react";
import Image from "next/image";

function ImageList({ generatedImages }: { generatedImages: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {generatedImages.map((image: any) => (
        <div
          key={image.id}
          className="bg-white rounded-lg overflow-hidden shadow-lg"
        >
          <Image
            src={image.imageUrl}
            alt={image.description}
            width={640}
            height={480}
            className="object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">{image.description}</h2>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ProfileProps {
  generatedImages: any;
}

export default function Profile({ generatedImages }: ProfileProps) {
  return (
    <Layout>
      <div className="container mx-auto">
        <h1 className="text-3xl font-semibold my-8">Image List</h1>
        <ImageList generatedImages={generatedImages} />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession({ ctx: context });

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const host = context.req.headers.host as string;
  const httpProtocol = ["localhost", ":3000"].some((t) => host.includes(t))
    ? "http"
    : "https";
  const url = `${httpProtocol}://${host}/api/user/get_by_email?email=${session?.user?.email}`;
  const response = await fetch(url);
  const { data } = await response.json();
  return {
    props: {
      generatedImages: data.generatedImages,
    },
  };
}
