import { useEffect, useState } from "react";
import DetailCard from "./components/DetailCard";
import Header from "./components/Header";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import "./app.css";

function App() {
  const API_KEY = process.env.REACT_APP_API_KEY;

  const [loading, setLoading] = useState(false);
  const [noData, setNoData] = useState("No Data Yet");
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [city, setCity] = useState("Unknown location");
  const [weatherIcon, setWeatherIcon] = useState(
    `${process.env.REACT_APP_ICON_URL}10n@2x.png`
  );

  useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  const handleChange = (input) => {
    const { value } = input.target;
    setSearchTerm(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getWeather(searchTerm);
  };

  const getWeather = async (location) => {
    setWeatherData([]);
    let how_to_search =
      typeof location === "string"
        ? `q=${location}`
        : `lat=${location[0]}&lon=${location[1]}`;

    try {
      let res = await fetch(`${process.env.REACT_APP_URL + how_to_search}
      &appid=${API_KEY}&units=metric&cnt=5&exclude=hourly,minutely`);
      let data = await res.json();
      if (data.cod != 200) {
        setNoData("Location Not Found");
        return;
      }
      setWeatherData(data);
      setCity(`${data.city.name}, ${data.city.country}`);
      setWeatherIcon(
        `${
          process.env.REACT_APP_ICON_URL + data.list[0].weather[0]["icon"]
        }@4x.png`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWeather([latitude, longitude]);
  };

  return (
    <div className="bg-gray-700 flex items-center justify-center w-screen h-screen py-10 px-10">
      {loading ? (
        <ClimbingBoxLoader size={30} color={"#F37A24"} loading={loading} />
      ) : (
        <div className="flex xl:w-3/4 xl:h-3/4 sm:w-2/4 sm:h-2/4  rounded-3xl shadow-lg m-auto bg-gray-100 app_box_container">
          {/* form card section  */}
          <div className="form-container w-2/4 app_box_container_one">
            <div className="flex items-center justify-center">
              <h3
                className="my-auto mr-auto text-xl text-pink-800 font-bold shadow-md py-1 px-3 
            rounded-md bg-white bg-opacity-30"
              >
                Weather Forecast
              </h3>
              <div className="flex p-2 text-gray-100 bg-gray-600 bg-opacity-30 rounded-lg">
                <i className="fa fa-map my-auto" aria-hidden="true"></i>
                <div className="text-right">
                  <p className="font-semibold text-sm ml-2">{city}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-white text-2xl app_heading">
                Your Personalized Weather Forecast
              </h1>
              <hr className="h-1 bg-white w-1/4 rounded-full my-5" />
              <form
                noValidate
                onSubmit={handleSubmit}
                className="flex justify-center w-full"
              >
                <input
                  type="text"
                  placeholder="Enter location"
                  className="relative rounded-xl py-2 px-3 w-2/3 bg-gray-300 bg-opacity-60 text-white placeholder-gray-200"
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="z-10">
                  <i
                    className="fa fa-search text-white -ml-10 border-l my-auto z-10 cursor-pointer p-3"
                    aria-hidden="true"
                    type="submit"
                  ></i>
                </button>
                <i
                  className="fa fa-map-marker-alt my-auto cursor-pointer p-3 text-white"
                  aria-hidden="true"
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(myIP);
                  }}
                ></i>
              </form>
            </div>
          </div>
          {/* info card section  */}
          <div className="w-2/4 p-5 app_box_container_two">
            <Header />
            <div className="flex flex-col my-10">
              {/* card jsx  */}
              {weatherData.length === 0 ? (
                <div className="container p-4 flex items-center justify-center h-1/3 mb-auto">
                  <h1 className="text-gray-300 text-4xl font-bold uppercase app_nodata">
                    {noData}
                  </h1>
                </div>
              ) : (
                <div className="app_detail_data">
                  <h1 className="text-5xl text-gray-800 mt-auto mb-4 app_today">
                    Today
                  </h1>
                  <DetailCard weather_icon={weatherIcon} data={weatherData} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
