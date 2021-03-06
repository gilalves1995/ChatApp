const socket = io();

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');


// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });


socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        url: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('roomData', ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    document.querySelector('#sidebar').innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
   e.preventDefault();
   // Disable form
   $messageFormButton.setAttribute('disabled', 'disabled');


   const message = e.target.elements.message.value;
   socket.emit('sendMessage', message, (error) => {
       // Enable form
       $messageFormButton.removeAttribute('disabled');
       $messageFormInput.value = '';
       $messageFormInput.focus();

       if (error) {
           console.log(error);
       } else {
           console.log('Message delivered');
       }
   });
});

document.querySelector('#send-location').addEventListener('click', (e) => {
   if (!navigator.geolocation) {
       return alert('Geolocation is not supported by your browser.');
   }
   $locationButton.setAttribute('disabled', 'disabled');

   navigator.geolocation.getCurrentPosition((position) => {
       socket.emit('sendLocation', {
           latitude: position.coords.latitude,
           longitude: position.coords.longitude
       }, () => {
           $locationButton.removeAttribute('disabled');
           console.log('Location was shared.');
       });
   });
});

socket.emit('join', { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
