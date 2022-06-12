import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { createCrop } from "~/models/crops.server";
import { getSpeciesListItems } from "~/models/species.server";

type LoaderData = {
  speciesListItems: Awaited<ReturnType<typeof getSpeciesListItems>>;
};

export const loader: LoaderFunction = async () => {
  const speciesListItems = await getSpeciesListItems();
  return json<LoaderData>({ speciesListItems });
};

type ActionData = {
  errors?: {
    species?: string;
  };
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const species = formData.get("species");

  if (typeof species !== "string" || species.length === 0) {
    return json<ActionData>(
      {
        errors: { species: "Species is required" },
      },
      { status: 400 }
    );
  }

  const crop = await createCrop({ speciesId: species, userId });

  return redirect(`/crops/${crop.id}`);
};

export default function NewCropPage() {
  const data = useLoaderData<LoaderData>();

  return (
    <Form method="post" className="flex flex-col gap-8">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Species</span>
          <select
            name="species"
            className="rounded-md border-2 px-3 text-lg leading-loose"
          >
            {data.speciesListItems
              .sort((s1, s2) => s1.name.localeCompare(s2.name))
              .map((species) => (
                <option key={species.id} value={species.id}>
                  {species.name}
                </option>
              ))}
          </select>
        </label>
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Save
        </button>
      </div>
    </Form>
  );
}
