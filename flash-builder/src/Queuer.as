package
{
	import org.flixel.*;
	
	public class Queuer extends Person
	{
		
		private const MAX_WAIT_TIME:uint = 900; // In "frames"
		private const SHOVE_INTERIM:uint = 10;
		private const MAX_SHOVED:uint = 10; // Max number of times can be shoved in the SHOVE_INTERIM
		
		private var _waitCount:uint = 0; // Counter to delay shoving the avatar out of the way
		
		//private var _entering:Boolean = false;
		private var _enter1:Boolean = false;
		private var _enter2:Boolean = false;
		private var _enter3:Boolean = false;
		
		public var _shoveTimer:FlxTimer;
		public var _shovedCount:uint = 0;
		public var _shoveMessageTimer:FlxTimer;
		
		public function Queuer(X:Number=0, Y:Number=0, SimpleGraphic:Class=null) {
			super(X, Y, SimpleGraphic);	
			_intendedVelocityX = WALK_SPEED;
			_shoveTimer = new FlxTimer();
			_shoveTimer.start(SHOVE_INTERIM,1,shoveTimerDone);
			_shoveMessageTimer = new FlxTimer();
		}
		
		private function shoveTimerDone(t:FlxTimer):void {
			_shovedCount = 0;
			_shoveTimer.start(SHOVE_INTERIM,1,shoveTimerDone);
		}
		
		private function displayOverShoveMessage(t:FlxTimer):void {
			var m:Message = new Message(Texts.SHOVE_FAIL);
		}
		
		public override function update():void {
			
			super.update();
						
			var m:Message;

			if (_shovedCount > MAX_SHOVED) {
				// Too many
				World._avatar.x = 100 - World._avatar.width/2;
				World._avatar.y = FlxG.height + 50;
				World._avatar.facing = DOWN;
				World._avatar.velocity.x = 0;
				World._avatar.velocity.y = 0
				World._avatar._intendedVelocityX = 0;
				World._avatar._intendedVelocityY = 0
				_shovedCount = 0;
				_shoveMessageTimer.start(0.1,1,displayOverShoveMessage);
				World._cameraFocus.x = FlxG.width * Math.floor(World._avatar.x / FlxG.width) + FlxG.width * 0.5;
				trace("Queuer.update() SHOVE FAIL");
			}
						
			// First of all just assume we can move the way we want to
			this.velocity.x = this._intendedVelocityX; this.velocity.y = this._intendedVelocityY;
			
			// Now check if we've reached the target point
			if (atTarget() && hasTarget()) {
				
				// If so, stop.
				this.velocity.x = 0;
				this.velocity.y = 0;
				
				if (_entering) {
					// If we just finished at the ticket counter, then we need to walk
					// through the door and into the hall before moving up to
					// queue height
					this.setTarget(World.QUEUE_TRANSITION_1_X,World.DOOR_Y)
					trace("Sitting IVX to 0 because _entering");
					this._intendedVelocityX = 0;
					this._intendedVelocityY = WALK_SPEED;
					_entering = false;
					_enter1 = true;
					if (World.DEBUG_MODE) trace("Ticket buyer was at counter, now targeting door level.");
					if (World.DEBUG_MODE) trace("Set _intendedVelocity to " + _intendedVelocityX + "," + _intendedVelocityY);
				}
				else if (_enter1) {
					this.setTarget(World.QUEUE_TRANSITION_3_X,World.DOOR_Y);
					this._intendedVelocityX = WALK_SPEED;
					this._intendedVelocityY = 0;
					_enter1 = false;
					_enter2 = true;
					if (World.DEBUG_MODE) trace("Ticket buyer reached door level, now going east to first hall.");
				}
				else if (_enter2) {
					// If we're at the transition point to move up to queue height
					this.setTarget(World.QUEUE_TRANSITION_3_X,World.QUEUE_TRANSITION_4_Y);
					trace("Setting IVX to 0 because _enter2");
					this._intendedVelocityX = 0;
					this._intendedVelocityY = -WALK_SPEED;
					_enter2 = false;
					_enter3 = true;
					if (World.DEBUG_MODE) trace("Ticket buyer reached hall 1 transition, now going up to QUEUE level.");
				}
				else if (_enter3) {
					_enter3 = false;
					this._intendedVelocityX = WALK_SPEED;
					this._intendedVelocityY = 0;
					this._target = null;
					if (World.DEBUG_MODE) trace("Ticket buyer reached queue-joining entry point");
				}
				
				//return;
			}
						
			// Check if we're still colliding with the person and that they're not trying to move right now
			if (People.collideSpecific(this,_waitingOn)) {
				
				// If so, then we can't move yet
				this.velocity.x = 0;
				this.velocity.y = 0;
				
				// Check if we're waiting on the avatar
				if (_waitingOn._avatar && _waitingOn._waitingOn == null &&
					!(_waitingOn._hitBox.overlapsAt(_waitingOn._hitBox.x + 5,_waitingOn._hitBox.y,World._marinaQueueBarrier) &&
					 !World._marinaQueueBarrierOpen)
					 && !_waitingOn._sitter) {
					// If so, then we want to increase the counter so we can eventually shove them
					this._waitCount++;
				}
				else {
					this._waitCount = 0;
				}
				
				// Check if we're been waiting too long
				if (_waitCount > MAX_WAIT_TIME) {
					if (this._hitBox.y < World._queueBarrierHM.y && this._hitBox.x < FlxG.width) {
						// Then we're in the ticket queue, so shove them along.
						_waitingOn.y += 10;
						m = new Message(Texts.MOVE_IT);
					}
					else {
						// If so, move the avatar out of the way and reset the waiting counter
						if (_waitingOn._hitBox.y > this._hitBox.y + this._hitBox.height ||
							_waitingOn._hitBox.y + _waitingOn._hitBox.height < this._hitBox.y) {
							// The avatar is blocking us vertically
							if (_waitingOn._hitBox.x < this._hitBox.x) {
								// And is offset to our left
								_waitingOn.x -= _waitingOn._hitBox.width - (this._hitBox.x - _waitingOn._hitBox.x);
							}
							else {
								// And is offset to our right
								_waitingOn.x += this._hitBox.width - (_waitingOn._hitBox.x - this._hitBox.x);
							}
						}
						else if (_waitingOn._hitBox.x > this._hitBox.x + this._hitBox.width ||
							_waitingOn._hitBox.y + _waitingOn._hitBox.width < this._hitBox.x) {
							//if (_waitingOn._hitBox.y < this._hitBox.y) {
								// Is offset upwards
								_waitingOn.y += _waitingOn._hitBox.height * 2; // - (this._hitBox.y - _waitingOn._hitBox.y);
							//}
							//else {
								// Is offset downwards
							//	_waitingOn.y += this._hitBox.height - (_waitingOn._hitBox.y - this._hitBox.y);
							//}
							
						}
						m = new Message(Texts.SHOVE);
					}
					_waitCount = 0;
				}
				
			}
			else {
				this._waitingOn = null;
			}
						
		}
		
		
		
		public override function postUpdate():void {
			super.postUpdate();
			if (this.x > FlxG.width * 5) { 
				// If the queuer has gone off the edge of the final screen then destroy them.
				this.destroy();
			}
		}
		
		public override function destroy():void {
			super.destroy();
		}
		
	}
}