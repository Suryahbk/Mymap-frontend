import "./app.css";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import React, { useEffect, useState } from "react";
import { Room, Star } from "@material-ui/icons";
import axios from "axios";
import { format } from "timeago.js";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const myStorage = window.localStorage; // To store my data in local storage and we do by using it in Login(210).
  const [currentUsername, setCurrentUsername] = useState(myStorage.getItem("user")); // Whenever we refresh the page it vl take the currentuser from local storage.
  const [pins, setPins] = useState([]);
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [newPlace, setNewPlace] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [star, setStar] = useState(0);
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleMarkerClick = (id, lat, long) => {
    setCurrentPlaceId(id);
    setViewport({ ...viewport, latitude: lat, longitude: long }); // when clicking on the pin in order to view the form at center we the new latitude and longitude.
  };

  const handleAddClick = (e) => {
    const [longitude, latitude] = e.lngLat;
    setNewPlace({
      lat: latitude,
      long: longitude,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUsername,
      title,
      desc,
      rating: star,
      lat: newPlace.lat,
      long: newPlace.long,
    };

    try {
      const res = await axios.post("/pins", newPin); // Here we r sending the newPin(42) to the backend(api) through post method after the handlesubmit action.
      setPins([...pins, res.data]); // To view the newpins on map setPins hook is used and info given inside pins(reviews) is same and res.data means we have added one more pin.
      setNewPlace(null); // After submission of pins in order to not c the popup anymore until triggered we use setNewPlace(null).
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {      //Whenever i refresh the page i fetch all the pins from backend using useffect.
    const getPins = async () => {
      try {
        const allPins = await axios.get("/pins");
        setPins(allPins.data);
      } catch (err) {
      }
    };
    getPins();
  }, []);

  const handleLogout = () => {
    setCurrentUsername(null); // Currentuser is made null when clicked on logout.
    myStorage.removeItem("user"); // Using the handlelogut event, we remove the item(user) from localstorage using removeitem method.
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken = "pk.eyJ1Ijoic3VyeWFoYms4IiwiYSI6ImNreWlsYTBweDE1Z2Myd3AwZHFibGdjNXAifQ.8cHW7jKG0whRVyYUNf6u2Q"
        width="100%"
        height="100%"
        transitionDuration="200"
        mapStyle="mapbox://styles/mapbox/streets-v11"   // style theme is used from mapbox gallery.
        onViewportChange={(viewport) => setViewport(viewport)}
        onDblClick={currentUsername && handleAddClick}
      >
        {pins.map((p) => (
          <>
            <Marker
              latitude={p.lat}
              longitude={p.long}
              offsetLeft={-3.5 * viewport.zoom}
              offsetTop={-7 * viewport.zoom}
            >
              <Room                            // Using material UI icon i can pin the place to write the review. 
                style={{
                  fontSize: 7 * viewport.zoom,
                  color:
                    currentUsername === p.username ? "tomato" : "slateblue",  // if a user is logged in and pining to write a review then user is determined as tomato color and other users will be determined in slateblue color.
                  cursor: "pointer",  
                }}
                onClick={() => handleMarkerClick(p._id, p.lat, p.long)} // On clicking the markerclick we add the pinned user_id, pins lat and long.
              />
            </Marker>
            {p._id === currentPlaceId && (
              <Popup
              key={p._id}
              latitude={p.lat}
              longitude={p.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setCurrentPlaceId(null)}
              anchor="left"
              >
                <div className="card">
                  <label>Place</label>
                  <h4 className="place">{p.title}</h4>
                  <label>Review</label>
                  <p className="desc">{p.desc}</p>
                  <label>Rating</label>
                  <div className="stars">
                    {Array(p.rating).fill(<Star className="star" />)} {/*Array(p.rating) means it just takes the number and fill it as star in.*/}
                  </div>
                  <label>Information</label>
                  <span className="username">
                    Created by <b>{p.username}</b>
                  </span>
                  <span className="date">{format(p.createdAt)}</span>  {/*Using timeago package we use format to view when it was created*/} 
                </div>
              </Popup>
            )}
          </>
        ))}
        {newPlace && (
          <>
            <Marker
              latitude={newPlace.lat}
              longitude={newPlace.long}
              offsetLeft={-3.5 * viewport.zoom} // Inorder to place the pin on exact position the Room lower part should be on exact point so we make it half of room style fontsize.
              offsetTop={-7 * viewport.zoom} //Inorder to place the pin on exact position we Room style fontsize.
            >
              <Room
                style={{
                  fontSize: 7 * viewport.zoom,
                  color: "tomato",
                  cursor: "pointer",
                }}
              />
            </Marker>
            <Popup        //I used popup for wraping the reviews, rating, desc.
              latitude={newPlace.lat}
              longitude={newPlace.long}
              closeButton={true}
              closeOnClick={false}
              onClose={() => setNewPlace(null)}
              anchor="left"
            >
              <div>
                <form onSubmit={handleSubmit}>
                  <label>Title</label>
                  <input
                    placeholder="Enter a title"
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)} // Using hook, setTitle event is targeted to enter a title value.
                  />
                  <label>Description</label>
                  <textarea
                    placeholder="Say us something about this place."
                    onChange={(e) => setDesc(e.target.value)} // Using hook, setDesc event is targeted to enter the description value.
                  />
                  <label>Rating</label>
                   <select onChange={(e) => setStar(e.target.value)}>  {/*Using hook, setTitle event is targeted to rate with stars.*/}
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
            </Popup>
          </>
        )}
        {currentUsername ? (            // If there is currentuser present then show only Logout button.
          <button className="button logout" onClick={handleLogout}>
            Log out
          </button>
        ) : (                           // If there is NO currentuser present then show Login and Register button.
          <div className="buttons">
            <button className="button login" onClick={() => setShowLogin(true)}>
              Log in
            </button>
            <button
              className="button register"
              onClick={() => setShowRegister(true)}
            >
              Register
            </button>
          </div>
        )}
        {showRegister && <Register setShowRegister={setShowRegister} />} {/* Using the hook, we can view the register page and using setShowRegister in our register page as props. */}
        {showLogin && (
          <Login
            setShowLogin={setShowLogin} // Using the hook, we can view the Login page.
            setCurrentUsername={setCurrentUsername} // To assign the currentuser to enjoy rating the reviews we send this current user to login page and there v use it as props.
            myStorage={myStorage}  // We mention mystorage here in login page.
          />                      
        )}
      </ReactMapGL>
    </div>
  );
}

export default App;