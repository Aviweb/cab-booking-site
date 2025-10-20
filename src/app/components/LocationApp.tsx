"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { MapPin, Loader2, Car, ArrowRight } from "lucide-react";
import { Button } from "@/components/shadcn/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/shadcn/ui/alert";
import { Input } from "@/components/shadcn/ui/input";
import { Label } from "@/components/shadcn/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shadcn/ui/tabs";
import { Separator } from "@/components/shadcn/ui/separator";
import CustomDropDown from "./formComponents/CustomDropDown";

interface RouteInfo {
  distance: number; // in meters
  duration: number; // in seconds
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  geometry?: any; // route geometry
}
interface props {
  mode?: string;
}
export default function LocationApp({ mode }: props) {
  // const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(
  //   null
  // );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [location, setLocation] = useState<any>(null);
  const locations = [
    { id: 1, name: "Mumbai", latitude: 19.07609, longitude: 72.877426 },
    { id: 2, name: "Delhi", latitude: 28.70406, longitude: 77.102493 },
    { id: 3, name: "Bengaluru", latitude: 12.971599, longitude: 77.594566 },
    { id: 4, name: "Hyderabad", latitude: 17.385044, longitude: 78.486671 },
    { id: 5, name: "Chennai", latitude: 13.08268, longitude: 80.270721 },
    { id: 6, name: "Kolkata", latitude: 22.572645, longitude: 88.363892 },
    { id: 7, name: "Ahmedabad", latitude: 23.022505, longitude: 72.571365 },
    { id: 8, name: "Pune", latitude: 18.52043, longitude: 73.856743 },
    { id: 9, name: "Jaipur", latitude: 26.912434, longitude: 75.787271 },
    { id: 10, name: "Lucknow", latitude: 26.846695, longitude: 80.946167 },
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [secondLocation, setSecondLocation] = useState<any>(null);
  const [mapLink, setMapLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [routeLoading, setRouteLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [straightDistance, setStraightDistance] = useState<number | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [routePoints, setRoutePoints] = useState<Array<[number, number]>>([]);

  const getLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
        setLoading(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("User denied the request for Geolocation");
            break;
          case error.POSITION_UNAVAILABLE:
            setError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setError("The request to get user location timed out");
            break;
          default:
            setError("An unknown error occurred");
            break;
        }
        setLoading(false);
      }
    );
  };

  const parseGoogleMapsLink = (link: string) => {
    setLinkLoading(true);
    setLinkError(null);

    try {
      // Try to extract coordinates from the URL
      let latitude, longitude;

      // Handle @latitude,longitude format
      const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        latitude = Number.parseFloat(atMatch[1]);
        longitude = Number.parseFloat(atMatch[2]);
      }
      // Handle ?q=latitude,longitude format
      else if (link.includes("?q=")) {
        const qMatch = link.match(/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (qMatch) {
          latitude = Number.parseFloat(qMatch[1]);
          longitude = Number.parseFloat(qMatch[2]);
        }
      }
      // Handle ?ll=latitude,longitude format
      else if (link.includes("?ll=")) {
        const llMatch = link.match(/\?ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (llMatch) {
          latitude = Number.parseFloat(llMatch[1]);
          longitude = Number.parseFloat(llMatch[2]);
        }
      }

      if (
        latitude &&
        longitude &&
        !isNaN(latitude) &&
        !isNaN(longitude) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
      ) {
        const newSecondLocation = { latitude, longitude };
        setSecondLocation(newSecondLocation);

        setLinkLoading(false);
        return true;
      } else {
        setLinkError("Could not extract valid coordinates from the link");
        setLinkLoading(false);
        return false;
      }
    } catch (err) {
      console.log("error", err);

      setLinkError("Failed to parse Google Maps link");
      setLinkLoading(false);
      return false;
    }
  };

  // Haversine formula to calculate straight-line distance between two points on Earth
  const calculateStraightDistance = (
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number => {
    const R = 6371; // Earth's radius in km

    const dLat = ((point2.latitude - point1.latitude) * Math.PI) / 180;
    const dLng = ((point2.longitude - point1.longitude) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((point1.latitude * Math.PI) / 180) *
        Math.cos((point2.latitude * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };

  // Fetch road distance using OpenStreetMap's OSRM API
  const fetchRouteInfo = async (
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }
  ) => {
    setRouteLoading(true);
    setRouteError(null);
    setRouteInfo(null);
    setRoutePoints([]);

    try {
      // OSRM API expects coordinates in the format: longitude,latitude
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== "Ok") {
        throw new Error(data.message || "Failed to calculate route");
      }

      const route = data.routes[0];

      // Extract route information
      const routeData: RouteInfo = {
        distance: route.distance / 1000, // Convert to kilometers
        duration: route.duration, // In seconds
        geometry: route.geometry,
      };

      setRouteInfo(routeData);

      // Extract route points for drawing
      if (route.geometry && route.geometry.coordinates) {
        setRoutePoints(route.geometry.coordinates);
      }

      setRouteLoading(false);
    } catch (err) {
      console.error("Error fetching route:", err);
      setRouteError(
        "Failed to calculate road distance. The locations might be too far apart or not connected by roads."
      );
      setRouteLoading(false);
    }
  };

  const handleSubmitLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (mapLink.trim()) {
      parseGoogleMapsLink(mapLink);
    } else {
      setLinkError("Please enter a Google Maps link");
    }
  };

  // Format duration in seconds to a human-readable format
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    } else {
      return `${minutes} min`;
    }
  };

  useEffect(() => {
    if (location && secondLocation) {
      console.log("");

      setStraightDistance(calculateStraightDistance(location, secondLocation));
      fetchRouteInfo(location, secondLocation);
    }
  }, [location, secondLocation]);

  return (
    <div className="flex  items-start justify-center bg-gray-50 p-4">
      <Card
        className={` w-full ${
          mode === "homescreen" ? "max-w-full border-none bg-transparent" : ""
        }`}
      >
        <CardHeader className="flex items-center">
          <CardTitle className="flex items-center gap-2 text-center">
            <MapPin className="h-5 w-5 text-primary" />
            Location Distance Calculator
          </CardTitle>
          <CardDescription className="text-center">
            Calculate road distance between your starting location and
            destination
          </CardDescription>
        </CardHeader>
        <CardContent
          className={`space-y-4  ${
            mode === "homescreen"
              ? "md:flex justify-between md:space-x-10 md:pl-28"
              : ""
          } w-full`}
        >
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="">
            <div className="">
              <p>Starting Point</p>
              <CustomDropDown
                dropDownOptions={locations}
                selected={location}
                setSelected={setLocation}
              />
              <p className="text-center my-2">Or</p>
              <Button
                onClick={getLocation}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Getting location...
                  </>
                ) : (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    {location ? "Use current location" : "Get my location"}
                  </>
                )}
              </Button>

              <div className="mt-2 rounded-md bg-muted p-3">
                <p className="text-sm font-medium">Your coordinates:</p>
                <p className="mt-1 font-mono text-xs">
                  Latitude: {location ? location.latitude.toFixed(6) : "-"}
                </p>
                <p className="font-mono text-xs">
                  Longitude: {location ? location.longitude.toFixed(6) : "-"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p>Destination</p>
              <CustomDropDown
                dropDownOptions={locations}
                selected={secondLocation}
                setSelected={setSecondLocation}
              />
              <p className="text-center my-2">Or</p>
              <form onSubmit={handleSubmitLink}>
                <Label htmlFor="map-link">Share Google Maps Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="map-link"
                    value={mapLink}
                    onChange={(e) => setMapLink(e.target.value)}
                    placeholder="Paste Google Maps link here"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={linkLoading || !mapLink.trim()}
                  >
                    {linkLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Parse"
                    )}
                  </Button>
                </div>
              </form>
              {linkError && (
                <p className="text-xs text-destructive">{linkError}</p>
              )}

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">Destination coordinates:</p>
                <p className="mt-1 font-mono text-xs">
                  Latitude:{" "}
                  {secondLocation ? secondLocation.latitude.toFixed(6) : "-"}
                </p>
                <p className="font-mono text-xs">
                  Longitude:{" "}
                  {secondLocation ? secondLocation.longitude.toFixed(6) : "-"}
                </p>
              </div>
            </div>
          </div>

          {location && secondLocation && (
            <div className="space-y-4 w-full">
              <Tabs defaultValue="road" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="road">
                    <Car className="mr-2 h-4 w-4" />
                    Road Distance
                  </TabsTrigger>
                  <TabsTrigger value="straight">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Straight Line
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="road" className="space-y-4">
                  {routeLoading ? (
                    <div className="flex items-center justify-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2">Calculating road distance...</span>
                    </div>
                  ) : routeError ? (
                    <Alert variant="destructive">
                      <AlertTitle>Route Error</AlertTitle>
                      <AlertDescription>{routeError}</AlertDescription>
                    </Alert>
                  ) : routeInfo ? (
                    <div className="rounded-md border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Road Distance</h3>
                          <p className="text-2xl font-bold">
                            {routeInfo.distance.toFixed(2)} km
                          </p>
                          <p className="text-sm text-muted-foreground">
                            ({(routeInfo.distance * 0.621371).toFixed(2)} miles)
                          </p>
                        </div>
                        <Separator orientation="vertical" className="h-12" />
                        <div>
                          <h3 className="font-medium">Driving Time</h3>
                          <p className="text-2xl font-bold">
                            {formatDuration(routeInfo.duration)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </TabsContent>

                <TabsContent value="straight">
                  {straightDistance !== null && (
                    <div className="rounded-md border p-4">
                      <h3 className="font-medium">Straight Line Distance</h3>
                      <p className="text-2xl font-bold">
                        {straightDistance.toFixed(2)} km
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ({(straightDistance * 0.621371).toFixed(2)} miles)
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <div className="aspect-video overflow-hidden rounded-md border">
                <LocationMap
                  userLocation={location}
                  destinationLocation={secondLocation}
                  routePoints={routePoints}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface LocationMapProps {
  userLocation: { latitude: number; longitude: number } | null;
  destinationLocation: { latitude: number; longitude: number } | null;
  routePoints?: Array<[number, number]>;
}

function LocationMap({
  userLocation,
  destinationLocation,
  routePoints = [],
}: LocationMapProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // Draw a simple map representation on canvas
    const canvas = document.getElementById("map-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Draw map background
    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw some map-like elements
    ctx.strokeStyle = "#d1d5db";
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * (canvas.height / 10));
      ctx.lineTo(canvas.width, i * (canvas.height / 10));
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(i * (canvas.width / 10), 0);
      ctx.lineTo(i * (canvas.width / 10), canvas.height);
      ctx.stroke();
    }

    // Calculate positions for markers
    let userX = canvas.width / 4;
    let userY = canvas.height / 2;
    let destX = (canvas.width / 4) * 3;
    let destY = canvas.height / 2;

    // If we have route points, draw the route
    if (routePoints.length > 0 && userLocation && destinationLocation) {
      // Simple projection of geo coordinates to canvas
      // This is a very basic projection and won't be accurate for large distances
      const minLng = Math.min(
        ...routePoints.map((p) => p[0]),
        userLocation.longitude,
        destinationLocation.longitude
      );
      const maxLng = Math.max(
        ...routePoints.map((p) => p[0]),
        userLocation.longitude,
        destinationLocation.longitude
      );
      const minLat = Math.min(
        ...routePoints.map((p) => p[1]),
        userLocation.latitude,
        destinationLocation.latitude
      );
      const maxLat = Math.max(
        ...routePoints.map((p) => p[1]),
        userLocation.latitude,
        destinationLocation.latitude
      );

      const lngRange = maxLng - minLng;
      const latRange = maxLat - minLat;

      // Add some padding
      const padding = 20;

      // Project coordinates to canvas
      const projectToCanvas = (longitude: number, latitude: number) => {
        const x =
          ((longitude - minLng) / lngRange) * (canvas.width - padding * 2) +
          padding;
        const y =
          canvas.height -
          (((latitude - minLat) / latRange) * (canvas.height - padding * 2) +
            padding);
        return { x, y };
      };

      // Project user and destination locations
      const userPos = projectToCanvas(
        userLocation.longitude,
        userLocation.latitude
      );
      const destPos = projectToCanvas(
        destinationLocation.longitude,
        destinationLocation.latitude
      );

      userX = userPos.x;
      userY = userPos.y;
      destX = destPos.x;
      destY = destPos.y;

      // Draw the route
      ctx.beginPath();
      const start = projectToCanvas(routePoints[0][0], routePoints[0][1]);
      ctx.moveTo(start.x, start.y);

      for (let i = 1; i < routePoints.length; i++) {
        const point = projectToCanvas(routePoints[i][0], routePoints[i][1]);
        ctx.lineTo(point.x, point.y);
      }

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (userLocation && destinationLocation) {
      // If no route points but we have both locations, draw a straight line
      ctx.beginPath();
      ctx.moveTo(userX, userY);
      ctx.lineTo(destX, destY);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw user location marker if available
    if (userLocation) {
      // Draw pin shadow
      ctx.beginPath();
      ctx.arc(userX, userY + 2, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();

      // Draw pin
      ctx.beginPath();
      ctx.arc(userX, userY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw inner circle
      ctx.beginPath();
      ctx.arc(userX, userY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Draw label
      ctx.fillStyle = "#1f2937";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("You", userX, userY + 20);
    }

    // Draw destination location marker if available
    if (destinationLocation) {
      // Draw pin shadow
      ctx.beginPath();
      ctx.arc(destX, destY + 2, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();

      // Draw pin
      ctx.beginPath();
      ctx.arc(destX, destY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw inner circle
      ctx.beginPath();
      ctx.arc(destX, destY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // Draw label
      ctx.fillStyle = "#1f2937";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Destination", destX, destY + 20);
    }

    setMapLoaded(true);
  }, [userLocation, destinationLocation, routePoints]);

  return (
    <div className="relative h-full w-full">
      <canvas id="map-canvas" className="h-full w-full"></canvas>
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}
      <div className="absolute bottom-2 right-2 rounded-md bg-white px-2 py-1 text-xs text-muted-foreground shadow-sm">
        {userLocation && destinationLocation
          ? routePoints.length > 0
            ? "Road route available"
            : "Straight line distance"
          : userLocation
          ? `Your location: ${userLocation.latitude.toFixed(
              4
            )}, ${userLocation.longitude.toFixed(4)}`
          : destinationLocation
          ? `Destination: ${destinationLocation.latitude.toFixed(
              4
            )}, ${destinationLocation.longitude.toFixed(4)}`
          : "No locations selected"}
      </div>
    </div>
  );
}
