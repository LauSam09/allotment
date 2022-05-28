import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getCropListItems } from "~/models/crops.server";

type LoaderData = {
  cropListItems: Awaited<ReturnType<typeof getCropListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const cropListItems = await getCropListItems({ userId });
  return json<LoaderData>({ cropListItems });
};

export default function CropsPage() {
  const data = useLoaderData() as LoaderData;
  const user = useUser();

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Crops</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <main className="flex h-full justify-center bg-white">
        {data.cropListItems.length === 0 ? (
          <p className="p-4">No crops yet</p>
        ) : (
          <ol className="min-w-[500px]">
            {data.cropListItems.map((crop) => (
              <li key={crop.id}>
                <Link
                  className="block border-b p-4 text-xl hover:bg-gray-200"
                  to={crop.id}
                >
                  🌱 {crop.species}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
    </div>
  );
}
