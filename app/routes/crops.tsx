import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import type { LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet } from "@remix-run/react";
import { FaUser } from "react-icons/fa";

import { requireUserId } from "~/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function CropsPage() {
  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-green-800 p-4">
        <h1 className="text-3xl font-bold text-white">
          <Link to=".">ALLOTMENT</Link>
        </h1>
        <Form action="/logout" method="post">
          <Menu>
            <MenuButton as={Button}>
              <FaUser />
            </MenuButton>
            <MenuList>
              <MenuItem type="submit">Log out</MenuItem>
            </MenuList>
          </Menu>
        </Form>
      </header>
      <main className="flex h-full justify-center bg-green-50">
        <div className="max-w-[600px] flex-1 bg-white p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
