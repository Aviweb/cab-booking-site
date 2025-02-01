import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: "Sen, Helvetica, Arial, sans-serif",
      },
      clipPath: {
        searchWebPolygon:
          "polygon(0% 0%, 93% 0%, 100% 50%, 100% 100%, 0% 100%)",
        bottomLeftExploreProperties:
          "polygon(0% 0%, 100% 0%, 100% 100%, 19% 100%, 0% 84%)",
        searchMobilePolygon:
          "polygon(0% 0%, 90.2% 0%, 100% 29.4%, 100% 100%, 0% 100%)",
        topLeftPolygon: "polygon(22% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40%)",
        topRightFourSided: "polygon(0% 0%, 85% 0%,  100% 100%, 0% 100%)",
        topRightFourSidedBlogs: "polygon(0% 0%, 90% 0%,  100% 100%, 0% 100%)",
        bottomLeftAboutUs:
          "polygon(0% 0%, 100% 0%, 100% 100%, 13% 100%, 0% 70%)",
        bottomRightPropertyCountCard:
          "polygon(0% 0%, 100% 0%, 100% 70%, 80% 100%, 0% 100%)",
        bottomRightUpcomingAuctionCard:
          "polygon(0% 0%, 100% 0%, 100% 60%, 90% 100%, 0% 100%)",
        bottomRightPropertyImage:
          "polygon(0% 0%, 100% 0%, 100% 60%, 85% 100%, 0% 100%)",
        bottomRightFooterMobile:
          "polygon(0% 0%, 100% 0%, 100% 85%, 80% 100%, 0% 100%)",
        bottomRightTool: "polygon(0% 0%, 100% 0%, 100% 70%, 93% 100%, 0% 100%)",
        bottomRightPostProperty:
          "polygon(0% 0%, 100% 0%, 100% 68%, 90% 100%, 0% 100%)",
        subAssetText: "polygon(0% 0%, 100% 0%,  85% 100%, 0% 100%)",
        mobileClipPolygonTopLeft:
          "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 23%)",
        webClipPolygonTopLeft:
          "polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 23%)",
        mobileClipPolygonTopRight:
          "polygon(0% 0%, 88% 0%, 100% 12%, 100% 100%, 0% 100%)",
        mobilePYPClipPolygonTopRight:
          "polygon(0% 0%, 86% 0%, 100% 100px, 100% 100%, 0% 100%)",
        webClipPolygonTopRight:
          "polygon(0% 0%, 92% 0%, 100% 25%, 100% 100%, 0% 100%)",
        webClipPolygonTopRightSmallCard:
          "polygon(0% 0%, 85% 0%, 100% 40%, 100% 100%, 0% 100%)",
        mobileClipPolygonBottomRight:
          "polygon(0% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%)",
        mobileClipPolygonBottomRightLessHeight:
          "polygon(0% 0%, 100% 0%, 100% 65%, 95% 100%, 0% 100%)",
        webClipPolygonBottomRight:
          "polygon(0% 0%, 100% 0%, 100% 70%, 90% 100%, 0% 100%)",
      },
      colors: {
        charade: {
          "50": "#9D9CB9",
          "100": "#8F8DAE",
          "200": "#716F99",
          "300": "#5A587D",
          "400": "#45435F",
          "500": "#2F2E41",
          "600": "#191923",
          "700": "#040405",
          "800": "#000000",
          "900": "#000000",
          DEFAULT: "#2F2E41",
        },
        mustard: {
          "50": "#fffdf7",
          "100": "#fffbee",
          "200": "#fff6d5",
          "300": "#fff1bb",
          "400": "#ffe689",
          "500": "#ffdb56",
          "600": "#e6c54d",
          "700": "#bfa441",
          "800": "#998334",
          "900": "#7d6b2a",
        },
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-clip-path")],
} satisfies Config;
