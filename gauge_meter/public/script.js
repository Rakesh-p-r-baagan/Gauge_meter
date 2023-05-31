
var prevSpeed =0;
var currSpeed=0;

function addClass(){
  console.log("In add class");
    let newClass = "speed_" + currSpeed;
    let prevClass = "speed_" + prevSpeed;
    console.log(newClass);
    let el = document.getElementsByClassName("arrow_wrapper")[0];
    let km = document.getElementsByClassName("km")[0]; 

    if(el.classList.contains(prevClass)){
      console.log("inside contains");
        el.classList.remove(prevClass);
        el.classList.add(newClass);
    }
    else{
      el.classList.add(newClass);
    }
       
        km.innerHTML = currSpeed.toString();
        console.log(km.innerHTML);
    
    prevSpeed=currSpeed;
}  


//----------------------------------------------------------------see handler----------------------------------------------------------------
let reconnectAttempts = 0
const maxReconnectTries = 3
const eventSource = new EventSource('/events')
eventSource.addEventListener('message', (event) => {
  const { type, data } = JSON.parse(event.data)  //if the parsed object is { "type": "message", "data": "Hello, world!" }, the destructuring assignment const { type, data } = parsedObject; will assign the value "message" to the type variable and "Hello, world!" to the data variable.
   if (type === 'close') sse.close()
  const speed = data.speed; // Assuming 'speed' is the key in the SSE event data
  console.log(data);
 
  // Update the content with the received speed value
  // if(data<=180 && data>=0)
  //   {
        currSpeed=data;
        addClass();
    // }
  
});

eventSource.addEventListener('error', (event) => {
  console.error('Error in SSE connection:', event);
  // Handle error event, if needed
});
// sse.onmessage = m => {
//   const { type, data } = JSON.parse(m.data)  //if the parsed object is { "type": "message", "data": "Hello, world!" }, the destructuring assignment const { type, data } = parsedObject; will assign the value "message" to the type variable and "Hello, world!" to the data variable.
//   if (type === 'close') sse.close()
//   else 
//   {
//     if(data<=180 && data>=0)
//     {
//         newSpeed=data;
//         addClass();
//     }
//     console.log(data)
//   }
// }
// sse.onerror = () => {
//   if (reconnectAttempts > maxReconnectTries) {
//     sse.close()
//     alert("We have a baaad network error!")
//   } else {
//     reconnectAttempts++
//   }
// }



// let reconnectAttempts = 0
// const sse = new EventSource('/events')
// sse.onmessage = m => {
//   const { type, data } = JSON.parse(m.data)  //if the parsed object is { "type": "message", "data": "Hello, world!" }, the destructuring assignment const { type, data } = parsedObject; will assign the value "message" to the type variable and "Hello, world!" to the data variable.
//   if (type === 'close') sse.close()
//   else 
//   {
//     // var speed = 
//     console.log(data)
//   }
// }
// sse.onerror = () => {
//   if (reconnectAttempts > maxReconnectTries) {
//     sse.close()
//     alert("We have a baaad network error!")
//   } else {
//     reconnectAttempts++
//   }
// }