import React from 'react'
export default class Calls extends React.Component {
  constructor(props){
    super(props)
    this.localVideoref=React.createRef()
    this.remoteVideoref=React.createRef()
  }

  // const textref=React.createRef()
  
  componentDidMount(){
    const pc_config=null
    this.pc=new RTCPeerConnection(pc_config)
  this.pc.onicecandidate=(e)=>{
      if(e.candidate)
      console.log(JSON.stringify(e.candidate))
  }
  this.pc.oniceconnectionstatechange=(e)=>{
      console.log(e)
  }
  this.pc.onaddstream=(e)=>{
    this.remoteVideoref.current.srcObject=e.stream
  }

  const constraints={video:true}

  const success=(stream)=>{
    window.localStream=stream
    this.localVideoref.current.srcObject=stream
    this.pc.addStream(stream)
  }

  const faliure=(e)=>{
    console.log('getUserMedia Error:',e)
  }
  navigator.mediaDevices.getUserMedia(constraints)
  .then(success)
  .catch(faliure)
  }


   createOffer=()=>{
      console.log('offer')
      this.pc.createOffer({offerToReceive:1})
      .then(sdp=>{
          console.log(JSON.stringify(sdp))
          this.pc.setLocalDescription(sdp)
      },e=>{})
  }
    setRemoteDescription=()=>{
    const desc=JSON.parse(this.textref.value)
    this.pc.setRemoteDescription(new RTCSessionDescription(desc))
  }
   createAnswer=()=>{
    console.log('answer')
    this.pc.createAnswer({offerToReceiveVideo:1})
    .then(sdp=>{
      console.log(JSON.stringify(sdp))
      this.pc.setLocalDescription(sdp)
    },e=>{})
  }
   addCandidate=()=>{
    const candidate=JSON.parse(this.textref.value)
    console.log('Adding candidate:',candidate)
    this.pc.addIceCandidate(new RTCIceCandidate(candidate))
  }
  render(){
  return (
    <div>
      <video
      style={{width:240,height:240,margin:5,backgroundColor:'black'}}
      ref={this.localVideoref}
      autoPlay
      ></video>
      <video
      style={{width:240,height:240,margin:5,backgroundColor:'black'}}
      ref={this.remoteVideoref}
      autoPlay
      ></video>
     <br/>
      <button 
      onClick={this.createOffer}
      >Offer</button>
      <button
      onClick={this.createAnswer}
      >Answer</button>
      <br/>
      <textarea 
      ref={ref=>{this.textref=ref}}
      // ref={textref}
      />
      <br/>
      <button 
      onClick={this.setRemoteDescription}
      >set Remote Desc</button>
      <button 
      onClick={this.addCandidate}
      >Add Candidate</button>
    </div>
  )
}
}
