import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-modal";
import { AuthContext } from "../providers/AuthProvider";
import { BallTriangle } from "react-loader-spinner";
import { toast, ToastContainer } from "react-toastify";

// Set the app element
Modal.setAppElement("#root");

const VisaDetails = () => {
  const { _id } = useParams();
  const { user } = useContext(AuthContext);
  const [visa, setVisa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [application, setApplication] = useState({
    email: user?.email,
    firstName: "",
    lastName: "",
    appliedDate: new Date().toISOString().split("T")[0],
    fee: "",
    countryImage: "",
  });

  useEffect(() => {
    const fetchVisa = async () => {
      try {
        const response = await fetch(
          `https://bondhu-mela.vercel.app/visas/${_id}`
        );
        const data = await response.json();
        setVisa(data);
        setLoading(false);
        setApplication((prev) => ({
          ...prev,
          fee: data.fee,
          countryImage: data.countryImage,
          visaType: data.visaType,
          processingTime: data.processingTime,
          validity: data.validity,
          applicationMethod: data.applicationMethod,
          country: data.country,
        }));
      } catch (error) {
        toast.error("Error fetching visa details:", error);
        setLoading(false);
      }
    };

    fetchVisa();
  }, [_id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    console.log(application);

    try {
      const response = await fetch(
        "https://bondhu-mela.vercel.app/applications",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(application),
        }
      );

      if (response.ok) {
        toast.success("Application submitted successfully!");
        setIsModalOpen(false);
      } else {
        toast.error("Failed to submit application.");
      }
    } catch (error) {
      toast.error("Error submitting application:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10">
        <h1 className="text-3xl font-bold text-center mb-6">My Added Visas</h1>
        <div className="flex justify-center  h-screen">
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

  if (!visa) {
    return <div className="text-center mt-10">Visa not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto my-10 p-4 border rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl font-bold mb-4 text-center">{visa.country}</h1>
      <img
        src={visa.countryImage}
        alt={`${visa.country} Visa`}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <p>
        <strong>Visa Type:</strong> {visa.visaType}
      </p>
      <p>
        <strong>Processing Time:</strong> {visa.processingTime}
      </p>
      <p>
        <strong>Fee:</strong> ${visa.fee}
      </p>
      <p>
        <strong>Validity:</strong> {visa.validity}
      </p>
      <p>
        <strong>Application Method:</strong> {visa.applicationMethod}
      </p>
      <p>
        <strong>Age Restriction:</strong> {visa.ageRestriction}
      </p>
      <p className="mt-4">
        <strong>Description:</strong>
      </p>
      <p>{visa.description}</p>

      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        onClick={() => setIsModalOpen(true)}
      >
        Apply for the Visa
      </button>

      {/* Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Apply for Visa"
        className="max-w-lg w-8/12 mx-auto mt-24 p-4 bg-white rounded shadow-lg"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl font-bold mb-4">
          Apply for {visa.country} Visa
        </h2>
        <form onSubmit={handleSubmitApplication}>
          <div className="mb-4">
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={application.email}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={application.firstName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={application.lastName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Applied Date</label>
            <input
              type="date"
              name="appliedDate"
              value={application.appliedDate}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium">Fee</label>
            <input
              type="number"
              name="fee"
              value={application.fee}
              readOnly
              className="w-full px-3 py-2 border rounded bg-gray-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Apply
          </button>
        </form>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default VisaDetails;
