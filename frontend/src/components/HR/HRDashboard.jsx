import React, { useContext, useState, useCallback, useEffect } from 'react'
import { toast } from 'react-toastify'
import { AuthContext } from '../../AuthContext'
import { useNavigate, NavLink } from 'react-router-dom'
import axios from 'axios'

function HRDashboard(props) {
  const context = useContext(AuthContext)
  const [token] = context.token
  const [isHr] = context.authApi.isHr
  const [jobs,setJobs] = useState([])
  const [job,setJob] = useState({
    title: "",
    subTitle: "",
    designation: "",
    salary: 0,
    skills: '',
    exp: 0,
    description: "",
    jobType: "",
    position: 0,
    department: "",
    jobLevel: "",
    jobDegree: "",
    status: ""
})
const [isActive, setIsActive] = useState(false)
 const navigate = useNavigate()

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

    // edit 
    const editHandler = async (id) => {
          try {
              const res = await axios.get(`/api/v1/job/${id}`, {
                  headers: {
                    Authorization: token
                  }
              })
              console.log('single = ', res.data)
              setJob(res.data.job)
              setIsActive(res.data.job.isActive)
          } catch (err) {
            toast.error(err.msg)
          }
    }

    
    const readValue = (e) => {
      const { name, value } = e.target;
      setJob({...job, [name]:value })
  }


    // update info
    const updateHandler = async (e) => {
        e.preventDefault()
        try {
          let data = {
            ...job,
            isActive: isActive
        }
      console.log('update job =', data)

      await axios.patch(`/api/v1/job/update/${job._id}`, data, {
          headers: {
            Authorization: token
          }
      })
          .then(res => {
            toast.success(res.data.msg)
            navigate(`/hr/dashboard`)
          }).catch(err => toast.error(err.response.data.msg))
        } catch (err) {
          toast.error(err.msg)
        }
    }

    // delete handler 
    const deleteHandler = async (id) => {
        if(window.confirm(`Are you sure to delete job id= ${id}?`)) {
            await axios.delete(`/api/v1/job/delete/${id}`, {
                headers: {
                    Authorization:token
                }
            }).then(res => {
                toast.success(res.data.msg)
                navigate("/hr/dashboard")
                window.location.reload()
            })
            .catch(err => toast.error(err.response.data.msg))
        } else {
          toast.warning('delete terminated')
        }
    }


  return (
    <div className='container'>
        <div className="row">
            <div className="col-md-12 text-center">
                <h3 className="display-3 text-success">HR Dashboard</h3>
            </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table table-responsive">
                <table className="table table-striped table-bordered table-hovered">
                    <thead>
                        <tr>
                            <th colSpan={6}>
                                <NavLink to={`/job/create`} className="btn btn-success float-end">New Job</NavLink>
                            </th>
                        </tr>
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
                                            <NavLink to={`/job/details/${item._id}`} className="btn btn-sm btn-info me-2">
                                                <i className="bi bi-info"></i>
                                            </NavLink>
                                           {
                                              isHr ? (
                                                <>
                                                   <button onClick={() => editHandler(item._id)}  data-bs-toggle="modal" data-bs-target="#job" className="btn btn-sm btn-warning me-2">
                                                      <i className="bi bi-pencil"></i>
                                                  </button>
                                                  <button onClick={() => deleteHandler(item._id)}  className="btn btn-sm btn-danger">
                                                      <i className="bi bi-trash"></i>
                                                  </button>
                                                </>
                                              ) : null 
                                           }
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

        {/* update modal */}
        <div className="modal fade" id="job" tabIndex={-1}>
            <div className="modal-dialog  modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title text-success">Update Job</h4>
                  <button data-bs-dismiss="modal" className="btn-close"></button>
                </div>
                <div className="modal-body">
                <form autoComplete="off" onSubmit={updateHandler} >
                        <div className="form-group mt-2">
                          <label htmlFor="title">Title</label>
                          <input type="text" name="title" id="title" value={job.title} onChange={readValue} className="form-control" required />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="subTitle">Sub Title</label>
                            <input type="text" name="subTitle" id="subTitle" value={job.subTitle} onChange={readValue} className="form-control" required />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="designation">Designation</label>
                            <input type="text" name="designation" id="designation" value={job.designation} onChange={readValue} className="form-control" required />
                        </div>
                        <div className="form-group mt-2">
                           <label htmlFor="salary">Salary</label>
                           <input type="number" name="salary" id="salary" value={job.salary} onChange={readValue} className="form-control" required />
                        </div>
                        <div className="form-group mt-2">
                          <label htmlFor="skills">Skills</label>
                          <input type="text" name="skills" id="skills" value={job.skills} onChange={readValue} className="form-control" required />
                        </div>
                        <div className="form-group mt-2">
                          <label htmlFor="exp">Experience</label>
                          <input type="number" name="exp" id="exp" value={job.exp} onChange={readValue} className="form-control" required />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="description">Description</label>
                            <textarea name="description" id="description" value={job.description} onChange={readValue} cols="30" rows="5" className="form-control" required></textarea>
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="jobType">Job Type</label>
                            <select name="jobType" id="jobType" value={job.jobType} onChange={readValue} className="form-select">
                                <option value="null">Choose Job Type</option>
                                <option value="permanent">Permanent</option>
                                <option value="intern">Inetern</option>
                                <option value="contract">Contract</option>
                            </select>
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="position">Position</label>
                            <input type="number" name="position" id="position" value={job.position} onChange={readValue} className="form-control" required />
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="department">Department</label>
                            <select name="department" id="department" value={job.department} onChange={readValue} className="form-select">
                                <option value="null">Choose Department</option>
                                <option value="account">Account</option>
                                <option value="finance">Finance</option>
                                <option value="engineering">Engineering</option>
                                <option value="sales">Sales</option>
                                <option value="development">Development</option>
                                <option value="quality">Quality</option>
                                <option value="marketing">Martketing</option>
                                <option value="hr">HR</option>
                            </select>
                        </div>
                        <div className="form-group mt-2">
                          <label htmlFor="jobLevel">Job Level</label>
                          <select name="jobLevel" id="jobLevel" value={job.jobLevel} onChange={readValue} className="form-select">
                                <option value="null">Choose Job Level</option>
                                <option value="fulltime">FullTime</option>
                                <option value="parttime">PartTime</option>
                            </select>
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="jobDegree">Job qualification</label>
                            <select name="jobDegree" id="jobDegree" value={job.jobDegree} onChange={readValue} className="form-select">
                                <option value="null">Choose Qualification</option>
                                <option value="10th/SSLC">10th/SSLC</option>
                                <option value="12th/PU">12th/PU</option>
                                <option value="degree">Degree</option>
                                <option value="master's">Master's</option>
                                <option value="PG">PG</option>
                                <option value="Ph.D">Ph.D</option>
                            </select>
                          </div>

                        <div className="form-group mt-2">
                            <label htmlFor="status">Status</label>
                            <select name="status" id="status" className="form-select" value={job.status} onChange={readValue} >
                                <option value="null">Choose status</option>
                                <option value="open">Open</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                        <div className="form-group mt-2">
                            <label htmlFor="isActive"> Is Active </label>
                            <input type="checkbox" name="isActive" id="isActive" value={isActive} checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="form-check" />
                            <strong>
                                { isActive ? <span className='text-success'>Active</span>: <span className='text-danger'>Disabled</span>}
                            </strong>
                        </div>
                        <div className="form-group mt-2">
                            <input type="submit" value="Update Job" className="btn btn-outline-success" data-bs-dismiss="modal" />
                        </div>
                    </form>  
                </div>
                <div className="modal-footer"></div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default HRDashboard
