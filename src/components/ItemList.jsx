import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { TbTrashX } from "react-icons/tb";
import { GiLockedChest } from "react-icons/gi";
import "../css/ItemList.css"; // Import the CSS file
import socket from "./socket";
import axios from "axios";
axios.defaults.withCredentials = true;

const ItemList = (props) => {
  const [items, setItems] = useState([]);
  //const [deleteQuantities, setDeleteQuantities] = useState(items.map(() => 1));
  const userId = props.userId;

  useEffect(() => {
    socket.on("updateItems", () => {
      // console.log("updateitems");
      getItems();
    });
    // Fetch items and their details when the component mounts
    getItems();
  }, [userId]); // Re-run the effect whenever userId changes

  useEffect(() => {
    // Initialize delete quantities when items change
    //const initialDeleteQuantities = items.map(() => 1);
    //setDeleteQuantities(initialDeleteQuantities);
  }, [items]);

  const notifyServer = () => {
    socket.emit("updatedEquip", { userId });
  };
  const getItems = async () => {
    try {
      // Fetch the initial inventory items

      const response = await axios.post(`https://adventure-clicker-backend.onrender.com/graphql`, {
        query: `
        query {
          getInventarById(id: "${userId}") {
            items {
              itemId
              quantity
            }
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

      const invItems = response.data.data.getInventarById.items;
      //console.log(invItems);

      //Fetch details for each inventory item
      const itemDetailsPromises = invItems.map(async (element) => {
        const itemResponse = await axios.post(`https://adventure-clicker-backend.onrender.com/graphql`, {
          query: `
              query {
                getItemById(id: "${element.itemId}") {
                  beschreibung
                  boostedStat
                  slot
                  boost
                }
              }
            `,

        },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwtToken")}`, // Add the token in the header
            }
          },
        );

        //console.log(itemResponse.data.data.getItemById);

        const itemResult = itemResponse.data.data.getItemById;
        return {
          quantity: element.quantity,
          itemId: element.itemId,
          slot: itemResult.slot,
          beschreibung: itemResult.beschreibung,
          boostedStat: itemResult.boostedStat,
          boost: itemResult.boost,
          itemStats: `${itemResult.boostedStat}:${itemResult.boost}`,
        };
      },
      );

      // Wait for all item details to resolve
      const itemList = await Promise.all(itemDetailsPromises);

      // Update the state with the combined item details
      setItems(itemList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.post(`https://adventure-clicker-backend.onrender.com/graphql`, {
        query: `
            mutation {
              updateInventar(userId:"${userId}", itemId:"${itemId}", quantity: -1) {
                id
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

      // Wait for the mutation to complete before fetching the updated items
      await getItems();
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEquip = async (itemId, slot) => {
    await axios
      .post(`https://adventure-clicker-backend.onrender.com/graphql`, {
        query: `
      mutation {
        updateEquipSlot(userId:"${userId}", itemId:"${itemId}", slot:"${slot}") {
          userId
        }
      }
    `,
      })
      .then((res) => {
        console.log("equip response:", res);
        notifyServer();
      });
  };

  const getItemIcon = (beschreibung) => {
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

  return (
    <div className="inventory">
      <div className="title">
        <h2>Inventory</h2>
        <GiLockedChest className="chest-icon" />
      </div>
      <ul className="item-list">
        {items.map(
          (
            { quantity, beschreibung, itemId, itemStats, boostedStat, slot },
            index
          ) => (
            <li key={index} className="inventory-item" title={itemStats}>
              <div className="item-details">
                <p className="item-description">{beschreibung}</p>
                <p className="item-quantity">{quantity + "x"}</p>
              </div>
              <img
                src={new URL(getItemIcon(beschreibung), import.meta.url).href}
                alt={beschreibung}
                className="item-icon"
              />
              {boostedStat != "" ? (
                <button className="equip-btn" onClick={() => handleEquip(itemId, slot)}>
                  Equip
                </button>
              ) : (
                <div className="equipbutton"></div>
              )}
              {/* <input
                  type="number"
                  id={`delete-number-${index}`}
                  name={`delete-number-${index}`}
                  min="0"
                  max={quantity}
                  value={deleteQuantities[index]}
                  onChange={(e) => {
                    const value = Math.min(parseInt(e.target.value, 10), quantity);
                    setDeleteQuantities((prev) => {
                      const updatedQuantities = [...prev];
                      updatedQuantities[index] = value;
                      return updatedQuantities;
                    });
                  }}
                /> */}
              <TbTrashX className="delete-button" onClick={() => handleDeleteItem(itemId)} />
            </li>
          )
        )}
      </ul>
    </div>
  );
};

ItemList.propTypes = {
  userid: PropTypes.string,
};

export default ItemList;
