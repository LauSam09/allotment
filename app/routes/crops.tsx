import type { LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet } from "@remix-run/react";

import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function CropsPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-green-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">ALLOTMENT</Link>
        </h1>
        <Form action="/logout" method="post">
          <button
            type="submit"
            className="rounded bg-green-600 py-2 px-4 text-green-100 hover:bg-green-500 active:bg-blue-600"
          >
            Logout
          </button>
        </Form>
      </header>
      <main className="flex h-full justify-center bg-white p-4">
        <div className="max-w-[600px] flex-1 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
