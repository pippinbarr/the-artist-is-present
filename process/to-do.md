# To dos

## General
* ~~Fix collisions - you seem able to walk through walls with tapping~~

## Exterior
* ~~Time zone support~~
* ~~Time of day "lighting" in exterior~~
* ~~**EMAILED JIM** Double check time zone makes sense (since I'm literally in EDT right now)~~
* Time of day dialog
* Museum locking

## Tickets
* ~~Add ability to buy a ticket~~
* ~~Add proper guard text~~
* ~~Add ticket requirement~~
* ~~Make guard constant~~
* ~~Add the whole ticket queue concept (it's quite detailed in the original sadly)~~
  * ~~**I MEAN, NO, BUT I DID DO IT** But it may be doable comparatively simply I'm thinking...!?~~
* ~~The classic thing of depth with the extra bit of fg by the door~~

* Ticket queue currently gets "joined" even if you bump into any person in the queue (not just the back person) - this mostly matters in terms of the message. The concern is that this queue isn't necessarily guaranteed to always flow left to right... though I suppose we could force the rate...??

## The performance
* ~~Add tape collider~~
* ~~Add tape message (original didn't care if you were inside or outside)~~
* ~~Make guards constant~~
* ~~Get a Marina back into the chair~~
* ~~Create the marina face view~~
* ~~Allow player to sit down and switch to face view~~
* ~~Consider how abrupt that transition is (what did the original do?)~~
* ~~Send in new queue members over time (instead of magically adding them)~~
* ~~Queue generation (at all)~~
* ~~Remove all the old crying, blinking, etc. logic~~
* ~~Queue movement~~
* ~~Trigger the "you're next" sequence~~
* ~~Allow player to join the queue (as in with a message)~~
* ~~Head up and down~~
* ~~Joining the queue message~~

* Some timing niceties.... like a delay before head up/down and you're next
* I worry about the legibility of the entrance point... it's kind of impossible to see for the player :/
* How to handle instances of the player LEAVING the queue voluntarily by walking away? Maybe just if their y changes sufficiently while they're in the queue then take them out?
* Queue generation length by time of day (I guess just teleport in a bunch of people while the player is still outside)

### Punishment

* Remember the logic around a timer to sit down or you get kicked out (but that seems so unbelievably mean? Make it really lenient I guess.)
* Add ejection for pushing
* Add push-out from queue for stalling

## The museum
* Add closing timer and dialog (including interrupting current sitting player)
