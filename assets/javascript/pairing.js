$(document).ready(function() {
    
    console.log("working");
    // Create a variable to reference the database.
    var database = firebase.database();
    var gamePath = "";
    var userSignedIn = "nobody";
    var userEmail;
    var userUID;

    console.log("On page load, userSigned in is: " + userSignedIn);
    firebase.auth().onAuthStateChanged(function(userSignedIn) {
        if (userSignedIn) {
            // pulls user email and unique ID fron the returned user object
            userEmail = userSignedIn.email;
            userUID = userSignedIn.G
                console.log(userEmail);
                console.log(userUID);
            // calls the assignGame function
            assignGame();
            } else {
            // No user is signed in console logs...well you see
            console.log("no user signed in");
        }
    });

    // this function runs a loop that assigns the player to a game
    function assignGame(){

        
        // takes a snapshot of the current database
        database.ref().once("value", function(snapshot) {
            // runs a hard set for loop that will create or check no more than 10 games
            for (var i = 1; i < 11; i++) {
                // sets an existence check to the existence of a game branch numbered Game "i"
                var gameExists = snapshot.child("/Game_" + i).exists();
                var gamePlayers = snapshot.child("/Game_" + i).numChildren();
                var playerTwoExists = snapshot.child("/Game_" + i + "/playerTwo").exists();
                // if that game number does NOT exists, it is created and the user is place as player one and for loop exits
                if (!gameExists) {
                database.ref("/Game_" + i).update({
                    playerOne: userEmail,
                })
                gamePath = "/Game_" + i + "/playerOne";
                database.ref(gamePath).onDisconnect().remove();
                $("#signOut").attr("data-whoami", gamePath);
                return 
                }
                // if the game DOES exists AND there are less than two player in it, user is placed in game at player two
                // working on git issues
                else if (gameExists && gamePlayers < 2) {
                    if (playerTwoExists) {
                        database.ref("/Game_" + i).update({
                        playerOne: userEmail,
                        })
                        
                        gamePath = "/Game_" + i + "/playerOne";
                        database.ref(gamePath).onDisconnect().remove();
                        $("#signOut").attr("data-whoami", gamePath);
                        return
                    }
                    else {
                        database.ref("/Game_" + i).update({
                            playerTwo: userEmail,
                        })
                        
                        gamePath = "/Game_" + i + "/playerTwo";   
                        database.ref(gamePath).onDisconnect().remove();
                        $("#signOut").attr("data-whoami", gamePath);
                        return
                    }

                    database.ref("/Game_" + i).update({
                        playerTwo: userEmail,
                     }) 
                        gamePath = "/Game_" + i + "/playerTwo";
                        database.ref(gamePath).onDisconnect().remove();
                        $("#signOut").attr("data-whoami", gamePath);
                        return gamePath
                    }

                }
            })
    }

    $("#signOut").on("click", function() {
        var whoAmI = $(this).attr("data-whoami");
        firebase.auth().signOut().then(function() {
          console.log("Sign Out Successful");
          database.ref(whoAmI).remove();
        }).catch(function(error) {
          console.log("Sign Out Failed");
        });

    });
    
});