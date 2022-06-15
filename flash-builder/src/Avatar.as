package
{
	
	import flash.events.*;
	import flash.ui.Keyboard;
	
	import org.flixel.*;
	
	public class Avatar extends Person
	{
		private const AVATAR_TARGET_WIDTH:uint = 10;
		private const AVATAR_TARGET_HEIGHT:uint = 4;
		private const TIME_TO_SIT:uint = 15;
		
		public var _queueMessageSeen:Boolean = false;
		public var _ticketQueueMessageSeen:Boolean = false;
		
		public var _timeToSitTimer:FlxTimer;
						
		public var _keyUp:Boolean = true;
				
		public function Avatar(X:Number=0, Y:Number=0, SimpleGraphic:Class=null)
		{
			super(X, Y, SimpleGraphic);
						
			_hasTicket = false;
			
			_avatar = true;
			this.velocity.x = 0; this.velocity.y = 0;
			this._intendedVelocityX = 0; this._intendedVelocityY = 0;
						
			FlxG.stage.addEventListener(KeyboardEvent.KEY_DOWN,keyDown);
			FlxG.stage.addEventListener(KeyboardEvent.KEY_UP,keyUp);			
		}
		
		public override function update():void {			
			super.update();
			
			if (this._hasTicket && this._hitBox.y > World._ticketQueueBarrier.y + World._ticketQueueBarrier.height && World._ticketEntryBarrierOpen) {
				// If we go beyond the barrier after getting our ticket then we can't go back through
				World._ticketQueueBarrierOpen = false;
				World._ticketEntryBarrierOpen = false;
				trace("Closed ticketQueueBarrier.");
			}
			
			if (this._sitter && _timeToSitTimer == null) {
				_timeToSitTimer = new FlxTimer();
				_timeToSitTimer.start(TIME_TO_SIT,1,sitFail);
			}
			else if (!this._sitter && _timeToSitTimer != null) {
				_timeToSitTimer = null;
			}
		}
		
		// Called by a timer if the avatar doesn't actually sit down in time
		private function sitFail(t:FlxTimer):void {
			trace("Avatar.sitFail");
			this.x = 0 + 100 - this.width / 2;
			this.y = FlxG.height + 50;
			this.velocity.x = 0; this.velocity.y = 0;
			//this._intendedVelocity.x = 0; this._intendedVelocity.y = 0;
			this.facing = DOWN;
			var m:Message = new Message(Texts.SIT_FAIL);
			World._cameraFocus.x = FlxG.width * Math.floor(this.x / FlxG.width) + FlxG.width * 0.5;
		}
		
		public override function preUpdate():void {
			super.preUpdate();
		}
		
		private function keyDown(e:KeyboardEvent):void {
			
			// Return immediately if the game is paused (due to a message)
			if (FlxG.paused) {
				return;
			}
			
			// Return immediately if they haven't released the key
			if (!_keyUp) {
				return;
			}
			
			// Return immediately if they're sitting (don't listen to the presses)
			if (_sitting) {
				return;
			}
			
			// Otherwise handle changes in velocity - if the avatar is stopped
			// or is walking the other way, then we can make them move
			if (e.keyCode == Keyboard.LEFT && this.velocity.x >= 0) {
				this.velocity.x = -AVATAR_SPEED;
				this.velocity.y = 0;
			}
			else if (e.keyCode == Keyboard.RIGHT && this.velocity.x <= 0) {
				this.velocity.x = AVATAR_SPEED;
				this.velocity.y = 0;
			}
			else if (e.keyCode == Keyboard.UP && this.velocity.y >= 0) {
				this.velocity.y = -AVATAR_SPEED;
				this.velocity.x = 0;
			}
			else if (e.keyCode == Keyboard.DOWN && this.velocity.y <= 0) {
				this.velocity.y = AVATAR_SPEED;
				this.velocity.x = 0;
			}
				
			else {
				// If the avatar is moving the appropriate direction and they're 
				// pressing down on the same key again, then that means stop.
				if ((e.keyCode == Keyboard.LEFT && this.velocity.x < 0) ||
					(e.keyCode == Keyboard.RIGHT && this.velocity.x > 0)) {
					this.velocity.x = 0;
				}
				if ((e.keyCode == Keyboard.UP && this.velocity.y < 0) ||
					(e.keyCode == Keyboard.DOWN && this.velocity.y > 0)) {
					this.velocity.y = 0;
				}
				
			}
			
			_keyUp = false;
			
		}
		
		private function keyUp(e:KeyboardEvent):void {
			_keyUp = true;
		}
		
		public function faceDown():void {
			this.facing = DOWN;
		}
		
		public override function destroy():void {
			super.destroy();
		}
	}
}