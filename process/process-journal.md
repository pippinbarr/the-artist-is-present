# Getting up and running (05-05-2022 15:25)

This feels a bit weird, but I'm attempting to apply MDM (Method for Design Materialization) even though all I'm doing is porting an old game from 2011 (okay let's face it, THE GAME from 2011) so that it works in modern browsers now that Flash is a goner. Still, it's not impossible there will be something worth saying, and besides it's good just to maintain the habit right?

The port so far has been remarkably smooth. I of course took the code and asset base of *The Artist is Present 2* as a starting point since it contains a huge amount of the necessary work (notably it reproduces all the key scenes from the original game). After cutting unneeded scenes (the apartment, the car) I had the kernel, but the key swap was to make the player a person other than Marina.

That turned out to be a little bit of a challenge that led down various paths of the entire game breaking over and over since it was designed to work with the Marina sprite, but I did get there in the end. Funniest bug was discovering that the player would automatically regenerate its appearance every time it walked into a new scene, meaning that their clothes, hair, skin color, etc. would constantly be shifting as they moved through the space. In itself quite a nice thought for a game (I wrote it down), but hard to track down and then hard to stick the landing on. But I did.

So we currently have a version in which you arrive outside and can navigate at least some way into the museum (I think it's broken because of the queue whispering stuff at the moment which won't be in the port).

It's nice to return to this world, and I feel at least somewhat optimistic about how well this has worked to this point. The queue behaviour is the obvious terrifying element I'm not yet ready to contemplate, but otherwise this is in a good position.
