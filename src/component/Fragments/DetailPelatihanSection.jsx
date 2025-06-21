import HeroBanner from "../Moleculs/HeroBanner";
import Image from "../Elements/Image/ImageIndex";
import DeskripsiSection from "../Moleculs/DeskripsiSection";
import Button from "../Elements/Button/index";

const DetailPelatihanSection = ({
  title,
  imageSrc,
  description,
  onDaftar,
  instructor,
  biaya,
  kuota,
  deadline,
}) => {
  return (
    <div className="max-w-5xl mx-auto my-10 px-4 space-y-8">
      <HeroBanner title={title} backgroundImage={imageSrc} />

      <div className="w-full flex justify-center">
        <Image
          src={imageSrc}
          alt={title}
          className="w-full max-w-md rounded-lg shadow-lg"
        />
      </div>

      <DeskripsiSection title="Deskripsi Pelatihan" content={description} />

      <div className="bg-gray-100 p-4 rounded-lg shadow-md space-y-2">
        {instructor && (
          <p>
            <strong>Instruktur:</strong> {instructor}
          </p>
        )}
        {biaya !== undefined && (
          <p>
            <strong>Biaya:</strong> Rp {parseInt(biaya).toLocaleString()}
          </p>
        )}
        {kuota !== undefined && (
          <p>
            <strong>Kuota Tersedia:</strong> {kuota} peserta
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <Button onClick={onDaftar}>Daftar Sekarang</Button>
      </div>
    </div>
  );
};

export default DetailPelatihanSection;
