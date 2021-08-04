import React from 'react';
import axios from 'axios';
import { API_URL } from './apiConfig';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      to_do: [],
      doing: [],
      done: [],
      task: "",
    }
  }

  componentDidMount(){
    this.getTasks()
  }

  async getTasks(){
    try {
      const res = await axios.get(`${API_URL}/task`)
      const tasks = res.data
      console.log('tasks', tasks)
      let to_do = []
      let doing = []
      let done = []
      for (let i = 0; i < tasks.length; i++){
        if (tasks[i].category === "todo"){
          to_do.push(tasks[i])
        } else if (tasks[i].category === "doing"){
          doing.push(tasks[i])
        } else if (tasks[i].category === "done"){
          done.push(tasks[i])
        }
      }
      this.setState({
        to_do: to_do,
        doing: doing,
        done: done
      })
    } catch (err){
      console.log(err.message)
    }

  }

  async addTask(newTask){
    try {
      await axios.post(`${API_URL}/task`, newTask)
      this.getTasks()
    } catch (err){
      console.log(err.message)
    }
  }

  async updateTask(id, change){
    try {
      const res = await axios.patch(`${API_URL}/task/${id}`, change)
      console.log(res)
    } catch (err){
      console.log(err.message)
    }
  }

  createTask(){
    this.setState({
      task: "",
      to_do: [...this.state.to_do, { task_name: "" }]
    })
  }

  handleChange(e){
    this.setState({task: e.target.value})
  }

  handleBlur(id){
    if (this.state.task.length > 0){
      if (id){
        this.updateTask(parseInt(id), {
          task_name: this.state.task
        })
      } else {
        this.addTask({
          task_name: this.state.task,
          team: "",
          created_by: "",
          created_time: 0,
          deadline: 0,
          archived: false,
          category: "todo"
        })
      }
      this.getTasks()
    }
  }

  handleDragStart(e, id, cat){
    e.dataTransfer.setData('preCat', cat)
    e.dataTransfer.setData('id', id)
  }

  handleDrop(e, cat){
    let id = e.dataTransfer.getData('id')
    let preCat = e.dataTransfer.getData('preCat')
    let draggedTask = this.state[preCat].filter(task => task.id == id)[0]
    let preCatList = this.state[preCat]
    preCatList = preCatList.filter(task => task != draggedTask)
    this.setState({ 
      [cat]: [...this.state[cat], draggedTask], 
      [preCat]: preCatList
    })
    this.updateTask(parseInt(id), { category: cat })
  
  }

  handleDragOver(e){
    e.preventDefault()
  }

  render(){
    let { to_do, doing, done } = this.state

    console.log('to_do', to_do)

    return (
      <div className="App" style={{ padding: '40px', display: 'flex', justifyContent: 'center'}}>
        <div className="wrapper" style= {{ display: 'flex', justifyContent: 'space-between', width: '80%'}}>
          <div className="todo" style={{  width: '30%', position: 'relative'}}>
            <div style={{ backgroundColor: "#14213d" , color: '#ffffff', border: '1px solid grey', borderRadius: '6px', padding: '6px'}}>Todo</div>
            <button onClick={() => this.createTask()} style={{ position: 'absolute', left: '-15%', marginTop: '10px'}}>+</button>
            <div style={{ backgroundColor: "#14213d" , color: '#ffffff', border: '1px solid silver', borderRadius: '6px', minHeight:' 100px', padding: '10px', marginTop: '10px'}}>
              {to_do.map(task => 
                  <div draggable onDragStart={e => this.handleDragStart(e, task.id, "to_do")} style={{ backgroundColor: "#ffffff", border: '1px solid grey', padding: '5px 0', borderRadius: '4px', margin: '3px 0'}}>                     
                      <input onChange={(e) => this.handleChange(e)} value={task.task_name.length > 0 ? task.task_name : this.state.task} onBlur={() => this.handleBlur(task.id)} style={{ width: '95%', border: 'none', outline: 'none' }} />
                  </div>
              )}
            </div>
          </div>
          <div  className="doing" style={{  width: '30%'}}>
            <div style={{ backgroundColor: "#fca311" , border: '1px solid grey', borderRadius: '6px', padding: '6px'}}>Doing</div>
            <div   onDrop={e => this.handleDrop(e, "doing")} onDragOver={e => this.handleDragOver(e)}  style={{ backgroundColor: "#fca311" , border: '1px solid silver', borderRadius: '6px',  minHeight:' 100px', padding: '10px' , marginTop: '10px'}}>
              {doing.map(task => 
                <div  draggable onDragStart={e => this.handleDragStart(e, task.id, "doing")} style={{ border: '1px solid grey', padding: '5px 0', borderRadius: '4px', margin: '3px 0'}}>
                  {task.task_name}
                </div>
              )}
            </div>
          </div>
          <div className="done" style={{  width: '30%'}}>
            <div style={{ backgroundColor: "#e5e5e5" , border: '1px solid grey', borderRadius: '6px', padding: '6px'}}>Done</div>
            <div onDrop={e => this.handleDrop(e, "done")} onDragOver={e => this.handleDragOver(e)} style={{ backgroundColor: "#e5e5e5" , border: '1px solid silver', borderRadius: '6px', minHeight:' 100px', padding: '10px' , marginTop: '10px'}}>
              {done.map(task => 
                <div  draggable onDragStart={e => this.handleDragStart(e, task.id, "done")} style={{ border: '1px solid grey', padding: '5px 0', borderRadius: '4px', margin: '3px 0' }}>
                  {task.task_name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
