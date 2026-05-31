import React from 'react';
import PropTypes from 'prop-types';

function Avatar({ emoji }) {
    return (
        <div className=" h-12 w-12 rounded-full  bg-white/10 flex items-center justify-center text-2xl border border-white/10">
            {emoji}
        </div>
    );
}

Avatar.propTypes = {
    emoji: PropTypes.string
};

Avatar.defaultProps = {
    emoji: "😀"
};

export default Avatar;