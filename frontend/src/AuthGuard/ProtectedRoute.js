import React, { useContext } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { AuthContext } from '../AuthContext'

// v6 router

function ProtectedRoute() {
    const context = useContext(AuthContext)
        const [token] = context.token

  return (
    <React.Fragment>
            {
                token ? <Outlet/> : <Navigate to={`/login`} />
            }
    </React.Fragment>
  )
}

export default ProtectedRoute
