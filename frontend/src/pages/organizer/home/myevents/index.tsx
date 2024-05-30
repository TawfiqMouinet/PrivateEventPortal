import {
  Button,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TableColumn,
  getKeyValue,
  SortDescriptor,
  Selection,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  DropdownTrigger,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Pagination,
  DateValue,
  DatePicker,
  Textarea,
  Tooltip,
  Spinner,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiurl } from "@/context/apiURL";
import OrganizerNav from "@/components/OrganizerNav";
import { useUserContext } from "@/hooks/useUserContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { BsThreeDotsVertical } from "react-icons/bs";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import toast from "react-hot-toast";
import { IoSearch } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { FaPenToSquare } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await fetch(`http://backend:4000/api/events/getByOrganizer`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  const data = await res.json();
  return { props: { events: data } };
}

export default function Events({
  events,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  type Event = (typeof events)[0];
  type Registration = (typeof events.registrations)[0];
  const { user } = useUserContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const editModal = useDisclosure();
  const router = useRouter();
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "ascending",
  });
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDescription, setNewEventDescription] = useState("");
  const [newEventLocation, setNewEventLocation] = useState("");
  const [newEventDate, setNewEventDate] = useState<DateValue | null>();
  const [newEventMaxAttendees, setNewEventMaxAttendees] = useState("");
  const [newEventMinAge, setNewEventMinAge] = useState("");
  const [oldEventTitle, setOldEventTitle] = useState("");
  const [oldEventDescription, setOldEventDescription] = useState("");
  const [oldEventLocation, setOldEventLocation] = useState("");
  const [oldEventDate, setOldEventDate] = useState<DateValue | null>();
  const [oldEventMaxAttendees, setOldEventMaxAttendees] = useState("");
  const [oldEventMinAge, setOldEventMinAge] = useState("");
  const [oldEventId, setOldEventId] = useState("");

  async function handleNewEvent() {
    const res = await fetch(`${apiurl}/api/events/create`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        organizerId: user?.id,
        title: newEventTitle,
        description: newEventDescription,
        location: newEventLocation,
        date: newEventDate?.toDate("UTC"),
        maxAttendees: parseInt(newEventMaxAttendees),
        minAge: parseInt(newEventMinAge),
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (res.ok) {
      onOpenChange();
      toast("Event created successfully!", { icon: "✔️" });
      router.replace(router.asPath);
    } else {
      toast("Failed to create event!", { icon: "❌" });
    }
  }
  useEffect(() => {
    return;
  }, [user]);

  async function handleEditEvent() {
    const res = await fetch(`${apiurl}/api/events/update`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({
        id: oldEventId,
        organizerId: user?.id,
        title: oldEventTitle,
        description: oldEventDescription,
        location: oldEventLocation,
        date: oldEventDate?.toDate("UTC"),
        maxAttendees: parseInt(oldEventMaxAttendees),
        minAge: parseInt(oldEventMinAge),
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (res.ok) {
      toast("Event updated successfully!", { icon: "✔️" });
      editModal.onClose();
      router.replace(router.asPath);
    } else {
      toast("Failed to update event.", { icon: "❌" });
    }
  }
  async function handleDeleteEvent(eventId: string) {
    const res = await fetch(`${apiurl}/api/events/delete`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({
        id: eventId,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (res.ok) {
      toast("Event deleted successfully!", { icon: "✔️" });
      router.replace(router.asPath);
    } else {
      toast("Failed to delete event.", { icon: "❌" });
    }
  }
  const [page, setPage] = useState(1);
  const pages = Math.ceil(events.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);
  const filteredItems = useMemo(() => {
    let filteredEvents = [...events];

    if (hasSearchFilter) {
      filteredEvents = filteredEvents.filter((event) =>
        event.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    return filteredEvents;
  }, [events, filterValue]);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const sortedItems = useMemo(() => {
    return [...items].sort((a: Event, b: Event) => {
      const first = a[sortDescriptor.column as keyof Event] as number;
      const second = b[sortDescriptor.column as keyof Event] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);
  const onRowsPerPageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);
  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Search by title..."
            size="sm"
            startContent={<IoSearch className="text-default-500 text-lg" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Button
              endContent={<IoMdAdd className="text-xl" />}
              color="primary"
              onPress={onOpen}
            >
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {events.length} events
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    onRowsPerPageChange,
    events.length,
    hasSearchFilter,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex  justify-center">
        <Pagination
          showControls
          color="primary"
          showShadow
          isDisabled={hasSearchFilter}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
      </div>
    );
  }, [items.length, page, pages, hasSearchFilter]);

  const renderCell = useCallback(
    (event: Event, columnKey: React.Key) => {
      const cellValue = event[columnKey as keyof Event];
      switch (columnKey) {
        case "date":
          const date = new Date(event.date);
          return date.toDateString();
        case "seats":
          if (event.registrations.length >= event.maxAttendees) {
            return "Full";
          }
          return `${event.maxAttendees - event.registrations.length}/${
            event.maxAttendees
          }`;
        case "minAge":
          if (event.minAge === 0) {
            return "All ages";
          } else {
            return cellValue;
          }
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Edit" placement="left">
                <span
                  className="text-lg text-default-600 cursor-pointer active:opacity-50"
                  onClick={() => {
                    setOldEventId(event.id);
                    setOldEventTitle(event.title);
                    setOldEventDescription(event.description);
                    setOldEventLocation(event.location);
                    setOldEventDate(
                      parseDate(event.date.toString().slice(0, 10)!)
                    );
                    setOldEventMaxAttendees(event.maxAttendees.toString());
                    setOldEventMinAge(event.minAge.toString());
                    editModal.onOpenChange();
                  }}
                >
                  <FaPenToSquare />
                </span>
              </Tooltip>
              <Tooltip content="Delete" color="danger" placement="right">
                <span
                  className="text-xl text-default-600 cursor-pointer active:opacity-50"
                  onClick={() => {
                    handleDeleteEvent(event.id);
                  }}
                >
                  <MdDelete className="text-[#f31260]" />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [user]
  );

  const columns = [
    { key: "title", label: "Event Title", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "location", label: "Location", sortable: true },
    { key: "seats", label: "Available Seats" },
    { key: "minAge", label: "Minimum Age", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <main className="h-screen ">
      <OrganizerNav />
      {user && (
        <>
          <Table
            aria-label="Example table with dynamic content"
            topContent={topContent}
            bottomContent={bottomContent}
            topContentPlacement="outside"
            bottomContentPlacement="outside"
            sortDescriptor={sortDescriptor}
            onSortChange={setSortDescriptor}
            isCompact
            className="px-20 pt-8"
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.key}
                  className="text-sm"
                  allowsSorting={column.sortable}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={sortedItems} emptyContent={"No events found"}>
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    New Event:
                  </ModalHeader>
                  <ModalBody>
                    <div className=" flex flex-row gap-4 my-3">
                      <Input
                        type="text"
                        label="Event Title"
                        isRequired
                        onValueChange={setNewEventTitle}
                      />
                      <DatePicker
                        label="Event Date"
                        onChange={setNewEventDate}
                        maxValue={today(getLocalTimeZone()).add({ years: 1 })}
                        minValue={today(getLocalTimeZone())}
                        isRequired
                        showMonthAndYearPickers
                      />
                    </div>
                    <div className=" flex flex-row gap-4 my-3">
                      <Input
                        type="text"
                        label="Location"
                        isRequired
                        onValueChange={setNewEventLocation}
                      />
                      <Input
                        type="number"
                        label="Minimum Age"
                        min={0}
                        max={150}
                        isRequired
                        onValueChange={setNewEventMinAge}
                      />
                      <Input
                        type="number"
                        label="Max Attendees"
                        min={0}
                        isRequired
                        onValueChange={setNewEventMaxAttendees}
                      />
                    </div>
                    <Textarea
                      label="Description"
                      placeholder="Enter event description"
                      isRequired
                      onValueChange={setNewEventDescription}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      onPress={handleNewEvent}
                      isDisabled={
                        !newEventTitle ||
                        !newEventDescription ||
                        !newEventLocation ||
                        !newEventDate ||
                        !newEventMaxAttendees ||
                        !newEventMinAge
                      }
                    >
                      Save
                    </Button>
                    <Button
                      color="danger"
                      onPress={() => {
                        onClose();
                        setNewEventDate(null);
                        setNewEventDescription("");
                        setNewEventLocation("");
                        setNewEventTitle("");
                        setNewEventMaxAttendees("");
                        setNewEventMinAge("");
                      }}
                    >
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          {events?.map((event: Event) => (
            <Modal
              isOpen={editModal.isOpen}
              key={event.id}
              onOpenChange={editModal.onOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1">
                      Event Details:
                    </ModalHeader>
                    <ModalBody>
                      <div className=" flex flex-row gap-4 my-3">
                        <Input
                          type="text"
                          label="Event Title"
                          value={oldEventTitle}
                          isRequired
                          onValueChange={setOldEventTitle}
                        />
                        <DatePicker
                          label="Event Date"
                          onChange={setOldEventDate}
                          value={oldEventDate}
                          isRequired
                          showMonthAndYearPickers
                        />
                      </div>
                      <div className=" flex flex-row gap-4 my-3">
                        <Input
                          type="text"
                          label="Location"
                          value={oldEventLocation}
                          isRequired
                          onValueChange={setOldEventLocation}
                        />
                        <Input
                          type="number"
                          label="Minimum Age"
                          min={0}
                          max={150}
                          value={oldEventMinAge}
                          isRequired
                          onValueChange={setOldEventMinAge}
                        />
                        <Input
                          type="number"
                          label="Max Attendees"
                          min={0}
                          value={oldEventMaxAttendees}
                          isRequired
                          onValueChange={setOldEventMaxAttendees}
                        />
                      </div>
                      <Textarea
                        label="Description"
                        value={oldEventDescription}
                        isRequired
                        onValueChange={setOldEventDescription}
                      />
                    </ModalBody>
                    <ModalFooter>
                      <Button
                        color="primary"
                        onPress={handleEditEvent}
                        isDisabled={
                          !oldEventTitle ||
                          !oldEventDescription ||
                          !oldEventLocation ||
                          !oldEventDate ||
                          !oldEventMaxAttendees ||
                          !oldEventMinAge
                        }
                      >
                        Save
                      </Button>
                      <Button
                        color="danger"
                        onPress={() => {
                          setOldEventDate(null);
                          setOldEventDescription("");
                          setOldEventLocation("");
                          setOldEventTitle("");
                          setOldEventMaxAttendees("");
                          setOldEventMinAge("");
                          onClose();
                        }}
                      >
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          ))}
        </>
      )}
      {!user && (
        <div className="flex justify-center my-60">
          <Spinner size="lg" />
        </div>
      )}
    </main>
  );
}
