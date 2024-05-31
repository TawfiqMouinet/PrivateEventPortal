import {
  Button,
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableCell,
  TableColumn,
  SortDescriptor,
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
  DateInput,
  Spinner,
} from "@nextui-org/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiurl } from "@/context/apiURL";
import OrganizerNav from "@/components/OrganizerNav";
import { useUserContext } from "@/hooks/useUserContext";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";
import { FaPenToSquare } from "react-icons/fa6";
import { MdCancel } from "react-icons/md";
import { IoEyeOutline, IoSearch } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import toast from "react-hot-toast";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await fetch(`http://localhost:4000/api/events/get`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  const data = await res.json();
  console.log("Events: ", data);
  return { props: { events: data } };
}

export default function Events({
  events,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  type Event = (typeof events)[0];
  type Registration = (typeof events.registrations)[0];
  const { user } = useUserContext();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const detailsModal = useDisclosure();
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

  function calculate_age(dob: Date) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }

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
  async function handleNewReg(event: Event) {
    const age = calculate_age(new Date(user?.dob!));
    if (age < event.minAge) {
      toast("You are not eligible for this event!", { icon: "❌" });
      return;
    }
    if (event.registrations.length >= event.maxAttendees) {
      toast("Event is full!", { icon: "❌" });
      return;
    }
    const res = await fetch(`${apiurl}/api/registrations/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        event: event,
      }),
    });
    if (res.ok) {
      router.replace(router.asPath);
      toast("Registered successfully!", { icon: "✔️" });
    } else {
      toast("Failed to register.", { icon: "❌" });
    }
  }
  async function handleDeleteReg(regId: string) {
    const res = await fetch(`${apiurl}/api/registrations/delete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        regId: regId,
      }),
    });
    if (res.ok) {
      router.replace(router.asPath);
      toast("Cancelled successfully!", { icon: "✔️" });
    } else {
      toast("Failed to cancel.", { icon: "❌" });
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
      const existingReg = event.registrations.find(
        (r: Registration) => r.user.id === user?.id
      );
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
            <>
              <div className="relative flex items-center gap-2">
                <Tooltip content="Details" placement="left">
                  <span
                    className="text-xl text-default-600 cursor-pointer active:opacity-50"
                    onClick={() => {
                      setOldEventTitle(event.title);
                      setOldEventDescription(event.description);
                      setOldEventLocation(event.location);
                      setOldEventDate(
                        parseDate(event.date.toString().slice(0, 10)!)
                      );
                      setOldEventMaxAttendees(event.maxAttendees.toString());
                      setOldEventMinAge(event.minAge.toString());
                      detailsModal.onOpenChange();
                    }}
                  >
                    <IoEyeOutline />
                  </span>
                </Tooltip>
                {!existingReg && (
                  <Tooltip content="Register" placement="right">
                    <span
                      className="text-lg text-default-600 cursor-pointer active:opacity-50"
                      onClick={() => handleNewReg(event)}
                    >
                      <FaPenToSquare />
                    </span>
                  </Tooltip>
                )}
                {existingReg && (
                  <Tooltip color="danger" content="Cancel" placement="right">
                    <span
                      className="text-xl text-danger cursor-pointer active:opacity-50"
                      onClick={() => {
                        handleDeleteReg(existingReg.id);
                      }}
                    >
                      <MdCancel />
                    </span>
                  </Tooltip>
                )}
              </div>
            </>
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
                        min={1}
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
                        onClose;
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
              isOpen={detailsModal.isOpen}
              key={event.id}
              onOpenChange={detailsModal.onOpenChange}
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
                          isReadOnly
                        />
                        <DateInput
                          label="Event Date"
                          value={oldEventDate}
                          isReadOnly
                        />
                      </div>
                      <div className=" flex flex-row gap-4 my-3">
                        <Input
                          type="text"
                          label="Location"
                          value={oldEventLocation}
                          isReadOnly
                        />
                        <Input
                          type="number"
                          label="Minimum Age"
                          min={0}
                          max={150}
                          value={oldEventMinAge}
                          isReadOnly
                        />
                        <Input
                          type="number"
                          label="Max Attendees"
                          min={0}
                          value={oldEventMaxAttendees}
                          isReadOnly
                        />
                      </div>
                      <Textarea
                        label="Description"
                        value={oldEventDescription}
                        isReadOnly
                      />
                    </ModalBody>
                    <ModalFooter>
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
