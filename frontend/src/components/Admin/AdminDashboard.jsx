import React, { useState, useEffect, useCallback, useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { AuthContext } from '../../AuthContext'

function AdminDashboard() {
  const [users,setUsers] = useState([])
  const context = useContext(AuthContext)
  const [token] = context.token

  const initUser = useCallback(() => {
    const getUsers = async () => {
      const res = await axios.get(`/api/v1/auth/users/all`, {
          headers: {
              Authorization: token
          }
      })
      setUsers(res.data.users)
  }
      getUsers()
  },[])

  
  useEffect(() => {
    initUser()
},[])

  return (
    <div className='container'>
        <div className="row">
            <div className="col-md-12 text-center">
                <h3 className="display-3 text-success">Admin Dashboard</h3>
            </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-lg-4 col-sm-12">
            <div className="card bg-success">
                <div className="card-body">
                    <h1 className="text-light">Users</h1>
                    <h4 className="text-light display-4 float-end"> { users ? users.length : 0} </h4>
                </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default AdminDashboard
