import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const RegionDisplay = (props) => {
  const [region, setRegion] = useState(null);
  const [error, setError] = useState(null);

  const getToken = () => {
    return localStorage.getItem('jwtToken'); // Token aus dem localStorage holen
  };

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        let userId = props.userId;

        const response = await fetch("https://adventure-clicker-backend.onrender.com/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${getToken()}`,
          },
          credentials: "include",
          body: JSON.stringify({
            query: `
              query{
                getRegionByUser(userId: "${userId}") {
                  id
                  minLevel
                  hintergrundBild
                }
              }
            `,
            variables: {
              userId,
            },
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0].message);
        }

        const fetchedRegion = result.data.getRegionByUser;
        //console.log(fetchedRegion);
        setRegion(fetchedRegion);
        setError(null);
      } catch (fetchError) {
        console.error("Error fetching region:", fetchError);
        setError(fetchError.message);
      }
    };

    if (props.userId) fetchRegion();
  }, [props.userId]);

  return (
    <div>
      {error && <p>Error: {error}</p>}
      {region && (
        <div>
          <img
            src={new URL(`/src/assets/images/${region.hintergrundBild}.png`, import.meta.url).href}
            alt={`Background for Region ${region.id}`}
            className="region-image"
          />
          {/* <p>Region ID: {region.id}</p>
          <p>Minimum Level: {region.minLevel}</p> */}
        </div>
      )}
    </div>
  );
};

// Prop types validation
RegionDisplay.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default RegionDisplay;
