import React from 'react'
import PropTypes from 'prop-types'

function Avatar( props ){  
    const avatar = props.emoji;
    const name = props.name;
  return (
    <>
       <div>
         {avatar}    
       </div>
       <h1>
          {name}
       </h1>
    </>
  )
}
Avatar.propTypes = {
    emoji: PropTypes.string,
    name: PropTypes.string
}
Avatar.defaultProps = {
    emoji: "😀",
    name: ""
}

export default Avatar;
