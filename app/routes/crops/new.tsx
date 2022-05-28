import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json, redirect } from "@remix-run/node";
import { requireUserId } from "~/session.server";
import { createCrop } from "~/models/crops.server";

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

  const crop = await createCrop({ species, userId });

  return redirect(`/crops/${crop.id}`);
};

export default function NewCropPage() {
  return (
    <Form method="post" className="flex flex-col gap-8">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Species</span>
          <select
            name="species"
            className="rounded-md border-2 px-3 text-lg leading-loose"
          >
            <option value="Carrot">Carrot</option>
            <option value="French Dwarf Bean">French Dwarf Bean</option>
            <option value="Garlic">Garlic</option>
            <option value="Potato">Potato</option>
            <option value="Tomato">Tomato</option>
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
