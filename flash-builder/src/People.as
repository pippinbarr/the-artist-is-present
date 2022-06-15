package
{
	
	import org.flixel.*;
	
	public class People
	{
		
		public static var _people:Array;
		
		public function People()
		{
		}
		
		public static function init():void {
			_people = new Array();
		}
		
		
		public static function collide():void {
			
			var m:Message;
			
			// Check collisions between avatar and everyone
			for (var i:int = 1; i < _people.length; i++) {
				if (collideSpecific(_people[0],_people[i])) {
					// If the avatar would hit them, then stop. (Note that the avatar must be moving!)
					if (_people[0].velocity.x > 0 && _people[i].velocity.x == 0 && _people[i].velocity.y == 0 && i >= 4) {
						if (!_people[0]._queueMessageSeen && _people[0].x > FlxG.width * 1) {
							// If the avatar was moving left to right inside the exhibition, 
							// then this kind of stop must be because of a queuing situation
							_people[0]._queueMessageSeen = true;
							m = new Message(Texts.JOIN_MARINA_QUEUE);
						}
						else if (!_people[0]._ticketQueueMessageSeen && _people[0].x < FlxG.width && _people[0].y < FlxG.height) {
							_people[0]._ticketQueueMessageSeen = true;
							m = new Message(Texts.JOIN_TICKET_QUEUE);
						}
					}
					_people[0].velocity.x = 0; _people[0].velocity.y = 0;
					_people[0].x -= _people[0].direction.x;
					_people[0].y -= _people[0].direction.y;
					if (!_people[i]._guard) _people[i]._shovedCount++;
					trace("Avatar collision with " + i + ". x is now " + _people[0].x + "; y is now " + _people[0].y);
				}
			}
			
			_people[0]._waitingOn = null;
			// Check for queue-style waiting for the avatar
			for (i = 4; i < _people.length; i++) {
				if (_people[0]._hitBox.overlapsAt(_people[0]._hitBox.x + 10,_people[0]._hitBox.y,_people[i]._hitBox)) {
					_people[0]._waitingOn = _people[i];
					trace("Avatar is waiting on person " + i);
				}
			}
			
			// Check collisions between all the people
			for (i = 5; i < _people.length; i++) {
				if (collideSpecific(_people[i],_people[i-1])) {
					_people[i].velocity.x = 0; _people[i].velocity.y = 0;
					_people[i]._waitingOn = _people[i - 1];
				}
				else {
					//_people[i]._waitingOn = null;
				}
			}
			
			// Finally, check if any of the people are going to walk into the avatar
			for (i = 4; i < _people.length; i++) {
				if (collideSpecific(_people[i],_people[0])) {
					_people[i].velocity.x = 0; _people[i].velocity.y = 0;
					_people[i]._waitingOn = _people[0];
					trace("Person " + i + " is waiting on avatar.");
				}
			}
		}
		
		public static function collideSpecific(p1:Person, p2:Person):Boolean {
			
			if (p2 == null) {
				return false;
			}
			if (p1._hitBox.overlapsAt(p1._hitBox.x + p1.direction.x * 5,
				p1._hitBox.y + p1.direction.y * 5,
				p2._hitBox)) {
				return true;
			}
			else {
				return false;
			}
		}
		
		public static function waitingOn(p1:Person, p2:Person):Boolean {
			if (p2 == null) return false;
			if (p1.velocity.x == 0 && p1.velocity.y == 0 &&
				p2.velocity.x == 0 && p2.velocity.y == 0 &&
				p1._hitBox.overlapsAt(p1._hitBox.x + p1._intendedVelocityX,
					p1._hitBox.y + p1._intendedVelocityY,
					p2._hitBox)) {
				// Neither one is moving and if p1 moved the way they wanted
				// then they would hit p2. Therefore, they're waiting on them.
				return true;
			}
			else return false;
		}
		
		public static function remove(id:uint):void {
			if (id == 0) {
				_people.shift();
			}
			else if (id == _people.length-1) {
				_people.pop();
			}
			else {
				// The position is somewhere in the middle of the queue,
				// so we need to get fancier
				_people.splice(id,1);
			}
			// Rename everyone's IDs so we don't remove the wrong people for instance...
			updatePeopleIDs();		}
		
		public static function push(p:Person):void {
			p._id = _people.length;
			_people.push(p);
		}
		
		public static function updateIDs():void {
			for (var i:int = 0; i < _people.length; i++) {
				_people[i].ID = _people[i].y;
			}
		}
		
		public static function updatePeopleIDs():void {
			for (var i:int = 0; i < _people.length; i++) {
				_people[i]._id = i;
			}
		}
		
		public static function get length():uint {
			return _people.length;
		}
		
		
	}
}