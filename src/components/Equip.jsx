import { useState, useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { GiSwapBag } from "react-icons/gi";
import { TbTrashX } from "react-icons/tb";
import PropTypes from "prop-types";
import "../css/Equip.css";
import socket from "./socket";
import axios from "axios";
axios.defaults.withCredentials = true;

const EquipList = (props) => {
  const [items, setItems] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const userId = props.userId;

  useEffect(() => {
    socket.on("updateEquip", () => {
      //console.log("updateitems");
      getEquipItems();
    });
    // Fetch items and their details when the component mounts
    getEquipItems();
  }, [userId]); // Re-run the effect whenever userId changes

  const getToken = () => {
    return localStorage.getItem('token'); // Token aus dem localStorage holen
  };

  const getEquipItems = async () => {
    try {
      // Fetch the initial inventory items
      const response = await axios.post(`https://adventure-clicker-backend.onrender.com/graphql`, {
        query: `
          query {
              getEquipByUser(id: "${userId}"){
                  HeadItemId
                  ChestItemId
                  WeaponItemId
                  ShieldItemId
                  GemItemId
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

      const result = response.data;
      //console.log(result);
      const equippedItems = [
        { id: result.data.getEquipByUser.HeadItemId, slot: "Head" },
        { id: result.data.getEquipByUser.ChestItemId, slot: "Chest" },
        { id: result.data.getEquipByUser.WeaponItemId, slot: "Weapon" },
        { id: result.data.getEquipByUser.ShieldItemId, slot: "Shield" },
        { id: result.data.getEquipByUser.GemItemId, slot: "Gem" },
      ];

      // Fetch details for each inventory item
      const itemDetailsPromises = equippedItems.map(async (element) => {
        // console.log("ELEMENT");
        // console.log(element);
        var itemResponse;

        if (element.id) {
          //console.log(`equip id; ${element.id}`);
          itemResponse = await fetch("https://adventure-clicker-backend.onrender.com/graphql", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${getToken()}`,
            },
            body: JSON.stringify({
              query: `
                query {
                    getItemById(id: "${element.id}") {
                    beschreibung
                    boostedStat
                    boost
                    }
                }
                `,
            }),
            credentials: "include",
          });

          const itemResult = await itemResponse.json();
          // console.log(itemResult);

          return {
            itemId: element.id,
            slot: element.slot,
            beschreibung: itemResult.data.getItemById.beschreibung,
            boost: itemResult.data.getItemById.boost,
            boostedStat: itemResult.data.getItemById.boostedStat,
            itemStats: `${itemResult.data.getItemById.boostedStat}:${itemResult.data.getItemById.boost}`,
          };
        } else {
          return {};
        }
      });

      // Wait for all item details to resolve
      const itemList = await Promise.all(itemDetailsPromises);

      // Update the state with the combined item details
      setItems(itemList);

      // Use the callback function of setItems to perform updateUserStats
      setItems((updatedItems) => {
        updateUserStats(userId, updatedItems);
        return updatedItems;
      });
    } catch (error) {
      // console.error('Error fetching data:', error);
    }
  };

  const updateUserStats = async (userId, items) => {
    var geschick = 10;
    var intelligenz = 10;
    var staerke = 10;

    items.forEach((element) => {
      var boostedStat = element.boostedStat;
      var boost = element.boost;
      if (boostedStat == "staerke") {
        staerke += boost;
      }
      if (boostedStat == "geschick") {
        geschick += boost;
      }
      if (boostedStat == "intelligenz") {
        intelligenz += boost;
      }
    });

    //console.log(`update: ${intelligenz}, ${staerke}, ${geschick}`);

    try {
      const response = await fetch("https://adventure-clicker-backend.onrender.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              updateUserStats(userId:"${userId}",geschick:${geschick}, intelligenz:${intelligenz}, staerke:${staerke} ) {
                geschick
              }
            }
          `,
        }),
        credentials: "include",
      });

      const result = await response.json();

      // Check if the GraphQL mutation was successful
      if (result.errors) {
        // Handle GraphQL errors
        console.error("GraphQL errors:", result.errors);
      } else {
        // Successful mutation
        socket.emit("updatedUser", { userId });
      }
    } catch (error) {
      // Handle general fetch errors
      console.error("Error updating user stats:", error);
    }
  };

  const handleDeleteEquipItem = async (slot, itemId) => {
    console.log(itemId);
    await fetch("https://adventure-clicker-backend.onrender.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${getToken()}`,
      },
      credentials: "include",
      body: JSON.stringify({
        query: `
              mutation {
                updateEquipSlot(userId:"${userId}", itemId:"", slot:"${slot}") {
                  userId
                }
              }
            `,
      }),
    }).then(() => {
      getEquipItems();
    });
  };

  const getItemIcon = (beschreibung) => {
    // console.log(items)
    const path = "/src/assets/images/";
    switch (beschreibung) {
      case "Schwert":
        return `${path}/icons/swordWood.png`;
      case "Schwert und Schild":
        return `${path}/icons/SchwertSchild.png`;
      case "Goldmünze":
        return `${path}/icons/coin.png`;
      case "Knüppel mit Rattenpelz":
        return `${path}/icons/upg_spear.png`;
      case "Dunkles Großschwert":
        return `${path}/icons/sword.png`;
      case "Schicke Stiefel":
        return `${path}/icons/Boots.png`;
      case "Flinke Fingerlose Handschuhe":
        return `${path}/icons/handschuhe.png`;
      case "Blumenstab":
        return `${path}/icons/wand.png`;
      default:
        return `${path}/icons/unnown.png`;
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`equip-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
      {isExpanded && (
        <div className="rpg-equip">
          <h2 className="rpg-equip-title">Equipment</h2>
          <ul className="rpg-item-list">
            {items.map(({ slot, beschreibung, itemId, itemStats }, index) => (
              <li key={index} className="rpg-inventory-item" title={itemStats}>
                <div className="rpg-item-details">
                  {beschreibung && (
                    <p className="rpg-item-description">{beschreibung}</p>
                  )}
                </div>
                <div className="rpg-item-icons">
                  <img
                    src={getItemIcon(beschreibung)}
                    alt={beschreibung}
                    className="rpg-item-icon"
                  />
                  <TbTrashX
                    className="rpg-delete-button"
                    onClick={() => handleDeleteEquipItem(slot, itemId)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button onClick={toggleExpand} className="equip-toggle-button">
        {isExpanded ? <IoIosClose className='stats-icon' /> : <><GiSwapBag className='stats-icon' />Equiped</>}
      </button>
    </div>
  );
};

EquipList.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default EquipList;
