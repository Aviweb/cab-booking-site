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
  const [startMapLink, setStartMapLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [linkLoading, setLinkLoading] = useState(false);
  const [startLinkLoading, setStartLinkLoading] = useState(false);
  const [startLinkError, setStartLinkError] = useState<string | null>(null);
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

  const parseGoogleMapsLink = (
    link: string,
    isStartLocation: boolean = false
  ) => {
    if (isStartLocation) {
      setStartLinkLoading(true);
      setStartLinkError(null);
    } else {
      setLinkLoading(true);
      setLinkError(null);
    }

    try {
      let latitude, longitude;

      const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        latitude = Number.parseFloat(atMatch[1]);
        longitude = Number.parseFloat(atMatch[2]);
      } else if (link.includes("?q=")) {
        const qMatch = link.match(/\?q=(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (qMatch) {
          latitude = Number.parseFloat(qMatch[1]);
          longitude = Number.parseFloat(qMatch[2]);
        }
      } else if (link.includes("?ll=")) {
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
        const newLocation = { latitude, longitude };
        if (isStartLocation) {
          setLocation(newLocation);
          setStartLinkLoading(false);
        } else {
          setSecondLocation(newLocation);
          setLinkLoading(false);
        }
        return true;
      } else {
        const errorMsg = "Could not extract valid coordinates from the link";
        if (isStartLocation) {
          setStartLinkError(errorMsg);
          setStartLinkLoading(false);
        } else {
          setLinkError(errorMsg);
          setLinkLoading(false);
        }
        return false;
      }
    } catch {
      const errorMsg = "Failed to parse Google Maps link";
      if (isStartLocation) {
        setStartLinkError(errorMsg);
        setStartLinkLoading(false);
      } else {
        setLinkError(errorMsg);
        setLinkLoading(false);
      }
      return false;
    }
  };

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

  const fetchRouteInfo = async (
    start: { latitude: number; longitude: number },
    end: { latitude: number; longitude: number }
  ) => {
    setRouteLoading(true);
    setRouteError(null);
    setRouteInfo(null);
    setRoutePoints([]);

    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?overview=full&geometries=geojson`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.code !== "Ok") {
        throw new Error(data.message || "Failed to calculate route");
      }

      const route = data.routes[0];

      const routeData: RouteInfo = {
        distance: route.distance / 1000,
        duration: route.duration,
        geometry: route.geometry,
      };

      setRouteInfo(routeData);

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
      parseGoogleMapsLink(mapLink, false);
    } else {
      setLinkError("Please enter a Google Maps link");
    }
  };

  const handleSubmitStartLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (startMapLink.trim()) {
      parseGoogleMapsLink(startMapLink, true);
    } else {
      setStartLinkError("Please enter a Google Maps link");
    }
  };

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
        <CardContent className="space-y-4 w-full">
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div
            className={
              mode === "homescreen" ? "md:flex md:space-x-6 md:items-start" : ""
            }
          >
            <div className={mode === "homescreen" ? "md:flex-1" : ""}>
              <p>Starting Point</p>
              <CustomDropDown
                dropDownOptions={locations}
                selected={location}
                setSelected={setLocation}
              />
              <p className="text-center my-2">Or</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={getLocation}
                  disabled={loading}
                  className="w-full sm:flex-1"
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
                <form
                  onSubmit={handleSubmitStartLink}
                  className="w-full sm:flex-1 flex gap-2"
                >
                  <Input
                    id="start-map-link"
                    value={startMapLink}
                    onChange={(e) => setStartMapLink(e.target.value)}
                    placeholder="Paste Google Maps link"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={startLinkLoading || !startMapLink.trim()}
                  >
                    {startLinkLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Parse"
                    )}
                  </Button>
                </form>
              </div>
              {startLinkError && (
                <p className="text-xs text-destructive">{startLinkError}</p>
              )}

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

            <div
              className={`space-y-2 ${
                mode === "homescreen" ? "md:flex-1 mt-4 md:mt-0" : ""
              }`}
            >
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
    const canvas = document.getElementById("map-canvas") as HTMLCanvasElement;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = "#e5e7eb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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

    let userX = canvas.width / 4;
    let userY = canvas.height / 2;
    let destX = (canvas.width / 4) * 3;
    let destY = canvas.height / 2;

    if (routePoints.length > 0 && userLocation && destinationLocation) {
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
      const padding = 20;

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
      ctx.beginPath();
      ctx.moveTo(userX, userY);
      ctx.lineTo(destX, destY);
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (userLocation) {
      ctx.beginPath();
      ctx.arc(userX, userY + 2, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(userX, userY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#ef4444";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(userX, userY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      ctx.fillStyle = "#1f2937";
      ctx.font = "10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("You", userX, userY + 20);
    }

    if (destinationLocation) {
      ctx.beginPath();
      ctx.arc(destX, destY + 2, 8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(destX, destY, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#3b82f6";
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(destX, destY, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

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
