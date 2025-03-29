"use client";
import React from "react";
import { Button } from "@/components/shadcn/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 text-center">
        <Image
          src="/unauthorized.svg"
          alt="Unauthorized"
          className="h-56 w-56 object-cover rounded-lg shadow-lg"
          width={224}
          height={224}
        />
        <h1 className="text-3xl font-bold mt-6 text-gray-800">Access Denied</h1>
        <p className="text-gray-600 mt-2">
          You do not have permission to view this page.
        </p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </div>
    </>
  );
};

export default UnauthorizedPage;
