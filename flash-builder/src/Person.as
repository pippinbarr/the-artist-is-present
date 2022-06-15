package 
{
	
	import org.flixel.*;
	
	public class Person extends FlxSprite
	{
		
		// CONSTANTS
		public const WALK_SPEED:uint = 20;
		protected const AVATAR_SPEED:uint = 20;
		
		protected const DEBUG_TICKET_BUY_TIME:uint = 5; // Why doesn't this seem to do anything?
		protected const DEBUG_SIT_TIME:uint = 5;
				
		protected const HITBOX_HEIGHT:uint = 3;
		protected const HITBOX_WIDTH:uint = 10;
		
		public var _id:int;
		
		public var _hitBox:FlxSprite;
		public var _oldX:int;
		public var _oldY:int;
		
		public var direction:FlxPoint;
		public var _intendedVelocityX:int = 0;
		public var _intendedVelocityY:int = 0;
		
		public var _avatar:Boolean = false;
		public var _guard:Boolean = false;
		
		protected var _target:FlxSprite;
		public const TARGET_HEIGHT:uint = 3;
		public const TARGET_WIDTH:uint = 2;
		
		// STATE VARIABLES
		public var _waitingOn:Person = null;
		public var _hasTicket:Boolean = false;
		public var _ticketChecked:Boolean = false;
		public var _entering:Boolean = false;
		public var _next:Boolean = false;
		public var _sitter:Boolean = false;
		public var _sitting:Boolean = false;
		private var _instructionsGiven:Boolean = false;
		public var _seenMarina:Boolean = false;

		
		// TIMERS
		private var _ticketBuyingTimer:FlxTimer;
		private var _sitTimer:FlxTimer;
		private var _bigMarinaTimer:FlxTimer;
		
		// COLORS OF CLOTHING
		protected var _skinColor:uint;
		protected var _shirtColor:uint;
		protected var _sleeveColor:uint;
		protected var _beltColor:uint;
		protected var _pantColor:uint;
		protected var _dressColor:uint;
		protected var _shoeColor:uint;
		
		// BOOLEANS FOR TRACKING OUTFIT TYPES
		protected var _sleeveType:String;
		protected var _pantsType:String;
		protected var _pants:Boolean;
		
		public function Person(X:Number=0, Y:Number=0, SimpleGraphic:Class=null) {
			
			super(X, Y, SimpleGraphic);
			
			//velocity = new FlxPoint(0,0);
			_intendedVelocityX = 0;
			_intendedVelocityY = 0;
			direction = new FlxPoint(0,0);

			_avatar = false;
			
			_ticketBuyingTimer = new FlxTimer();
			_sitTimer = new FlxTimer();
			_bigMarinaTimer = new FlxTimer();
			
			// Load the walk cycle image and recolour it
			if (true) {
				// Pants
				loadGraphic(Assets.PANTS_WALK_CYCLE,true,true,14,35,true);
				_pants = true;
			}
			else {
				// Skirt / Dress
				loadGraphic(Assets.DRESS_WALK_CYCLE,true,true,14,35,true);
				_pants = false;
			}
			reColourPerson();
						
			// Set up the hitbox
			_hitBox = new FlxSprite();
			_hitBox.makeGraphic(HITBOX_WIDTH,HITBOX_HEIGHT,0x55FF0000);
			_hitBox.x = this.x + this.width/2 - _hitBox.width/2;
			_hitBox.y = this.y + this.height - _hitBox.height;
			_hitBox.visible = World.DEBUG_MODE;
			FlxG.state.add(_hitBox);
						
			// Default is facing right
			facing = RIGHT;
			
			// Add the walk cycle animations
			addAnimation("sideWalking",Assets.SIDE_WALK_FRAMES,10,true);
			addAnimation("frontWalking",Assets.FRONT_WALK_FRAMES,10,true);
			addAnimation("backWalking",Assets.BACK_WALK_FRAMES,10,true);
			addAnimation("sideIdle",[Assets.SIDE_IDLE_FRAME],0,false);
			addAnimation("frontIdle",[Assets.FRONT_IDLE_FRAME],0,false);
			addAnimation("backIdle",[Assets.BACK_IDLE_FRAME],0,false);
			addAnimation("sit",[Assets.SIT_FRAME],0,false);
			
		}
		
		public override function update():void {
			
			super.update();
						
			updateHitBoxPosition();
			
			// Create a direction vector which just indicates direction being traveled in
			if (!_avatar) {
				this.direction.x = this._intendedVelocityX / WALK_SPEED;
				this.direction.y = this._intendedVelocityY / WALK_SPEED;
			}
			else {
				this.direction.x = this.velocity.x / AVATAR_SPEED;
				this.direction.y = this.velocity.y / AVATAR_SPEED;
			}
			
			var m:Message;
			
			// Do the checks for whether we're at the counter
			// (The queue will form "naturally" behind us)
			if (this._hitBox.overlaps(World._counterHitBox)) {
				if (!this._hasTicket) {
					this.velocity.x = 0; this.velocity.y = 0;
					trace("Setting IV to 0 because overlaps counterHitBox");
					this._intendedVelocityX = 0; this._intendedVelocityY = 0;
					this.facing = UP;
					if (!this._avatar) {
						this._hasTicket = true;
						_ticketBuyingTimer.start(getTicketTime(),1,ticketBought);
					}
					else {
						this._hasTicket = true;
						World._ticketQueueBarrierOpen = true;
						this._intendedVelocityX = WALK_SPEED; this._intendedVelocityY = 0;
						m = new Message(Texts.BUY_TICKET);
					}
				}
			}
			else if (this._hitBox.overlaps(World._marinaQueueBarrier)) {
				if (!World._marinaQueueBarrierOpen && !this._sitter) {
					this.velocity.x = 0; this.velocity.y = 0;
					if (!this._avatar) this._intendedVelocityX = 0; this._intendedVelocityY = 0;
					if (this._avatar) {
						this.x -= 1; // Free the avatar up to not go through
					}
				}
				else if (World._marinaQueueBarrierOpen) {
					this._sitter = true;
					
					if (!this._avatar) this._intendedVelocityX = WALK_SPEED; this._intendedVelocityY = 0;
					World._marinaQueueBarrierOpen = false;
					this._waitingOn = null; // Can't be waiting on anyone any more
					if (this._avatar && !_instructionsGiven) { 
						m = new Message(Texts.FRONT_OF_QUEUE);
						_instructionsGiven = true;
					}
				}
			}
			else if (this._hitBox.overlaps(World._chairHM) && this._sitter && !this._sitting) {
				this.sit();
			}
			
			displayPerson();
		}
		
		
		
		private function ticketBought(t:FlxTimer):void {
			this._hasTicket = true;
			this.setTarget(World.QUEUE_TRANSITION_1_X,World.TICKET_QUEUE_Y);
			if (!this._avatar) this._intendedVelocityX = WALK_SPEED; this._intendedVelocityY = 0;
			this._entering = true;
		}
		
		private function sit():void {
			this.facing = RIGHT;
			this._sitting = true;	
			this._seenMarina = true;
			trace("Setting IV to 0 because in sit()");
			if (!this._avatar) this._intendedVelocityX = 0; this._intendedVelocityY = 0;
			this.velocity.x = 0; this.velocity.y = 0;
			
			if (!this._avatar) {
				var _sitTime:uint = getSitTime();
				trace("Current sitter will sit for " + _sitTime + " seconds.");
				_sitTimer.start(_sitTime,1,stand);
			}
			if (this._avatar) {
				_bigMarinaTimer.start(10,1,bigMarina);
				var a:Avatar = this as Avatar;
				a._timeToSitTimer.stop();
			}
			
			World.marinaLookUp();
		}
		
		private function bigMarina(t:FlxTimer):void {
			World.hiResMarina();
		}
		
		private function getSitTime():uint {
			return Time.getSitTime();
			//return DEBUG_SIT_TIME; 
		}
		
		private function getTicketTime():uint {
			return Time.getTicketTime();
			//return DEBUG_TICKET_TIME;
		}
		
		private function stand(t:FlxTimer):void {
			this._sitter = false;
			this._sitting = false;
			if (!this._avatar) this._intendedVelocityX = WALK_SPEED; this._intendedVelocityY = 0;
			World._marinaQueueBarrierOpen = true;
			this.y -= 5;
			World.marinaLooksDown();
		}
		
		public override function preUpdate():void {
			super.preUpdate();
			this._oldX = this.x;
			this._oldY = this.y;
		}
		
		public override function postUpdate():void {
			super.postUpdate();
			this.ID = this.y;
			if (this._sitting) {
				this.x = World.SIT_X;
				this.y = World.SIT_Y;
				this.updateHitBoxPosition();
			}
		}
		
		private function updateHitBoxPosition():void {
			_hitBox.x = this.x + this.width/2 - _hitBox.width/2;
			_hitBox.y = this.y + this.height - _hitBox.height;
		}
		
		public function faceUp():void {
			this.facing = UP;
		}
		
		public function setTarget(X:int, Y:int):void {
			// Set the destination for this queuer to walk to, making a new graphic if need be
			if (_target == null) {
				_target = new FlxSprite();
				if (_avatar) _target.makeGraphic(TARGET_HEIGHT,TARGET_WIDTH,0xAA00FF00);
				else _target.makeGraphic(TARGET_HEIGHT,TARGET_WIDTH,0xAA0000FF);
				FlxG.state.add(_target);
				_target.visible = World.DEBUG_MODE;
			}
			_target.x = X;
			_target.y = Y - _target.height;
		}
		
		public function getTargetX():int {
			return _target.x;
		}
		
		public function hasTarget():Boolean {
			return (_target != null);
		}
		
		public function atTarget():Boolean {
			if (this._target == null) return false;
			else return (this._hitBox.overlaps(this._target));
		}
		
		private function displayPerson():void {
			// If we're sitting down then we don't want to display anything different
			if (this._sitting) {
				play("sit",false);
			}
			else if (this.velocity.x > 0) {
				this.facing = RIGHT;
				play("sideWalking",false);
			}
			else if (this.velocity.x < 0) {
				this.facing = LEFT;
				play("sideWalking",false);
			}
			else if (this.velocity.y > 0) {
				this.facing = DOWN;
				play("frontWalking",false);
			}
			else if (this.velocity.y < 0) {
				this.facing = UP;
				play("backWalking",false);
			}
			else if (this.facing == LEFT || this.facing == RIGHT) {
				this.play("sideIdle", false);
			}
			else if (this.facing == DOWN) {
				this.play("frontIdle", false);
			}
			else if (this.facing == UP) {
				this.play("backIdle", false);
			}
		}
		
		protected function reColourPerson():void {
			// Basic features: eyes, hair, skin
			
			_skinColor = Assets.SKIN_COLORS[Math.floor(Math.random() * Assets.SKIN_COLORS.length)];
			replaceColor(Assets.EYE_COLOR,Assets.EYE_COLORS[Math.floor(Math.random() * Assets.EYE_COLORS.length)]);
			replaceColor(Assets.MOUTH_COLOR,Assets.MOUTH_COLORS[Math.floor(Math.random() * Assets.MOUTH_COLORS.length)]);
			replaceColor(Assets.SKIN_COLOR,_skinColor);
			
			_shirtColor = Assets.SHIRT_COLORS[Math.floor(Math.random() * Assets.SHIRT_COLORS.length)];
			_sleeveColor = Helpers.darkenHex(_shirtColor);
			
			// GENERATE THE TOP
			var topRandom:Number = Math.random();
			if (topRandom > 0.6) { 				
				_sleeveType = "LONG";
				
				replaceColor(Assets.BODY_COLOR,_shirtColor);
				replaceColor(Assets.T_COLOR,_sleeveColor);
				replaceColor(Assets.SLEEVE_COLOR,_sleeveColor);
			}
			else if (topRandom > 0.2) {
				_sleeveType = "SHORT";
				
				replaceColor(Assets.BODY_COLOR,_shirtColor);
				replaceColor(Assets.T_COLOR,_sleeveColor);
				replaceColor(Assets.SLEEVE_COLOR,_skinColor);
			}
			else {
				_sleeveType = "NONE";
				
				replaceColor(Assets.BODY_COLOR,_shirtColor);
				replaceColor(Assets.T_COLOR,_skinColor);
				replaceColor(Assets.SLEEVE_COLOR,_skinColor);
			}
			
			//////////// HAIR ////////////////
			var hairRandom:Number = Math.random();
			var hairColor:uint = Assets.HAIR_COLORS[Math.floor(Math.random() * Assets.HAIR_COLORS.length)];
			
			if (hairRandom > 0.65) {
				// Short hair
				replaceColor(Assets.MAIN_HAIR_COLOR,hairColor);
				replaceColor(Assets.LONGER_HAIR_COLOR,0x00000000);
				replaceColor(Assets.LONG_HAIR_COLOR,0x00000000);
				replaceColor(Assets.SHIRT_HAIR_COLOR,_shirtColor);
				replaceColor(Assets.NECK_HAIR_COLOR,_skinColor);
			}
			else if (hairRandom > 0.35) {
				// Medium hair
				replaceColor(Assets.MAIN_HAIR_COLOR,hairColor);
				replaceColor(Assets.LONGER_HAIR_COLOR,hairColor);
				replaceColor(Assets.LONG_HAIR_COLOR,0x00000000);
				replaceColor(Assets.SHIRT_HAIR_COLOR,_shirtColor);
				replaceColor(Assets.NECK_HAIR_COLOR,_skinColor);
			}
			else {
				// Long hair
				replaceColor(Assets.MAIN_HAIR_COLOR,hairColor);
				replaceColor(Assets.LONGER_HAIR_COLOR,hairColor);
				replaceColor(Assets.LONG_HAIR_COLOR,hairColor);
				replaceColor(Assets.SHIRT_HAIR_COLOR,hairColor);
				replaceColor(Assets.NECK_HAIR_COLOR,hairColor);
			}
			
			_beltColor = Assets.BELT_COLORS[Math.floor(Math.random() * Assets.BELT_COLORS.length)];
			
			var beltRandom:Number = Math.random();
			if (beltRandom > 0.7) {
				replaceColor(Assets.BELT_COLOR,_beltColor);
			}
			else {
				replaceColor(Assets.BELT_COLOR,_shirtColor);
			}
			
			if (_pants) {
				
				_pantColor = Assets.PANT_COLORS[Math.floor(Math.random() * Assets.PANT_COLORS.length)];
				
				if (Math.random() > 0.0) {
					// Let's stick with pants always for now
					replaceColor(Assets.PANT_COLOR,_pantColor);
					replaceColor(Assets.SHORTS_COLOR,_pantColor);
				}
				
			}
			else {
				_dressColor = Assets.DRESS_COLORS[Math.floor(Math.random() * Assets.DRESS_COLORS.length)];
				if (Math.random() > 0.0) {
					// Longer
					replaceColor(Assets.PANT_COLOR,_skinColor);
					replaceColor(Assets.SHORTS_COLOR,_dressColor);
					replaceColor(Assets.SHORT_SKIRT_COLOR,_dressColor);
					replaceColor(Assets.LONG_SKIRT_COLOR,_dressColor);
				}
			}
			
			_shoeColor = Assets.SHOE_COLORS[Math.floor(Math.random() * Assets.SHOE_COLORS.length)];
			
			if (Math.random() > 0.3) {
				// Shoes
				replaceColor(Assets.SHOE_COLOR,_shoeColor);
				replaceColor(Assets.BOOT_COLOR,_pantColor);
			}
			else {
				// Boots
				replaceColor(Assets.SHOE_COLOR,_shoeColor);
				replaceColor(Assets.BOOT_COLOR,_shoeColor);
			}
		}
		
		public override function destroy():void {
			trace("Person.destroy()");
			People.remove(this._id);
			
			_ticketBuyingTimer.destroy();
			_sitTimer.destroy();
			_waitingOn = null;
			_hitBox.destroy();
			FlxG.state.remove(_hitBox,true);
			if (_target != null) _target.destroy();
			FlxG.state.remove(_target);
			FlxG.state.remove(this,true);
			super.destroy();
		}
	}
}