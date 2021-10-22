import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <div>
            <h1>Hello this is Home of GPM site 😆</h1>
            <h2><Link to='/login'>Login</Link></h2>
            <h2><Link to='/register'>Register</Link></h2>
        </div>
    )
}
