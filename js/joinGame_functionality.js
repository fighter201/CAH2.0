





socket = io('/DB');
        socket.emit('getGames');
        socket.on('res', function(data) {
            var liste = document.getElementById('gameList');
            var initialContent = liste.innerHTML;
            
            if (initialContent === undefined){
                initialContent = "";
            }

            // console.log(data.length);
            
            var newContent = '';
            var oldContent = initialContent;
            // // liste.innerHTML='<li>ein weiterer test</li>';
            data.forEach(element => {
                var gameID = element.gameID;
                newContent = oldContent + "<li><button id='" + gameID + "', onclick=\"join('" + gameID + "')\">" + gameID +"</button></li>";
                oldContent = newContent;
            });

            liste.innerHTML = newContent;
            // socket.disconnect();
            // return false;
        })
		
		function join(gameID){
            // console.log('button pressed: ' + gameID);
            socket.emit('joinGame', gameID);
            socket.on('canJoinGame', function(canJoin) {
                if (canJoin){
                    console.log('button clicked: ' + gameID);
                    window.sessionStorage.setItem('gameID', gameID);
                    window.sessionStorage.setItem('master', false);
                    console.log(window.sessionStorage.getItem('gameID'));
                    window.location.href='waitingGamestart.html';
                } else {
                    window.alert('cant join Lobby full');
                }
            });
            
            
        }