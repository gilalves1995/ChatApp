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

socket.on('message', (message) => {
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', (location) => {
    console.log("Location: ", location);
    const html = Mustache.render(locationTemplate, {
        url: location.url,
        createdAt: moment(location.createdAt).format('h:mm a')
    });
    $messages.insertAdjacentHTML('beforeend', html);
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
