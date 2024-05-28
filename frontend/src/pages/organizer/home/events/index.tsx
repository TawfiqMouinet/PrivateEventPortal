import {
  Button,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TableColumn,
  getKeyValue,
} from "@nextui-org/react";
import { useState } from "react";
import { apiurl } from "@/context/apiURL";
import OrganizerNav from "@/components/OrganizerNav";
import { useUserContext } from "@/hooks/useUserContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await fetch(`${apiurl}/api/events/get`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  console.log(res);
  const data = await res.json();
  console.log(data);
  return { props: { events: data } };
}

export default function Events({
  events,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { user } = useUserContext();
  const columns = [
    { key: "title", label: "Event Title" },
    { key: "date", label: "Date" },
    { key: "location", label: "Location" },
    { key: "numOfAttendees", label: "Attendees" },
    { key: "maxAttendees", label: "Capacity" },
  ];
  return (
    <main className="h-screen ">
      <OrganizerNav />
      <Table aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key}>{column.label}</TableColumn>
          )}
        </TableHeader>
        <TableBody items={events}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{getKeyValue(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </main>
  );
}
