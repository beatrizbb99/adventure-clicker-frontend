import { useState } from 'react';
import { GiSpinningSword } from "react-icons/gi";
import '../css/CreateGuild.css';
import axios from "axios";
axios.defaults.withCredentials = true;

const CreateGuild = ({ creatorId }) => {
  const [guildName, setGuildName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const handleInputChange = (event) => {
    setGuildName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      await axios.post(`https://adventure-clicker-backend.onrender.com/graphql`, {
        query: `
        mutation {
          createGilde(name: "${guildName}", creatorId: "${creatorId}") {
              id
              name
              score
              creatorId
          }
      }
          `,
      },
        { withCredentials: true }
      );
      setGuildName('');
      setLoading(false);
      setError(null);
    } catch (mutationError) {
      console.error('Error in createGilde mutation:', mutationError);
      setLoading(false);
      setError(mutationError.message);
    }
  };

  return (
    <div className='guild-container'>
      <div className='title-container'>
        <h2>Create a Guild</h2>
        <GiSpinningSword className='sword-icon' />
      </div>
      <form className='guild-form' onSubmit={handleSubmit}>
        <label className='guild-name'>
          Guild Name:
          <input className='guild-name-input' type='text' value={guildName} placeholder="Type guild name..." onChange={handleInputChange} />
        </label>
        <button className='create-btn' type='submit' disabled={loading}>
          {loading ? 'Creating...' : 'Create Guild'}
        </button>
      </form>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default CreateGuild;
