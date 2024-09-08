import { useState, useEffect } from "react";
import { GiSwordsEmblem } from "react-icons/gi";
import "../css/JoinGuild.css";
import axios from "axios";
axios.defaults.withCredentials = true;

const JoinGuild = ({ userId }) => {
  const [guilds, setGuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGuilds = async () => {
      try {
        setLoading(true);

        const response = await axios.post("https://adventure-clicker-backend.onrender.com/graphql", {
          query: `
                            query {
                                getAllGuilds {
                                    id
                                    name
                                    score
                                    creatorId
                                }
                            }
                        `,
        },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Add the token in the header
            }
          },
          { withCredentials: true }
        );

        const result = await response.data;

        setGuilds(result.data.getAllGuilds);
        setLoading(false);
        setError(null);
      } catch (fetchError) {
        console.error("Error fetching guilds:", fetchError);
        setLoading(false);
        setError(fetchError.message);
      }
    };

    fetchGuilds();
  }, []);

  const handleJoinGuild = async (guildId) => {
    console.log(guildId, userId);
    try {
      setLoading(true);
      const response = await axios.post("https://adventure-clicker-backend.onrender.com/graphql", {
        query: `
                        mutation {
                            updateUser(userId: "${userId}", gildenId: "${guildId}") {
                                id
                                name
                                staerke
                                geschick
                                intelligenz
                                gildenId
                                level
                                energie
                            }
                        }
                    `,
      },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Add the token in the header
          }
        },
        { withCredentials: true }
      );

      const result = await response.data;

      const joinedGuild = result.data.updateUser;
      console.log("Joined Guild:", joinedGuild);

      setGuilds((prevGuilds) =>
        prevGuilds.map((guild) =>
          guild.id === joinedGuild.id ? joinedGuild : guild
        )
      );

      setLoading(false);
      setError(null);
    } catch (joinError) {
      console.error("Error in updateUser mutation:", joinError);
      setLoading(false);
      setError(joinError.message);
    }
  };

  return (
    <div className="guild-container">
      <div className="title-container">
        <h2 className="title">Join a Guild</h2>
        <GiSwordsEmblem className="sword-icon" />
      </div>
      <div className="scroll">
        {loading && <p>Loading guilds...</p>}
        {error && <p>Error: {error}</p>}
        {guilds.length > 0 && (
          <ul className="all-guilds">
            {guilds.map((guild) =>
              // Check if guild.id is equal to "65a46184c9cd9e13114ae074"
              // If true, skip rendering the component
              guild.id === "65a46184c9cd9e13114ae074" ? null : (
                <li className="guild" key={guild.id}>
                  <span>{guild.name}</span>
                  <button
                    onClick={() => handleJoinGuild(guild.id)}
                    disabled={loading}
                    className="join-btn"
                  >
                    {loading ? "Joining..." : "Join Guild"}
                  </button>
                </li>
              )
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default JoinGuild;
