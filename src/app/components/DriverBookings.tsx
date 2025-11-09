import { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import DataTable from "./ui/DataTable";

interface BookingEntry {
  car: string;
  journeyDate: string;
  status: string;
  name: string;
  mobile: string;
  id: string;
}
interface BackendData {
  car?: string;
  dateTime?: string;
  status?: string;
  name?: string;
  mobile?: string;
  id: string;
}

export default function DriverBookings() {
  const cookies = new Cookies();
  const uuid = cookies.get("uuid");
  const role = cookies.get("role");
  const [bookingData, setBookingData] = useState<BookingEntry[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!uuid || !role) return;

        const response = await fetch(
          `/api/bookings?uuid=${uuid}&role=${role}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        const res = await response.json();

        if (!response.ok || !res.success) {
          throw new Error(res.error || "Failed to fetch bookings");
        }

        const bookings = res.data || [];

        const filteredData = bookings.map((item: BackendData) => {
          return {
            car: item?.car || "",
            journeyDate: item?.dateTime || "",
            status: item?.status || "Pending",
            name: item?.name || "",
            mobile: item?.mobile || "",
            id: item?.id,
          } as BookingEntry;
        });

        setBookingData(filteredData);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setBookingData([]);
      }
    };

    fetchData();
  }, [uuid, role]);

  return (
    <div className="px-4 sm:px-6  mt-32 lg:pl-[100px] lg:pr-[80px] w-full bg-transparent">
      <div className="bg-white p-4 border ">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the users in your account including their name,
              title, email and role.
            </p>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <DataTable<BookingEntry>
                data={bookingData}
                columns={[
                  { key: "car", label: "Car" },
                  { key: "journeyDate", label: "Journey Date" },
                  { key: "status", label: "Status" },
                  { key: "name", label: "Name" },
                  { key: "mobile", label: "Mobile Number" },
                ]}
                keyExtractor={(row) => row.id}
                emptyMessage="No bookings found"
                emptyDescription="Your bookings will appear here once you make a reservation."
                actionColumn={(row) => (
                  <a href="#" className="text-indigo-600 hover:text-indigo-900">
                    Edit<span className="sr-only">, {row.name}</span>
                  </a>
                )}
                actionColumnLabel="Actions"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
