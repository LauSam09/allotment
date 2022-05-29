import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import { createSowing, CropWithSowings } from "~/models/crops.server";
import { deleteCrop } from "~/models/crops.server";
import { getCrop } from "~/models/crops.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  crop: CropWithSowings;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.cropId, "cropId not found");

  const crop = await getCrop({ userId, id: params.cropId });

  if (!crop) {
    throw new Response("Not Found", { status: 404 });
  }

  return json<LoaderData>({ crop });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.cropId, "cropId not found");

  const formData = await request.formData();

  if (formData.get("action") === "delete") {
    await deleteCrop({ userId, id: params.cropId });
    return redirect("/crops");
  }

  if (formData.get("action") === "add-sowing") {
    const crop = await getCrop({ userId, id: params.cropId });

    if (!crop) {
      throw new Response("Not Found", { status: 404 });
    }

    await createSowing({ id: crop.id });

    return null;
  }
};

export default function CropDetailsPage() {
  const data = useLoaderData() as LoaderData;

  return (
    <div>
      <h3 className="text-2xl font-bold">{data.crop.species}</h3>
      <h4 className="text-xl">Sowings</h4>
      <Form method="post">
        <button
          type="submit"
          name="action"
          value="add-sowing"
          className="rounded bg-blue-500 py-2 px-4 text-xs text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Add sowing
        </button>
      </Form>
      {data.crop.sowings.length === 0 ? (
        <span>No sowings yet</span>
      ) : (
        <span>{data.crop.sowings.length} sowing(s)</span>
      )}

      <p>Created {new Date(data.crop.createdAt).toLocaleDateString()}</p>
      <p>Updated {new Date(data.crop.updatedAt).toLocaleDateString()}</p>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          name="action"
          value="delete"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Crop not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
