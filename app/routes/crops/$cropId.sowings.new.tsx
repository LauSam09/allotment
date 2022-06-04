import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { requireUserId } from "~/session.server";

type ActionData = {
  errors?: {};
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.cropId, "cropId not found");

  const formData = await request.formData();

  return redirect(`crops/${params.cropId}`);
};

export default function NewCropPage() {
  return (
    <Form method="post" className="flex flex-col gap-8">
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Planting Date</span>
          {/* TODO */}
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
