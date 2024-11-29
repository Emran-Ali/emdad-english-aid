import Link from "next/link";
import ProfileCard from "@/component/ProfileCard";

const Landing = () => {
  return (
    <div className="flex gap-5 flex-wrap">
      <div className="card w-full bg-gray-500 rounded-lg md:w-6/12 lg:w-3/12 lg:mb-0 mb-12 px-4">
        <div className="px-6">
          <img
            alt="..."
            src="assets/image/gaffer.jpg"
            className="shadow-lg rounded-full mx-auto h-52 w-52"
          />
          <div className="pt-6 text-center">
            <h5 className="text-xl text-yellow-300 font-bold">Abdul Gaffer</h5>
            <p className="mt-1 text-sm text-white uppercase font-semibold">
              Manager
            </p>
            <p className="mt-1 text-sm text-cyan-400 uppercase font-semibold">
              Contact : 01718-387574
            </p>
            <div className="mt-6">
              <button
                className="bg-red-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                type="button"
              >
                <i className="fab fa-google"></i>
              </button>
              <button
                className="bg-blue-600 text-white w-8 h-8 rounded-full outline-none focus:outline-none mr-1 mb-1"
                type="button"
              >
                <i className="fab fa-facebook-f"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <ProfileCard />
      <ProfileCard />
    </div>
  )
}

export default Landing;