const http = require('http');

// Сохранение сообщений
let messages = [];

// Создание HTTP сервера
const server = http.createServer((req, res) => {
  // Отправка главной страницы
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
      <html>
      <head>
	  <title>Chat Cherry</title>
        <style>
		body {position: absolute;left: 50%;top: 50%;transform: translate(-50%, -50%);}
          #messages {color: white; background: black;height: 410px;width: 410px; overflow: auto; }
		  #message { width: 410px;}
		  #time {width: 80px; color: #ffffff7a;font-size: 10px;}
		  li {list-style: none;}
		  ul {padding-left: 10px;}
        </style>
      </head>
      <body>
        <div id="messages"></div>
        <input id="message" maxlength="100"></input>
        <button onclick="sendMessage()">Send</button>
		<script>
window.addEventListener('keyup', keyup);
function keyup(event) {if (event.keyCode == 13) {sendMessage()}}
  </script>

        <script>
          // Функция отправки сообщения
          function sendMessage() {
            var message = document.getElementById('message').value;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                document.getElementById('message').value = '';
              }
            };
            xhttp.open('POST', '/message', true);
            xhttp.setRequestHeader('Content-type', 'text/plain');
            xhttp.send(message);
          }

          // Функция обновления сообщений
          function updateMessages() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
              if (this.readyState === 4 && this.status === 200) {
                document.getElementById('messages').innerHTML = this.responseText;
              }
            };
            xhttp.open('GET', '/messages', true);
            xhttp.send();
          }

          // Обновление сообщений каждые 3 секунды
          setInterval(updateMessages, 100);
        </script>
      </body>
      </html>
    `);
    res.end();
  }

  // Обработка запроса на добавление нового сообщения
  else if (req.url === '/message' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const message = body.trim();
      messages.push(message);
      res.end();
    });
  }

  // Обработка запроса на получение списка сообщений
  else if (req.url === '/messages' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`<ul>`);
    messages.forEach((message) => {
		const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1;
const day = currentDate.getDate();
const hours = currentDate.getHours();
const minutes = currentDate.getMinutes();
	res.write(`<li id="time">${day}.${month}.${year} ${hours}:${minutes}</li><li id="message">${message}</div>`);
    });
    res.write(`</ul>`);
    res.end();
  }

  // Если URL не найден
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Страница не найдена');
  }
});

// Запуск сервера на порту 3000
server.listen(80, () => {
  console.log('Сервер запущен на порту 3000');
});
