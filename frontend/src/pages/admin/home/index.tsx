import AdminNav from "@/components/AdminNav";
import { apiurl } from "@/context/apiURL";
import { useUserContext } from "@/hooks/useUserContext";
import {
  Pagination,
  SortDescriptor,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
} from "@nextui-org/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { IoEyeOutline, IoSearch } from "react-icons/io5";
import { MdCancel, MdCheck } from "react-icons/md";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const res = await fetch(`${apiurl}/api/docs/get`, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: context.req.headers.cookie!,
    },
  });
  if (res.status === 405 || res.status === 403) {
    return {
      props: {
        docs: [],
      },
    };
  }
  const data = await res.json();
  return { props: { docs: data } };
}

export default function AdminHome({
  docs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const { user } = useUserContext();
  type Document = (typeof docs)[0];
  const [filterValue, setFilterValue] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "date",
    direction: "ascending",
  });
  const [page, setPage] = useState(1);
  const pages = Math.ceil(docs.length / rowsPerPage);
  const hasSearchFilter = Boolean(filterValue);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function calculate_age(dob: Date) {
    var diff_ms = Date.now() - dob.getTime();
    var age_dt = new Date(diff_ms);
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  }
  async function handleVerification(doc: Document) {
    const res = await fetch(`${apiurl}/api/auth/verify`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: doc.user.id,
      }),
    });
    if (res.ok) {
      handleRejection(doc.id);
      router.replace(router.asPath);
      toast("User Verified", { icon: "✔️" });
    } else {
      toast("Failed to Verify User", { icon: "❌" });
    }
  }
  async function handleRejection(docId: string) {
    const res = await fetch(`${apiurl}/api/docs/delete`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        docId: docId,
      }),
    });
    if (res.ok) {
      toast("Document Deleted", { icon: "✔️" });
      router.replace(router.asPath);
    } else {
      toast("Failed to Delete Document", { icon: "❌" });
    }
  }

  const filteredItems = useMemo(() => {
    let filtereddocs = [...docs];

    if (hasSearchFilter) {
      filtereddocs = filtereddocs.filter((doc) =>
        doc.user.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filtereddocs;
  }, [docs, filterValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);
  const sortedItems = useMemo(() => {
    return [...items].sort((a: Document, b: Document) => {
      const first = a[sortDescriptor.column as keyof Document] as number;
      const second = b[sortDescriptor.column as keyof Document] as number;
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
            placeholder="Search by user name..."
            size="sm"
            startContent={<IoSearch className="text-default-500 text-lg" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {docs.length} docs
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
    docs.length,
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

  const renderCell = useCallback((doc: Document, columnKey: React.Key) => {
    const cellValue = doc[columnKey as keyof Document];

    switch (columnKey) {
      case "name":
        return doc.user.name;

      case "email":
        return doc.user.email;
      case "age":
        return calculate_age(new Date(doc.user.dob));
      case "actions":
        return (
          <>
            <div className="relative flex items-center gap-2">
              <Tooltip
                color="primary"
                content="View Document"
                placement="left"
                classNames={{ base: "pointer-events-none" }}
              >
                <span
                  className="text-xl text-primary cursor-pointer active:opacity-50"
                  onClick={() => {
                    onOpenChange();
                  }}
                >
                  <IoEyeOutline />
                </span>
              </Tooltip>
              <Tooltip
                color="success"
                content="Verify"
                placement="top"
                classNames={{
                  content: ["text-white"],
                  base: "pointer-events-none",
                }}
              >
                <span
                  className="text-xl text-success cursor-pointer active:opacity-50"
                  onClick={() => {
                    handleVerification(doc);
                  }}
                >
                  <MdCheck />
                </span>
              </Tooltip>
              <Tooltip
                color="danger"
                content="Reject"
                placement="right"
                classNames={{ base: "pointer-events-none" }}
              >
                <span
                  className="text-xl text-danger cursor-pointer active:opacity-50"
                  onClick={() => {
                    handleRejection(doc.id);
                  }}
                >
                  <MdCancel />
                </span>
              </Tooltip>
            </div>
          </>
        );
      default:
        return cellValue;
    }
  }, []);

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <main className="h-screen ">
      <AdminNav />
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
        <TableBody items={sortedItems} emptyContent={"No Users Found"}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {docs?.map((doc: Document) => (
        <Modal isOpen={isOpen} key={doc.id} onOpenChange={onOpenChange}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {doc.user.name}
                  {"'s Document:"}
                </ModalHeader>
                <ModalBody>
                  <Image
                    src={doc.url}
                    alt="Can't Display Document!"
                    width={640}
                    height={480}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    onPress={() => {
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
    </main>
  );
}
