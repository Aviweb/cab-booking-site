"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PriceCard from "./PriceCard";
export interface RoutesProps {
  startLoc?: string;
  endLoc?: string;
  sedan?: number;
  suv?: number;
  traveller?: number;
}
const RouteScreen = () => {
  const routes: RoutesProps[] = [
    {
      startLoc: "Chandigarh",
      endLoc: "Delhi",
      sedan: 3500,
      suv: 4500,
      traveller: 7500,
    },
    {
      startLoc: "Amritsar",
      endLoc: "Chandigarh",
      sedan: 3500,
      suv: 4500,
      traveller: 7500,
    },
    {
      startLoc: "Jammu",
      endLoc: "Delhi",
      sedan: 1000,
      suv: 1300,
      traveller: 18000,
    },
    {
      startLoc: "Jammu",
      endLoc: "Chandigarh",
      sedan: 6000,
      suv: 7500,
      traveller: 12500,
    },
    {
      startLoc: "Manali",
      endLoc: "Delhi",
      sedan: 10000,
      suv: 14000,
      traveller: 19000,
    },
    {
      startLoc: "Shimla",
      endLoc: "Delhi",
      sedan: 3500,
      suv: 5500,
      traveller: 7500,
    },
    {
      startLoc: "Manali",
      endLoc: "Chandigarh",
      sedan: 4500,
      suv: 6500,
      traveller: 10000,
    },
  ];
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <section id="routes" className="w-full bg-charade-500 pt-8 pb-14">
      <span className="block text-center text-4xl text-white font-bold">
        Popular Routes
      </span>
      <span className="block text-center text-charade-200 my-5 text-xl">
        One Way
      </span>
      <div className="w-full px-8">
        <Slider {...settings}>
          {routes.map((route: RoutesProps, index) => (
            <PriceCard key={index} route={route} />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default RouteScreen;
