import React from 'react'
import Avatar from './avatar';
import PropTypes from 'prop-types';

const PlayerList = (props) => {

    return (

        <div className="h-full bg-black/30 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col">

            {/* Header */}

            <div className="p-3 border-b border-white/10 text-center">
                <h2 className="text-white font-black text-lg">
                    PLAYERS
                </h2>

                <p className="text-white/50 text-xs">
                    {props.players?.length || 0} Players
                </p>
            </div>

            {/* Players */}

            <div className="flex lg:flex-col gap-1 overflow-y-auto p-2 space-y-1.5">
                {props.players.map((player) => (
                        <div key={player.id}
                             className={`p-2 rounded-xl flex items-center gap-2 justify-between ${ (player.id === props.drawerId)
                                                                                                 ? "bg-yellow-500/20 border border-yellow-400 shadow-lg shadow-yellow-500/20"
                                                                                                 : "bg-white/10"
                                }`}>
                            <div className="flex items-center gap-2">
                                <Avatar
                                    emoji={player.avatar || "😀"}/>
                                <div>
                                    <div className="flex flex-col">
                                        <div className="text-white font-bold gap-1text-sm">
                                            {player.name.charAt(0).toUpperCase() + player.name.slice(1) || ""}
                                            {player.id === props.hostId && <span className='text-amber-500 font-bold ml-2' style={{ fontSize: "17px"}}>H</span>}
                                        </div>
                    
                                    </div>
                                    <p className="text-yellow-300 text-xs flex gap-2 left-1 font-bold">
                                        {player.score} pts
                                        {player.id === props.drawerId && <span className='text-xs'>✏️</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div >
        </div >
    );
};

PlayerList.propTypes = {
    players: PropTypes.array,
    hostId: PropTypes.string,
    drawerId: PropTypes.string
}

PlayerList.defaultProps = {
    players: []
};

export default PlayerList;