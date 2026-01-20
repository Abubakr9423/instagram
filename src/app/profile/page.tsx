"use client";
import React from "react";
const Profile = () => {
  const [data, setData] = React.useState<any>([]);
  React.useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const res = await fetch(
      "https://instagram-api.softclub.tj/UserProfile/get-my-profile",
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    const data = await res.json();
    setData(data.data);
  }
  return (
    <div className="pt-6">
      {data ? (
        <div className="flex items-start justify-center gap-25 w-[935px] m-auto">
          <img
            src={`https://instagram-api.softclub.tj/images/${data.image}`}
            className="w-32 h-32  rounded-full object-cover"
          />
          <div className="flex flex-col gap-5 ">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-normal">{data.userName}</h1>
              <button className="rounded px-3 py-2 bg-[#363c44] text-[#f2f2f3]">
                Edit profile
              </button>
              <button className="rounded px-3 py-2 bg-[#363c44] text-[#f2f2f3]">
                View archive
              </button>
            </div>
            <div className="flex items-center gap-6">
              <p>{data.postCount} <span className="text-sm text-gray-400">posts</span></p>
              <p>{data.subscribersCount} <span className="text-sm text-gray-400">followers</span></p>
              <p>{data.subscriptionsCount} <span className="text-sm text-gray-400">following</span></p>
            </div>
            <h1 className="text-[16px]">{data.about}</h1>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
export default Profile;
