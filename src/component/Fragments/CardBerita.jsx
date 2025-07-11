import { Link } from "react-router-dom";

const CardBerita = ({ image, title, date, summary, link }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
      <img src={image} alt={title} className="w-full h-40 object-cover" />
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm text-gray-500 mb-1">{date}</p>
        <h3 className="font-semibold text-lg text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-4 flex-1">{summary}</p>
        <div className="mt-auto">
          <Link
            to={link}
            className="inline-block bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
          >
            Baca Selengkapnya
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CardBerita;