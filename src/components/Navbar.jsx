import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../providers/AuthProvider";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);

  const [photoURL, setPhotoURL] = useState(user?.photoURL);

  // console.log(user?.photoURL);

  useEffect(() => {
    const fetchPhoto = async () => {
      if (user?.photoURL) {
        const img = new Image();
        img.src = user.photoURL;

        img.onload = () => {
          setPhotoURL(user.photoURL); // Set the user photo once it's loaded
        };

        img.onerror = () => {
          setPhotoURL("https://via.placeholder.com/150"); // Fallback to placeholder on error
        };
      } else {
        setPhotoURL("https://via.placeholder.com/150"); // Fallback if no user photo
      }
    };

    fetchPhoto();
  }, [user]);

  const handleSignOut = () => {
    logOut().then().catch();
  };

  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {/* <li>
        <NavLink to="/all-visas" >
          All Visas
        </NavLink>
      </li>
      <li>
        <NavLink to="/add-visa" >
          Add Visa
        </NavLink>
      </li>
      <li>
        <NavLink to="/my-added-visas" >
          My Added Visas
        </NavLink>
      </li>
      <li>
        <NavLink to="/my-applications" >
          My Visa Applications
        </NavLink>
      </li> */}
      <li>
        <NavLink to="/my-profile">My Profile</NavLink>
      </li>
      <li>
        <NavLink to="/all-people">All people</NavLink>
      </li>
      <li>
        <NavLink to="/all-Messages">All messages</NavLink>
      </li>
      <li>
        <NavLink to="/my-posts">My Posts</NavLink>
      </li>
    </>
  );

  return (
    <div className="sticky top-0 pt-1 pb-2 z-50  bg-white dark:bg-gray-700">
      <div className="container mx-auto">
        <div className="navbar bg-[#EEFBF3] p-4 rounded-2xl border border-green-300">
          <div className="navbar-start">
            <div className="">
              <Link to="/" className="md:flex">
                <h1 className="md:text-3xl text-2xl ralewayfont font-bold">
                  Bondhu<span className="text-[#309255]">Mela</span>
                </h1>
              </Link>
            </div>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{navLinks}</ul>
          </div>
          <div className="navbar-end">
            {user ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-3">
                <div className="relative flex items-center gap-2 md:flex-row-reverse flex-row menu-photo">
                  <img
                    src={photoURL}
                    alt="Profile"
                    className="size-10 mx-auto rounded-full ring ring-green-300 text-center"
                  />
                  <div className="menu-hidden absolute top-full -left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg">
                    <h2 className="text-xs text-center">
                      Welcome {user?.displayName}
                    </h2>
                    <button
                      onClick={handleSignOut}
                      className="btn bg-white px-10 hover:bg-green-800 hover:text-white font-medium border border-green-500 mt-2"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-x-2 flex">
                <Link to="/login">
                  <button className="btn bg-white px-10 hover:bg-green-800 hover:text-white font-medium border border-green-500">
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn hidden lg:flex bg-white px-10 hover:bg-green-800 hover:text-white font-medium border border-green-500">
                    Register
                  </button>
                </Link>
              </div>
            )}

            <div className="dropdown">
              <label tabIndex={0} className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu right-1/3 menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                {navLinks}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
