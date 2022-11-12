import React from 'react'

const MyParagraph = (props) => {
    console.log('my paragraph running')
return <p>{props.children}</p>
}

export default MyParagraph