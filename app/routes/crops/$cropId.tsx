import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form,
  Link,
  useCatch,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import invariant from "tiny-invariant";
import {
  BsFillCalendarFill,
  BsFillTrashFill,
  BsPlusLg,
  BsThreeDotsVertical,
} from "react-icons/bs";

import type { CropWithSowingsAndSpecies } from "~/models/crops.server";
import { deleteSowing } from "~/models/crops.server";
import { deleteCrop } from "~/models/crops.server";
import { getCrop } from "~/models/crops.server";
import { requireUserId } from "~/session.server";

type LoaderData = {
  crop: CropWithSowingsAndSpecies;
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
  const action = formData.get("action");

  if (action === "delete") {
    await deleteCrop({ userId, id: params.cropId });
    return redirect("/crops");
  }

  const crop = await getCrop({ userId, id: params.cropId });

  if (!crop) {
    throw new Response("Not Found", { status: 404 });
  }

  if (action === "delete-sowing") {
    const sowingId = formData.get("id");
    invariant(sowingId, "sowingId not found");

    await deleteSowing({ id: sowingId.toString(), cropId: crop.id });
  }

  return null;
};

function isPlural(number: number) {
  return number === 0 || number > 1;
}

function getWeeksAndDays(days: number) {
  const weeks = Math.floor(days / 7);
  const remainderDays = days % 7;

  const weekString = `${weeks} week${isPlural(weeks) ? "s" : ""}`;
  const dayString = `${remainderDays} day${isPlural(remainderDays) ? "s" : ""}`;

  return `${weeks > 0 ? weekString : ""}${
    weeks > 0 && remainderDays > 0 ? " " : ""
  }${remainderDays > 0 ? dayString : ""}`;
}

export default function CropDetailsPage() {
  const data = useLoaderData<LoaderData>();
  const fetcher = useFetcher();

  return (
    <div className="flex flex-col  gap-2">
      <div className="flex justify-between p-2">
        <h3 className="text-2xl font-bold">{data.crop.species.name}</h3>
        <Form method="post">
          <Menu>
            <MenuButton as={Button}>
              <BsThreeDotsVertical />
            </MenuButton>
            <MenuList>
              <MenuItem
                type="submit"
                name="action"
                value="delete"
                icon={<BsFillTrashFill />}
              >
                Delete
              </MenuItem>
            </MenuList>
          </Menu>
        </Form>
      </div>

      {data.crop.species.growingPeriodMin && (
        <div className="rounded border-2 p-2">
          <dl>
            <dt>Growing period (weeks)</dt>
            <dd>
              {data.crop.species.growingPeriodMin} -{" "}
              {data.crop.species.growingPeriodMax}
            </dd>
          </dl>
        </div>
      )}

      <div className="flex flex-col gap-2 rounded border-2 p-2">
        <div className="flex justify-between ">
          <h4 className="text-xl">Sowings</h4>
          <Link
            to="sowings/new"
            className="rounded bg-blue-500 py-2 px-4 text-xs text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            <BsPlusLg />
          </Link>
        </div>
        {data.crop.sowings.length === 0 ? (
          <span>No sowings yet</span>
        ) : (
          <ol className="justify flex flex-col gap-2">
            {data.crop.sowings
              .sort((s1, s2) => (s1.plantedAt < s2.plantedAt ? -1 : 1))
              .map((sowing) => (
                <li
                  key={sowing.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-1">
                    <BsFillCalendarFill className="inline" />
                    <span>
                      {new Date(sowing.plantedAt).toLocaleDateString()}
                    </span>
                    <span>
                      (
                      {getWeeksAndDays(
                        Math.ceil(
                          (new Date().getTime() -
                            new Date(sowing.plantedAt).getTime()) /
                            (1000 * 3600 * 24)
                        )
                      )}
                      )
                    </span>
                  </div>
                  <Menu>
                    <MenuButton as={Button}>
                      <BsThreeDotsVertical />
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        icon={<BsFillTrashFill />}
                        onClick={() =>
                          fetcher.submit(
                            { id: sowing.id, action: "delete-sowing" },
                            { method: "post" }
                          )
                        }
                      >
                        Delete
                      </MenuItem>
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
