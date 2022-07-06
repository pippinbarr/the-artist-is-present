# To dos

## General
* ~~Fix collisions - you seem able to walk through walls with tapping~~
* ~~Dialogs need to be on a timer so they don't just stay up and free the player to not need to queue (or I get rid of the excuse mes and just push the person out actually.)~~
* ~~Integrating texts (this will be a way to check on functionality too)~~
* ~~Moma exterior people seemed not to queue properly...? fuck~~
* ~~There's a general shoving out of the way idea in general (will have to mediate with the queueing stuff though)~~
* ~~Red pixel on avatar?~~
* **COULD NOT REPRODUCE** ~~Just noticed some broken long hair (blonde with black tips)~~
  * ~~Later this turned out to be stacked people walking at the same time, giving the appearance of multilayered haircuts.~~
* ~~I seemed to be able to quickly rejoin the queue while already in the queue? Maybe just when on the point of being kicked out? Also everyone behind me wasn't in the queue (not that that matters as much)~~

* ~~With timed messages you run the risk of them happening while a dialog is already displaying. Could either~~
  * **NO**~~Have such messages repeat attempts until they succeed~~
  * **NOT QUITE**~~Alter dialogs so that you can append further messages to the current dialog (this would be kind of slick actually and not even so hard?) The beauty being that it totally avoids the issue of timing...~~
  * **INDEED**~~What about stacking callbacks though :/ (Doable I think?)~~
  * ~~Create a QUEUE of upcoming messages, and the ability to cancel all messages~~

## Title
* ~~Oh yeah, the title screen. Click to continue etc. See the original.~~
* **I COULD NOT BEAR IT** ~~Can I bear the slight text shifting of the title and authors texts? I'm guessing not :(~~
* ~~A little more twizzling left here~~

## Exterior
* ~~Time zone support~~
* ~~Time of day "lighting" in exterior~~
* ~~**EMAILED JIM** Double check time zone makes sense (since I'm literally in EDT right now)~~
* ~~Time of day dialog~~
* ~~Museum locking~~
* ~~Handle leaving exterior sides based on time~~
* ~~Player not hitting the door!?~~
* ~~Reinstate opening message~~

### The exterior generation
* ~~Consider allowing the player to get there first?! Seems unfair to let them wait before the museum opens only to find that there's already a huge queue?! But also... whatever the original did is kind of fair if this is just a port and not an improvement?~~

* ~~Generate new people only at a rate that won't overflow ticket queue OR marina queue~~
* **NAH** ~~Generate more people early?~~

## Tickets
* ~~Add ability to buy a ticket~~
* ~~Add proper guard text~~
* ~~Add ticket requirement~~
* ~~Make guard constant~~
* ~~Add the whole ticket queue concept (it's quite detailed in the original sadly)~~
  * ~~**I MEAN, NO, BUT I DID DO IT** But it may be doable comparatively simply I'm thinking...!?~~
* ~~The classic thing of depth with the extra bit of fg by the door~~
* **ADDED MESSAGE** ~~Ticket queue currently gets "joined" even if you bump into any person in the queue (not just the back person) - this mostly matters in terms of the message. The concern is that this queue isn't necessarily guaranteed to always flow left to right... though I suppose we could force the rate...??~~
* ~~Enter ticket area with a ticket message~~

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
* ~~Player can walk through the back wall (I think there may have been a message about that)~~
* ~~How to handle instances of the player LEAVING the queue voluntarily by walking away? Maybe just if their y changes sufficiently while they're in the queue then take them out?~~
* **SEPARATE SCENE, SEE HOW IT GOES** ~~Still need to trigger marina face (I wonder whether we might even load it as a simultaneous scene and show/hide it)~~
* ~~Some timing niceties.... like a delay before head up/down and you're next~~
* **MADE THE ENTRY POINT SMALLER...** ~~I worry about the legibility of the tape entrance point... it's kind of impossible to see for the player :/~~
* ~~Queue generation length by time of day (I guess just teleport in a bunch of people while the player is still outside, on an interval small enough that they don't mess each other up.)~~
* ~~Still getting a generation thing where there are overlapping people created in the hallway? (I wonder if it's to do with browser focus and not just the dialog? HMMM.)~~
* ~~In fact the game also crashed when I messed around with focus~~

* Set up the correct timing!

### Punishment
* ~~Remember the logic around a timer to sit down or you get kicked out (but that seems so unbelievably mean? Make it really lenient I guess.)~~
* ~~Add ejection for pushing~~
* ~~Add push-out from queue for stalling (essentially just a case of blocking someone, but different because it needs to account for queue etiquette and the idea there's a free space in front of you... fucking hell...)~~
* ~~Correct push out for marina queue (should only count a block if the player is behind someone and not overlapping them anymore...)~~

## The museum
* ~~Add closing timer and dialog (including interrupting current sitting player)~~
