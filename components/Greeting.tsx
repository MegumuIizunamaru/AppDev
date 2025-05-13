import React from 'react'

type Props = {
    name: string;
    lastname: string;
}

export default function Greeting ({name, lastname}:Props){
    return(
        <p>Hello, {name} {lastname}, my nigga</p>
    )
}
