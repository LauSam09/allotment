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
    <div>
      <Link to="new" className="block p-4 text-center text-xl text-blue-500">
        Add Crop
      </Link>
      {data.cropListItems.length === 0 ? (
        <p className="p-4">No crops yet</p>
      ) : (
        <ol>
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
    </div>
  );
}
