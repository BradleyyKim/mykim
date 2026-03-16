import { Metadata } from "next";
import CareerPage from "@/components/pages/CareerPage";
import { generateCareerMetadata } from "@/components/pages/CareerPage";

export const metadata: Metadata = generateCareerMetadata("en");

export default function Page() {
  return <CareerPage locale="en" />;
}
