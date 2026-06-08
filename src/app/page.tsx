import BusinessUnits from "@/components/BusinessUnits";
import Closing from "@/components/Closing";
import CoreIdea from "@/components/CoreIdea";
import EquestrianExperience from "@/components/EquestrianExperience";
import EquestrianAmenities from "@/components/EquestrianAmenities";
import Hero from "@/components/Hero";
import Housing from "@/components/Housing";
import LandBank from "@/components/LandBank";
import Location from "@/components/Location";
import Masterplan from "@/components/Masterplan";
import Navigation from "@/components/Navigation";

export default function Home() {
  return (
    <>
      <Navigation />
      <main>
        <Hero />
        <CoreIdea />
        <Masterplan />
        <EquestrianAmenities />
        <EquestrianExperience />
        <BusinessUnits />
        <Housing />
        <LandBank />
        <Location />
        <Closing />
      </main>
    </>
  );
}
