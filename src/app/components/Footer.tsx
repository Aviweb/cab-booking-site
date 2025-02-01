"use client";
import React from "react";
import { Button } from "@/components/shadcn/ui/button";
import "@fontsource/space-grotesk";
import {
  FaCopyright,
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaPhoneAlt,
  FaTwitter,
  FaUser,
} from "react-icons/fa";

interface props {
  className?: string;
}

export default function Footer({ className }: props) {
  return (
    <>
      <div className={` w-full mt-4 lg:mt-20 ${className}`}>
        <div>
          {/* Help Section */}
          <div className="w-full px-4 lg:px-[124px]  2xl:w-[1245px] 2xl:mx-auto 2xl:px-0 translate-y-10">
            <div className="bg-mustard-500 px-4 lg:pl-[62px] lg:pr-20 lg:flex  relative py-6 lg:pt-[40px] lg:pb-[40px] clip-path-bottomRightFooterMobile lg:clip-path-bottomRightTool">
              {/* Left part */}
              <div className="mid:w-[438px] mt-5">
                <p className="font-spaceGrotesk font-normal  text-mobile-h3 lg:text-[40px] mid:text-web-h2 leading-[30px] lg:leading-[59px] text-brand-textBlack ">
                  NEED HELP IN BOOKING OR FINDING US?
                </p>
              </div>
              {/* Right part */}
              <div className="flex-1 mt-3 lg:mt-0 lg:ml-8 mid:ml-[73px]">
                <p className="font-openSans font-normal text-mobile-body-sm lg:text-web-body-lg leading-4 lg:leading-[21px] text-brand-textLightGrey">
                  {`Get a cab instantly with just a tap! Our fast and reliable service ensures you reach your destination comfortably and on time. All rides include real-time tracking, emergency assistance, and driver verification to ensure your security.`}
                </p>
                <div className="mt-5 lg:mt-[40px] flex gap-6 mobile:gap-4">
                  <Button
                    onClick={() =>
                      window.open(
                        "https://wa.me/+917906217117?text=Hello%20there!",
                        "_blank"
                      )
                    }
                    className="h-9 w-[130px]  mobile:w-[170px] lg:h-auto lg:w-auto lg:px-14 lg:py-2.5 bg-charade-600"
                  >
                    <p className="font-openSans font-semibold text-mobile-body-sm lg:text-web-body-lg leading-4 lg:leading-7 text-white">
                      Talk to our expert
                    </p>
                  </Button>
                  <Button
                    onClick={() =>
                      window.open(
                        "https://wa.me/+917906217117?text=Hello%20there!",
                        "_blank"
                      )
                    }
                    className="h-9 lg:h-auto w-[90px] mobile:w-[111px] lg:w-auto lg:px-14 lg:py-2.5 bg-charade-600 border lg:border-none border-brand-textLightGrey"
                  >
                    <p className="font-openSans font-semibold text-mobile-body-sm lg:text-web-body-lg leading-4 lg:leading-7 text-[#A8A8A8] lg:text-white ">
                      Chat Now
                    </p>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-charade-500">
            <div className=" py-4 flex flex-col md:flex-row justify-around pt-[78px] pb-7 lg:pt-[95px] lg:pb-[2px]">
              <div className="px-2 flex justify-center flex-col items-center">
                <span className="text-charade-100 block my-2 text-center md:text-left">
                  Contact Us
                </span>
                <div className="inline-block">
                  <span className="text-[#d5d5d1] font-bold text-xl block mb-2">
                    <FaUser className="inline -mt-1 mr-2" /> Avi Rajput
                  </span>
                  <span className="text-[#d5d5d1] text-xl block my-2">
                    <FaEnvelope className="inline -mt-1 mr-2" />{" "}
                    avi1273619@gmail.com
                  </span>
                  <span className="text-[#d5d5d1] text-xl block my-2">
                    <FaPhoneAlt className="inline -mt-1 mr-2" /> +91 7906217117
                  </span>
                </div>
              </div>

              <div className="px-6 max-w-full md:max-w-sm text-center md:text-left">
                <span className="font-bold text-charade-100 my-2 block">
                  Our Services
                </span>
                <span className="text-[#d5d5d1] block my-2">
                  We offer Taxi from Chandigarh to Delhi, Shimla, Manali,
                  Amritsar, Jammu at best prices. We are just one call away from
                  you.
                </span>
              </div>
              <div className="px-6 max-w-full md:max-w-sm text-center md:text-left">
                <span className="block my-2 md:text-left text-charade-100 text-center">
                  <b>Follow Us</b>
                </span>
                <div className="my-2 text-charade-100 text-2xl">
                  <FaFacebook className="inline-block mr-3" />
                  <FaInstagram className="inline-block mr-3" />
                  <FaTwitter className="inline-block" />
                </div>
              </div>
            </div>
            <div className="text-[#d5d5d1] text-center mt-4 pb-[32px]">
              <p className="font-bold text-xl">
                <FaCopyright className="inline -mt-1" /> Cab Insta Pvt. Ltd
              </p>
              <p className="text-charade-400">
                Cab Booking Service, Since 2022
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
