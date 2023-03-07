export default function SignInRedirect() {
  return (
    <div className="container xl:max-w-screen-xl mx-auto py-12 px-6 text-center">
      <h2 className="text-4xl font-semibold flex flex-col items-center space-x-1">
        <span>Thanks for your sign in!</span>
      </h2>
    </div>
  );
}

export async function getServerSideProps(context: any) {
  const { session_id } = context.query;
  const host = context.req.headers.host as string;
  const httpProtocol = ["localhost", ":3000"].some((t) => host.includes(t))
    ? "http"
    : "https";
  const url = `${httpProtocol}://${host}/api/checkout_sessions/${session_id}`;
  await fetch(url);

  return {
    redirect: {
      permanent: false,
      destination: "/",
    },
  };
}
