"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/ui/button";
import DataTable from "./ui/DataTable";

interface Booking {
  id: string;
  car: string;
  dateTime: string;
  status: string;
  name: string;
  mobile: string;
  startLoc: string;
  endLoc: string;
  driverId?: string | null;
  driverName?: string | null;
}

export default function BookingRequests() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingBookings();
  }, []);

  const fetchPendingBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/bookings/pending");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch bookings");
      }

      setBookings(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch bookings");
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    bookingId: string,
    status: "Accepted" | "Rejected"
  ) => {
    try {
      setUpdating(bookingId);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update booking");
      }

      await fetchPendingBookings();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update booking");
      console.error("Error updating booking:", err);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 mt-32 lg:pl-[100px] lg:pr-[80px] w-full bg-transparent">
        <div className="bg-white p-8 border rounded-lg text-center">
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 mt-32 lg:pl-[100px] lg:pr-[80px] w-full bg-transparent">
        <div className="bg-white p-8 border rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchPendingBookings}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 mt-32 lg:pl-[100px] lg:pr-[80px] w-full bg-transparent">
      <div className="bg-white p-4 border rounded-lg">
        <div className="sm:flex sm:items-center mb-6">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">
              Booking Requests
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              View and manage pending booking requests from passengers.
            </p>
          </div>
        </div>

        <DataTable<Booking>
          data={bookings}
          columns={[
            { key: "name", label: "Passenger Name" },
            { key: "mobile", label: "Mobile" },
            { key: "car", label: "Car" },
            { key: "startLoc", label: "From" },
            { key: "endLoc", label: "To" },
            {
              key: "dateTime",
              label: "Date & Time",
              render: (value) => new Date(value as string).toLocaleString(),
            },
            {
              key: "status",
              label: "Status",
              render: (value) => {
                const status = value as string;
                return (
                  <span
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {status}
                  </span>
                );
              },
            },
          ]}
          keyExtractor={(row) => row.id}
          emptyMessage="No pending booking requests"
          emptyDescription="New booking requests will appear here"
          actionColumn={(row) =>
            row.status === "Pending" ? (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleStatusUpdate(row.id, "Accepted")}
                  disabled={updating === row.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updating === row.id ? "..." : "Accept"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate(row.id, "Rejected")}
                  disabled={updating === row.id}
                >
                  {updating === row.id ? "..." : "Reject"}
                </Button>
              </div>
            ) : null
          }
          actionColumnLabel="Actions"
        />
      </div>
    </div>
  );
}
