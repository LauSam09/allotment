import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { getCropListItems } from "~/models/crops.server";

type LoaderData = {
  cropListItems: Awaited<ReturnType<typeof getCropListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const cropListItems = await getCropListItems({ userId });
  return json<LoaderData>({ cropListItems });
};

export default function CropsIndexPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <>
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
    </>
  );
}
