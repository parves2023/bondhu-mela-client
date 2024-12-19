import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BallTriangle } from "react-loader-spinner";
import { AuthContext } from "../providers/AuthProvider";

function AllVisa() {
  const [visas, setVisas] = useState([]); // All visas from server
  const { dataFetching, setDataFetching } = useContext(AuthContext); // Loading state context

  const [selectedType, setSelectedType] = useState("All"); // Dropdown selection
  const [filteredVisas, setFilteredVisas] = useState([]); // Visas filtered by type

  // Handle dropdown filter change
  const handleFilterChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    if (type === "All") {
      setFilteredVisas(visas); // Show all visas
    } else {
      setFilteredVisas(visas.filter((visa) => visa.visaType === type));
    }
  };

  // Fetch visas from the server
  useEffect(() => {
    const fetchVisas = async () => {
      setDataFetching(true);
      try {
        const response = await fetch("https://bondhu-mela.vercel.app/visas");
        if (response.ok) {
          const data = await response.json();
          setVisas(data);
          setFilteredVisas(data); // Initialize with all visas
        } else {
          console.error("Failed to fetch visas");
        }
      } catch (error) {
        console.error("Error fetching visas:", error);
      } finally {
        setDataFetching(false);
      }
    };

    fetchVisas();
  }, [setDataFetching]);

  // Get unique visaTypes from the visas array
  const visaTypes = ["All", ...new Set(visas.map((visa) => visa.visaType))];

  // Show loading spinner while fetching data
  if (dataFetching) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <h1 className="text-3xl font-bold text-center mb-6">All Visas</h1>
        <div className="flex justify-center h-screen">
          <BallTriangle
            height={100}
            width={100}
            radius={5}
            color="#4fa94d"
            ariaLabel="ball-triangle-loading"
            visible={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-3xl font-bold text-center mb-6">All Visas</h1>

      {/* Dropdown Menu */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedType}
          onChange={handleFilterChange}
          className="border border-gray-300 rounded-lg px-4 py-2 shadow-md focus:outline-none focus:ring focus:ring-green-300"
        >
          {visaTypes.map((type, index) => (
            <option key={index} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      {/* Visa Cards */}
      <div className="grid mb-5 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredVisas.map((visa) => (
          <div
            key={visa._id}
            className="border flex flex-col justify-between p-4 rounded shadow hover:shadow-lg transition"
          >
            <img
              src={visa.countryImage}
              alt={visa.country}
              className="w-full h-32 md:h-28 object-cover rounded mb-4"
            />
            <h2 className="text-xl font-bold mb-2">{visa.country}</h2>
            <p className="text-sm text-gray-600 mb-2">Type: {visa.visaType}</p>
            <p className="text-sm text-gray-600 mb-2">
              Processing Time: {visa.processingTime}
            </p>
            <p className="text-sm text-gray-600 mb-2">Fee: ${visa.fee}</p>
            <Link
              to={`/details/${visa._id}`}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllVisa;
