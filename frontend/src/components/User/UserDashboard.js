import React, { useContext, useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../AuthContext'
import { useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'

function UserDashboard() {
  const context = useContext(AuthContext)
  const [token] = context.token
  const [jobs,setJobs] = useState([])

  const initJob = useCallback(() => {
    const getJob = async () => {
      const res = await axios.get(`/api/v1/job/all`, {
        headers: {
            Authorization: token
        }
    })
      setJobs(res.data.jobs)
    }
    getJob()
},[])


  useEffect(() => {
      initJob()
  },[])

  return (
    <div className='container'>
        <div className="row">
            <div className="col-md-12 text-center">
                <h3 className="display-3 text-success">User Dashboard</h3>
            </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="table table-responsive">
                <table className="table table-striped table-bordered table-hovered">
                    <thead>
                    
                        <tr className="text-center">
                          <th>JobCode</th>
                          <th>Title</th>
                          <th>Designation</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                          {
                              jobs && jobs.map((item,index) => {
                                return (
                                    <tr className={ item.isActive ? 'text-center text-success ' : 'text-danger text-center' } key={index} >
                                        <td> {item.jCode} </td>
                                        <td> { item.title} </td>
                                        <td> {item.designation} </td>
                                        <td> {item.status} </td>
                                        <td>
                                            <NavLink to={`/user/job/details/${item._id}`} className="btn btn-sm btn-info me-2">
                                                <i className="bi bi-info"></i>
                                            </NavLink>
                                           
                                        </td>
                                    </tr>
                                )
                              })
                          }
                    </tbody>
                </table>
            </div>
          </div>
        </div>
    </div>
  )
}

export default UserDashboard
