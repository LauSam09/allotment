import { Form } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import DatePicker from "react-datepicker";
import { parse } from "date-fns";
import React, { useRef, useState } from "react";

import { requireUserId } from "~/session.server";
import { createSowing, getCrop } from "~/models/crops.server";

import styles from "react-datepicker/dist/react-datepicker.css";

export function links() {
  return [
    {
      rel: "stylesheet",
      href: styles,
    },
  ];
}

type ActionData = {
  errors?: {};
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.cropId, "cropId not found");

  const crop = await getCrop({ userId, id: params.cropId });

  if (!crop) {
    throw new Response("Not Found", { status: 404 });
  }

  const formData = await request.formData();

  const plantedAtField = formData.get("planted-at");

  if (typeof plantedAtField !== "string" || plantedAtField.length === 0) {
    return json<ActionData>(
      {
        errors: { plantedAt: "Date format is unrecognised" },
      },
      { status: 400 }
    );
  }

  const plantedAt = parse(plantedAtField, "dd/MM/yyyy", new Date());

  await createSowing({ id: params.cropId, plantedAt });

  return redirect(`crops/${params.cropId}`);
};

export default function NewCropPage() {
  const [plantedDate, setPlantedDate] = useState<Date | null>(new Date());
  const labelContentRef = useRef<HTMLSpanElement>(null);

  function handleClickLabel(
    event: React.MouseEvent<HTMLLabelElement, MouseEvent>
  ) {
    if (event.nativeEvent.target !== labelContentRef?.current) {
      event.preventDefault();
    }
  }

  const CustomInput = (
    props: React.HTMLProps<HTMLInputElement>,
    ref: React.Ref<HTMLInputElement>
  ) => {
    return (
      <input
        {...props}
        ref={ref}
        name="planted-at"
        className="rounded border-2 p-1"
      />
    );
  };

  return (
    <Form method="post" className="flex flex-col gap-8">
      <div>
        <label
          onClick={handleClickLabel}
          className="flex w-full flex-col gap-1"
        >
          <span ref={labelContentRef}>Planting Date</span>
          <DatePicker
            selected={plantedDate}
            dateFormat="dd/MM/yyyy"
            onChange={setPlantedDate}
            // TypeScript workaround based on https://github.com/Hacker0x01/react-datepicker/issues/2165#issuecomment-711032947
            customInput={React.createElement(React.forwardRef(CustomInput))}
          />
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
