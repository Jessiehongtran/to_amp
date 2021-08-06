import React from 'react';
import axios from 'axios';
import { API_URL } from './apiConfig';
import './App.css';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      todo: [],
      doing: [],
      done: [],
      task: "",
      team: "programming"
    }
  }

  componentDidMount(){
    this.getTasks()
  }

  async getTasks(){
    try {
      const res = await axios.get(`${API_URL}/task`)
      const tasks = res.data
      let todo = []
      let doing = []
      let done = []
      for (let i = 0; i < tasks.length; i++){
        if (tasks[i].category === "todo"){
          todo.push(tasks[i])
        } else if (tasks[i].category === "doing"){
          doing.push(tasks[i])
        } else if (tasks[i].category === "done"){
          done.push(tasks[i])
        }
      }
      this.setState({
        todo: todo,
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
      await axios.patch(`${API_URL}/task/${id}`, change)
    } catch (err){
      console.log(err.message)
    }
  }

  createTask(){
    this.setState({
      task: "",
      todo: [...this.state.todo, { task_name: "" }]
    })
  }

  handleChange(id, e){
    if (id){
      let { todo } = this.state;
      for (let i = 0; i < todo.length; i++){
        if (todo[i].id === parseInt(id)){
          todo[i].task_name = e.target.value
        }
      }
      this.setState({todo: todo})
    } else {
      this.setState({task: e.target.value})
    }
    
  }

  handleChangeSelect(id, e){
    this.updateTask(parseInt(id), {
      team: e.target.value
    })
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
    let draggedTask = this.state[preCat].filter(task => task.id === parseInt(id))[0]
    let preCatList = this.state[preCat]
    preCatList = preCatList.filter(task => task !== draggedTask)
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

    let { todo, doing, done } = this.state

    return (
      <div className="App" style={{ padding: '40px', display: 'flex', justifyContent: 'center'}}>
        <div className="wrapper" style= {{ display: 'flex', justifyContent: 'space-between', width: '80%'}}>
          <div className="todo" style={{  width: '30%', position: 'relative'}}>
            <div style={{ backgroundColor: "#14213d" , color: '#ffffff', border: '1px solid grey', borderRadius: '6px', padding: '6px'}}>Todo</div>
            <button onClick={() => this.createTask()} style={{ position: 'absolute', left: '-15%', marginTop: '10px'}}>+</button>
            <div onDrop={e => this.handleDrop(e, "todo")} onDragOver={e => this.handleDragOver(e)}   style={{ backgroundColor: "#14213d" , color: '#ffffff', border: '1px solid silver', borderRadius: '6px', minHeight:' 100px', padding: '10px', marginTop: '10px'}}>
              {todo.length > 0
              ? todo.map(task => 
                  <div draggable onDragStart={e => this.handleDragStart(e, task.id, "todo")} style={{ backgroundColor: "#ffffff", border: '1px solid grey', padding: '5px 0', borderRadius: '4px', margin: '3px 0'}}>                     
                      <input onChange={(e) => this.handleChange(task.id, e)} value={task.task_name.length > 0 ? task.task_name : this.state.task} onBlur={() => this.handleBlur(task.id)} style={{ textAlign: "left", width: '95%', border: 'none', outline: 'none', padding: '10px 0' }} />
                      <select onChange={(e) => this.handleChangeSelect(task.id, e)}>
                        <option selected={task.team === "programming"? true : false} value="programming">programming</option>
                        <option selected={task.team === "design"? true : false}  value="design">design</option>
                        <option selected={task.team === "content"? true : false}  value="content">content</option>
                      </select>
                  </div>
              )
              : null
              }
            </div>
          </div>
          <div  className="doing" style={{  width: '30%'}}>
            <div style={{ backgroundColor: "#fca311" , border: '1px solid grey', borderRadius: '6px', padding: '6px'}}>Doing</div>
            <div onDrop={e => this.handleDrop(e, "doing")} onDragOver={e => this.handleDragOver(e)}  style={{ backgroundColor: "#fca311" , border: '1px solid silver', borderRadius: '6px',  minHeight:' 100px', padding: '10px' , marginTop: '10px'}}>
              {doing.length > 0
              ? doing.map(task => 
                <div  draggable onDragStart={e => this.handleDragStart(e, task.id, "doing")} style={{ textAlign: "left", border: '1px solid grey', padding: '5px 10px', borderRadius: '4px', margin: '3px 0'}}>
                  {task.task_name}
                </div>
                ) 
              : null
              }
            </div>
          </div>
          <div className="done" style={{  width: '30%'}}>
            <div style={{ backgroundColor: "#e5e5e5" , border: '1px solid grey', borderRadius: '6px', padding: '6px'}}>Done</div>
            <div onDrop={e => this.handleDrop(e, "done")} onDragOver={e => this.handleDragOver(e)} style={{ backgroundColor: "#e5e5e5" , border: '1px solid silver', borderRadius: '6px', minHeight:' 100px', padding: '10px' , marginTop: '10px'}}>
              {done.length > 0
              ? done.map(task => 
                <div  draggable onDragStart={e => this.handleDragStart(e, task.id, "done")} style={{ textAlign: "left", border: '1px solid grey', padding: '5px 10px', borderRadius: '4px', margin: '3px 0' }}>
                  {task.task_name}
                </div>
                )
              : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
