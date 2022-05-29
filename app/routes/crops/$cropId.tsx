import { AddIcon, DeleteIcon, HamburgerIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { CropWithSowings } from "~/models/crops.server";
import { createSowing } from "~/models/crops.server";
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
    <div className="flex flex-col gap-2">
      <h3 className="text-2xl font-bold">{data.crop.species}</h3>

      <div className="flex flex-col gap-2 rounded border-2 p-2">
        <div className="flex justify-between ">
          <h4 className="text-xl">Sowings</h4>
          <Form method="post">
            <button
              type="submit"
              name="action"
              value="add-sowing"
              className="rounded bg-blue-500 py-2 px-4 text-xs text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              <AddIcon />
            </button>
          </Form>
        </div>
        {data.crop.sowings.length === 0 ? (
          <span>No sowings yet</span>
        ) : (
          <ol className="justify flex flex-col gap-2">
            {data.crop.sowings.map((sowing, i) => (
              <li key={sowing.id} className="flex items-center justify-between">
                <span>
                  🌱
                  {new Date(sowing.plantedAt).toLocaleDateString()} ⏰{" "}
                  {(i + 1) * 7} days
                </span>
                <Menu>
                  <MenuButton as={Button}>
                    <HamburgerIcon />
                  </MenuButton>
                  <MenuList>
                    <MenuItem icon={<DeleteIcon />}>Delete</MenuItem>
                  </MenuList>
                </Menu>
              </li>
            ))}
          </ol>
        )}
      </div>

      <div className="rounded border-2 p-2">
        <p>Created {new Date(data.crop.createdAt).toLocaleDateString()}</p>
        <p>Updated {new Date(data.crop.updatedAt).toLocaleDateString()}</p>
      </div>
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
