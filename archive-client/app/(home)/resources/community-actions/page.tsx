import { HeroSection } from "@/components/community/Contributors/HeroSection";
import { GridWall } from "@/components/community/Contributors/GridWall";
import { JoinCTA } from "@/components/community/Contributors/JoinCTA";

export interface IContributor {
  name: string;
  github: string;
}

const contributors: IContributor[] = [
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
  { name: "Ifruin Ruhin", github: "https://github.com/ifrunruhin12" },
  { name: "Iqbal Hossain", github: "https://github.com/geomachine" },
  { name: "Nazma Sarker", github: "https://github.com/nazma98" },
];

export default function CommunityActionsPage() {
  return (
    <div className='py-16 lg:py-24 space-y-20'>
      {/* Hero Section */}
      <HeroSection contributors={contributors} />

      {/* Grid Wall */}
      <GridWall contributors={contributors} />

      {/* Join CTA */}
      <JoinCTA />
    </div>
  );
}
