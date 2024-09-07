import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RegionDisplay from "./RegionDisplay";
import socket from "./socket";
import CircularLoadingBar from "./CircularLoadingBar";
import '../css/Adventure.css';

const Adventure = (props) => {
  const [userId] = useState(props.userId);
  const [event, setEvent] = useState(null);
  const [reward, setReward] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reloadRegionDisplay, setReloadRegionDisplay] = useState(false);

  const notifyServer = () => {
    socket.emit("updatedUser", { userId });
  };

  useEffect(() => { }, [userId, reloadRegionDisplay]);

  useEffect(() => {
    //console.log(reward);
  }, [reward]);

  const load = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setReloadRegionDisplay((prev) => !prev);
    }, 1000);
  };

  const doEvent = async () => {
    try {
      const response = await fetch("https://adventure-clicker-backend.onrender.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query: `
                    mutation {
                        doEvent(userId: "${userId}", eventId: "${event.id}") {
                        malus {
                            id
                            text
                            energieAbzug
                        }
                        bonus {
                            id
                            text
                            itemId
                            itemQuantity
                            levelBonus
                        }
                        }
                    }
                `,
        }),
      });

      load();

      const result = await response.json();

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      setReward(result.data.doEvent);

      console.log(reward);
      notifyServer();
    } catch (fetchError) {
      console.error("Error fetching reward:", fetchError);
    }
  };

  const noEvent = async () => {
    setEvent(null);
    setReward(null);
  };

  const fetchEvent = async () => {
    try {
      const response = await fetch("https://adventure-clicker-backend.onrender.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          query: `
            query {
              getEventByUser(userId: "${userId}") {
                id
                bonusId 
                malusId
                titel
                text
                testedStat
                difficulty
                probability
                regionId
              }
            }
          `,
        }),
      });

      const result = await response.json();

      //console.log(result);

      if (result.errors) {
        throw new Error(result.errors[0].message);
      }

      const fetchedEvent = result.data.getEventByUser;
      //console.log(fetchedEvent);
      setEvent(fetchedEvent);
    } catch (fetchError) {
      console.error("Error fetching event:", fetchError);
    }
  };

  const getEventFigure = (event) => {
    const path = "/src/assets/images/";
    switch (event) {
      case "Rattacke":
        return `${path}/figures/rattacke.png`;
      case "Bananadit":
        return `${path}/figures/bananabandit.png`;
      case "":
        return `${path}/figures/troll.png`;
      case "Rattacke return":
        return `${path}/figures/rattacke2.png`;
      case "Klebriger Herbert benutzt sein Schwert!":
        return `${path}/figures/klebrigerherbert.png`;
      case "G steht für Gun":
        return `${path}/figures/gundalf.png`;
      case "Rattatacke: The Reckoning":
        return `${path}/figures/rattacke3.png`;
      case "3-Finger Joe":
        return `${path}/figures/threejoe.png`;
      case "Ein blühendes Wunder erleben":
        return `${path}/figures/flowermagician.png`;
      default:
        return `${path}/figures/undefinded.png`;
    }
  };

  return (
    <div>
      <RegionDisplay userId={userId} key={reloadRegionDisplay} />

      <div className={`adventure-container`}>
        {loading ? (
          <CircularLoadingBar size={10} strokeWidth={10} />
        ) : reward ? (
          reward.malus ? (
            <div className="bonus-container">
              <h3>{`${reward.malus.text}`}</h3>
              <p>{`Du verlierst ${reward.malus.energieAbzug} Punkte Energie`}</p>
              <p>Willst du es erneut versuchen?</p>
              <div className="adventure-choices">
                <a
                  className="adventure-button yes"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    doEvent();
                  }}
                >
                  Ja
                </a>
                <a
                  className="adventure-button no"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    noEvent();
                  }}
                >
                  Nein
                </a>
              </div>
            </div>
          ) : (
            <div className="malus-container">
              <h3>{`${reward.bonus.text}`}</h3>
              <div className="adventure-choices">
                <a
                  className="adventure-button yes"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    noEvent();
                  }}
                >
                  Weiter
                </a>
              </div>
            </div>
          )
        ) : event ? (
          <div
            className={`${event ? "event-loaded" : ""}`}
            id="adventure-display"
          >
            <img
              src={getEventFigure(event.titel)}
              alt={event.titel}
              className="event-figur"
            />
            <h2>{event.titel} </h2>
            <p>{event.text} </p>
            <div className="adventure-choices">
              <a
                className="adventure-button yes"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  doEvent();
                }}
              >
                Kämpfen
              </a>
              <a
                className="adventure-button no"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  noEvent();
                }}
              >
                Fliehen
              </a>
            </div>
          </div>
        ) : (
          <a
            id="adventure-link"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              fetchEvent();
            }}
          >
            Abenteuren!
          </a>
        )}
      </div>
    </div>
  );
};

// Prop types validation
Adventure.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default Adventure;
