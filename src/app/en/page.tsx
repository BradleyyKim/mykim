import { Metadata } from "next";
import HomePage from "@/components/pages/HomePage";
import { generateHomeMetadata } from "@/components/pages/HomePage";

export const revalidate = 300;

export const metadata: Metadata = generateHomeMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
