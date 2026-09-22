import HomePage from "@/components/HomePage";

export const metadata = {
  title: "Samsara Group — We Create Places To Feel Something",
  description: "A multidisciplinary lifestyle and hospitality collective creating meaningful experiences across music, dining, design, hospitality, and culture.",
  openGraph: {
    title: "Samsara Group",
    description: "A multidisciplinary lifestyle and hospitality collective.",
    url: "https://samsaragroup.co.id",
    siteName: "Samsara Group",
    type: "website",
  },
};

export default function Page() {
  return <HomePage />;
}
