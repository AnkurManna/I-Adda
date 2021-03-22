const socket = io('http://localhost:8000');
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const imageInput = document.getElementById('myfile');
const peopleInput = document.getElementById('receipt');
var imgData;
imageInput.addEventListener("change",function(){
    const file = this.files[0];
    
    
    if(file)
    {
        const reader = new FileReader();
        reader.addEventListener("load",function(){
        imgData = this.result;
        //console.log((imgData));
        
        },false);
        reader.readAsDataURL(file);
        
    }
})
/* we have to put upcoming messages in thi container */
const messageContainer = document.querySelector(".container123");
const peopleContainer = document.querySelector(".member-list");
var audio = new Audio('tone.mp3');

const appendPeople = (ppl) => {
    

    const liElement = document.createElement("li");
    
    const span1Element = document.createElement('span');
    span1Element.classList.add('status');
    span1Element.classList.add('online');

    const iElement = document.createElement('i');
    iElement.classList.add('fa');
    iElement.classList.add('fa-circle-o');
    span1Element.appendChild(iElement);

    const spanElement = document.createElement('span');
    spanElement.innerText = ppl;
    
    liElement.appendChild(span1Element);
    liElement.appendChild(spanElement);

    peopleContainer.appendChild(liElement);


}

const append = (message,position) =>{
    
    if (position == 'right' && message.tp=='txt')
    {
        message.name = 'You';
    }
    else if(message.tp=='join')
    {
        message.name = '';
    }

    if(message.txt)
    {
        console.log(message.txt);
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        const pElement = document.createElement('p');
        pElement.innerText = message.txt;
        const span1Element = document.createElement('span');
        span1Element.classList.add('msg-time');
        span1Element.innerText = message.time;
        messageElement.appendChild(pElement);
        messageElement.appendChild(span1Element);
        
        
        const nameElement = document.createElement('div');
        nameElement.classList.add('name');
        const spanElement = document.createElement('span');
        spanElement.innerText = message.name;
        nameElement.appendChild(spanElement);

        const liElement = document.createElement("li");
        if(message.name=='You')
        liElement.classList.add('me');

        liElement.appendChild(nameElement);
        liElement.appendChild(messageElement);
        messageContainer.appendChild(liElement);
    }


    if(message.img)
    {
        const nameElement = document.createElement('div');
        nameElement.classList.add('name');
        const spanElement = document.createElement('span');
        spanElement.innerText = message.name;
        nameElement.appendChild(spanElement);

        const liElement = document.createElement("li");
        if(message.name=='You')
        liElement.classList.add('me');

        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        const pElement = document.createElement('img');
        pElement.src = message.img;
        const span1Element = document.createElement('span');
        span1Element.classList.add('msg-time');
        span1Element.innerText = message.time;
        messageElement.appendChild(pElement);
        messageElement.appendChild(span1Element);

      


        liElement.appendChild(nameElement);
        liElement.appendChild(messageElement);
        messageContainer.appendChild(liElement);
    
    }
    

    messageInput.value = '';
    imageInput.value = '';
    if(position == 'left')
    {
        audio.play()
    }
    
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    
    console.log('in submit')
    //console.log(imgData);
    const text = messageInput.value;
    console.log(text);
    var peopleValue = peopleInput.value;
    if(!peopleValue)
    peopleValue = '';
    //console.log(tex);
    var d = new Date();
    var n = d.getHours() + ":" + d.getMinutes() ;
    message = {txt:text,img:imgData,people:peopleValue,time:n,tp:'txt'};
    //console.log('submitting form',message);
    socket.emit('send',message);
    append(message,'right');

    messageInput.value = '';
    imageInput.value = '';
    peopleInput.value = '';
    imgData = '';
    
    
    
})
const nme = prompt("Enter your name to join");
console.log(nme);
socket.emit('new-user-joined',nme);

//data contains only name 
socket.on('user-joined',data =>{
    var d = new Date();
    var n = d.getHours() + ":" + d.getMinutes() ;
    message = {txt:`${data} joined the chat`,time:n,tp:'join'};
    append(message,'right');
    appendPeople(data);
})

//{message:message,name:user[socket.id]})
socket.on('receive',data =>{
    message = data;
    console.log(message)
    append(message,'left');
})


socket.on('left',data =>{
    message = {txt:`${data} left the chat`,tp:'join'};
    append(message,'left');
})

socket.on('updatePeople',peopleArray => {
    var i;
    for(i=0;i<peopleArray.length;i++)
    appendPeople(peopleArray[i]);
})




$(function(){
	$('.chat-area > .chat-list').jScrollPane({
		mouseWheelSpeed: 30
	});
});