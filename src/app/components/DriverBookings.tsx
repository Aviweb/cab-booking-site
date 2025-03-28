import { useEffect, useState } from "react";
import Cookies from "universal-cookie";

interface BookingEntry {
  car: string;
  journeyDate: string;
  status: string;
  name: string;
  mobile: string;
}
interface BackendData {
  car?: string;
  dateTime?: string; // Assuming it's a date-time string, update to Date if needed
  status?: string;
  name?: string;
  mobile?: string;
}

const columns = [
  { key: "car", label: "Car" },
  { key: "journeyDate", label: "Journey Date" },
  { key: "status", label: "Status" },
  { key: "name", label: "Name" },
  { key: "mobile", label: "Mobile Number" },
];

export default function DriverBookings() {
  const cookies = new Cookies();
  const uuid = cookies.get("uuid");
  const [bookingData, setBookingData] = useState<BookingEntry[]>([]);
  useEffect(() => {
    try {
      const fetchData = async () => {
        // const response = await
        const response = await fetch(`/api/mail?uuid=${uuid}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const res = await response.json();
        console.log("res", res);

        const filteredData = res?.map((item: BackendData) => {
          return {
            car: item?.car,
            journeyDate: item?.dateTime,
            status: item?.status,
            name: item?.name,
            mobile: item?.mobile,
          } as BookingEntry;
        });

        setBookingData(filteredData);
      };
      fetchData();
    } catch (err) {
      console.log("error", err);
    }
  }, [uuid]);

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
              {/* <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Title
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pr-4 pl-3 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {people.map((person) => (
                    <tr key={person.email} className="even:bg-gray-50">
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-3">
                        {person.name}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {person.title}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {person.email}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {person.role}
                      </td>
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table> */}
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="relative py-3.5 pr-4 pl-3 sm:pr-3"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  {bookingData?.map((person) => (
                    <tr key={person.mobile} className="even:bg-gray-50">
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-3 py-4 text-sm whitespace-nowrap text-gray-500"
                        >
                          {person[column.key as keyof BookingEntry]}
                        </td>
                      ))}
                      <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-3">
                        <a
                          href="#"
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit<span className="sr-only">, {person.name}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
