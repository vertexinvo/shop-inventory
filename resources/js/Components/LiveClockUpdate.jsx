import React, { useState, useEffect } from "react";

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-900">
      <div className="bg-black text-white px-8 py-4 rounded-2xl shadow-lg text-center">
        <h1 className="text-6xl font-bold tracking-widest">
          {time.toLocaleTimeString()}
        </h1>
        <p className="text-lg text-gray-400 mt-2">
          {time.toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default DigitalClock;
