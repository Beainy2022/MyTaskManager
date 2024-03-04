import React, { useState, useEffect } from 'react';
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";



interface Task {
  title: string;
  description: string;
  dueDate: string;
  complete: boolean;
}

function App(): JSX.Element {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<string>('active');
  const [loading, setLoading] = useState<boolean>(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setTitle(event.target.value);
  }

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDescription(event.target.value);
  }

  const handleDueDateChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setDueDate(event.target.value);
  }

  const handleCheckboxChange = (index: number, fromCompleted: boolean): void => {
    if (fromCompleted) {
      const updatedCompletedTasks = [...completedTasks];
      updatedCompletedTasks[index].complete = false; 
      const taskToMove = updatedCompletedTasks.splice(index, 1)[0];
      setCompletedTasks(updatedCompletedTasks);
      setTasks([...tasks, taskToMove]);
    } else {
      const updatedTasks = [...tasks];
      updatedTasks[index].complete = !updatedTasks[index].complete;
      if (updatedTasks[index].complete) {
        setCompletedTasks([...completedTasks, updatedTasks[index]]);
        setTasks(tasks.filter((_, i) => i !== index));
      } else {
        setTasks(updatedTasks);
        setCompletedTasks(completedTasks.filter((_, i) => i !== index));
      }
    }
  }
  const handleSaveChanges = (): void => {
    const newTask: Task = { title, description, dueDate, complete: false };
    setTasks([...tasks, newTask]);

    setTitle('');
    setDescription('');
    setDueDate('');
    setActiveTab('active');
 
}



  const handleDeleteTask = (index: number): void => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  }

  const handleDeleteCompletedTask = (index: number): void => {
    const updatedCompletedTasks = [...completedTasks];
    updatedCompletedTasks.splice(index, 1);
    setCompletedTasks(updatedCompletedTasks);
  }

  const areFieldsFilled = (): boolean => {
    return title.trim() !== '' && description.trim() !== '' && dueDate.trim() !== '';
  }

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000); 
    return () => clearTimeout(timeout);
  }, [activeTab]);

  const handleTabChange = (tab: string): void => {
    setActiveTab(tab);
  }

  return (
    <>
    <div className="container justify-content-center align-items-center">
      
      <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === 'active' ? 'active' : ''}`} onClick={() => handleTabChange('active')} id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected={activeTab === 'active'}>Active Tasks</button>
        </li>
        <li className="nav-item" role="presentation">
          <button className={`nav-link ${activeTab === 'completed' ? 'active' : ''}`} onClick={() => handleTabChange('completed')} id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected={activeTab === 'completed'}>Completed Tasks</button>
        </li>
      </ul>

      <div className="tab-content" id="pills-tabContent">
        <div className={`tab-pane fade ${activeTab === 'active' ? 'show active' : ''}`} id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
          <button type="button" className="btn btn-dark mb-3" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Create New Task
          </button>

          <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">New Task</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form className="row g-3">
                    <div className="col-md-12">
                      <label className="form-label">Title</label>
                      <input type="text" className="form-control" value={title} onChange={handleTitleChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <input type="text" className="form-control" value={description} onChange={handleDescriptionChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Due Date</label>
                      <input type="date" className="form-control" value={dueDate} onChange={handleDueDateChange} required />
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" className="btn btn-primary" onClick={handleSaveChanges} disabled={!areFieldsFilled()}>Save</button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {tasks.length === 0 && <p>No active tasks.</p>}
              {tasks.length > 0 && (
                <div className="table-responsive">
                  <table className="table1 table">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Complete</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{task.title}</td>
                          <td>{task.description}</td>
                          <td>{task.dueDate}</td>
                          <td>
                            <input type="checkbox" checked={task.complete} onChange={() => handleCheckboxChange(index, false)} />
                          </td>
                          <td>
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteTask(index)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
        <div className={`tab-pane fade ${activeTab === 'completed' ? 'show active' : ''}`} id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              {completedTasks.length === 0 && <p>No completed tasks.</p>}
              {completedTasks.length > 0 && (
                <div className="table-responsive">
                  <table className="table bg-gray">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        <th scope="col">Due Date</th>
                        <th scope="col">Complete</th>
                        <th scope="col">Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedTasks.map((task, index) => (
                        <tr key={index}>
                          <th scope="row">{index + 1}</th>
                          <td>{task.title}</td>
                          <td>{task.description}</td>
                          <td>{task.dueDate}</td>
                          <td>
                            <input type="checkbox" checked={true} onChange={() => handleCheckboxChange(index, true)} />
                          </td>
                          <td>
                            <button type="button" className="btn btn-danger" onClick={() => handleDeleteCompletedTask(index)}>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      </div>
    </>
  )
}

export default App;
