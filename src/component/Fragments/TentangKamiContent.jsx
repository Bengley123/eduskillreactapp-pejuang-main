import Heading from "../Elements/Head/Heading";
import Image from "../Elements/Image/ImageIndex";
import VisiSection from "../Moleculs/VisiSection";
import MisiSection from "../Moleculs/MisiSection";
import Paragraph from "../Elements/Paragraph/ParagraphText"
// import TentangSection from "../Moleculs/TentangSection";
// import logo from "../../assets/logo-tentang-kami.png";

export default function InfoSectionContent({ title, image, alt, description }) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <Heading>{title}</Heading>

      <div className="flex flex-col items-center mb-2">
        <Image src={image} alt={alt} className="w-80 h-80 mb-4" />
      </div>

      <VisiSection />
      <MisiSection />

      <div className="text-gray-700 text-sm px-8">
        <Paragraph className="font-bold">
          {description}
        </Paragraph>
      </div>
    </div>
  );
}
