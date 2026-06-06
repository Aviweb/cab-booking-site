import { useEffect, useState } from "react";
import DataTable from "./ui/DataTable";
import useAuth from "@/hooks/useAuth";

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
  passengerName?: string;
  mobile?: string;
  id: string;
  startLocation?: string;
  endLocation?: string;
}

export default function DriverBookings() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [bookingData, setBookingData] = useState<BookingEntry[]>([]);
  
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching data", user?.userId, user?.role);
      try {
        if (!isAuthenticated || !user?.userId || !user?.role) return;

        const response = await fetch(
          `/api/bookings`, // No query params needed - uses authentication middleware
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
          // Convert enum status to readable format
          const statusMap: Record<string, string> = {
            'PENDING': 'Pending',
            'ACCEPTED': 'Accepted',
            'REJECTED': 'Rejected',
            'COMPLETED': 'Completed',
            'CANCELLED': 'Cancelled'
          };

          return {
            car: item?.car || "",
            journeyDate: item?.dateTime || "",
            status: statusMap[item?.status || 'PENDING'] || 'Pending',
            name: item?.passengerName || "", // Use correct field name
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
  }, [user?.userId, user?.role, isAuthenticated]);

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="px-4 sm:px-6 mt-32 lg:pl-[100px] lg:pr-[80px] w-full bg-transparent">
        <div className="bg-white p-8 border rounded-lg text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="px-4 sm:px-6 mt-32 lg:pl-[100px] lg:pr-[80px] w-full bg-transparent">
        <div className="bg-white p-8 border rounded-lg text-center">
          <p className="text-gray-600">Please log in to view your bookings.</p>
        </div>
      </div>
    );
  }

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
