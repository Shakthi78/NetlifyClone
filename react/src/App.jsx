import { useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [text, setText] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = async(e)=>{
    e.preventDefault()
    const response = await axios.post('http://localhost:9000/project', {
      gitURL: text
    })
    setUrl(response.data.data.url)
  }

  return (
    <>
    <div id='form'>
      <div>
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBzt-chC9JOh1MBO8bbTXqq40s7caskYkFFmzcYiKxHvm41z1glMSAs3Xf0wUzjH-Rs2k&usqp=CAU" alt="" />
      </div>

      <div id="text">
        <h4>Enter your Vite React github repo link</h4>
        <div>
        <input id='input' value={text} type="text" onChange={(e)=> setText(e.target.value)} />
        <button id='btn' onClick={handleSubmit}>Submit</button>
        </div>
        
      </div>

      {url &&
        <div id="box">
          <h4 className='tag'>Your url is: </h4>
          <h4 className='tag up'>{url}</h4>
        </div>
      }
      
    </div>
      
    </>
  )
}

export default App
