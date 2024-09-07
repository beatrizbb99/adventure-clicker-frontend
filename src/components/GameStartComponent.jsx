import '../css/GameStartComponent.css'

const GameStartComponent = ({ onStartGame }) => {
    return (
        <div className='bg'>
            <div className="startbg">
                <div className='start'>
                    <button className='start-btn' onClick={onStartGame}>
                        Start Game
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GameStartComponent;