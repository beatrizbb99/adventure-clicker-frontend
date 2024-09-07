import '../css/Logout.css'

const Logout = () => {
    const handleLogout = async () => {
      try {
        const response = await axios.post(
          `https://adventure-clicker-backend.onrender.com/logout`
        );
  
        console.log(response.data);
      } catch (error) {
        console.error("Logout failed:", error);
      }
      window.location.href = "https://adventure-clicker.netlify.app/login";
    };
  
    const handleGoBack = () => {
      window.location.href = "https://adventure-clicker.netlify.app/";
    };
  
    return (
      <div className='logout-bg'>
        <div className='logout-container'>
          <h2>Do you want to logout?</h2>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleGoBack}>Go Back</button>
        </div>
      </div>
    );
  };


export default Logout;