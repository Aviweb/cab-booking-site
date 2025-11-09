"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/ui/button";

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

      // Refresh bookings list
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

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No pending booking requests</p>
            <p className="text-gray-400 text-sm mt-2">
              New booking requests will appear here
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Passenger Name
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Mobile
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Car
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    From
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    To
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Date & Time
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="even:bg-gray-50">
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-900">
                      {booking.name}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {booking.mobile}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {booking.car}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {booking.startLoc}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {booking.endLoc}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                      {new Date(booking.dateTime).toLocaleString()}
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          booking.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : booking.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 text-sm whitespace-nowrap">
                      {booking.status === "Pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "Accepted")
                            }
                            disabled={updating === booking.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {updating === booking.id ? "..." : "Accept"}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "Rejected")
                            }
                            disabled={updating === booking.id}
                          >
                            {updating === booking.id ? "..." : "Reject"}
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
