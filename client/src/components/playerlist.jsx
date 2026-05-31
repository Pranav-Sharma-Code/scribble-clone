import React from 'react'
import Avatar from './avatar';
import PropTypes from 'prop-types';

const PlayerList = (props) => {

    return (

        <div className="h-full bg-black/30 backdrop-blur-lg rounded-2xl overflow-hidden flex flex-col">

            {/* Header */}

            <div className=" p-4 border-b border-white/10 text-center">
                <h2 className="text-white font-black text-xl">
                    PLAYERS
                </h2>

                <p className="text-white/50 text-sm">
                    {props.players?.length || 0} Players
                </p>
            </div>

            {/* Players */}

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {props.players.map((player) => (
                        <div key={player.id}
                             className={`p-3 rounded-xl flex items-center gap-3 justify-between ${ (player.id === props.drawerId)
                                                                                                 ? "bg-yellow-500/20 border border-yellow-400 shadow-lg shadow-yellow-500/20"
                                                                                                 : "bg-white/10"
                                }`}>
                            <div className="flex items-center gap-3">
                                <Avatar
                                    emoji={player.avatar || "😀"}/>
                                <div>
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-white font-bold">
                                            {player.name}
                                        </span>
                                        {player.id === props.hostId && <span className='text-amber-600 font-bold'>Host</span>}
                                        {player.id === props.drawerId && <span>✏️</span>}
                                    </div>
                                    <p className="text-yellow-300 text-sm">
                                        Points: {player.score}
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