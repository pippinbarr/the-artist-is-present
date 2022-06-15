package
{
	import flash.system.*;
	
	import org.flixel.*;
	import org.flixel.plugin.photonstorm.FlxCollision;
	
	public class World
	{
		public static const DEBUG_MODE:Boolean = false;
		public static const COLLISION_MODE:Boolean = false;
		public static const DEBUG_MEMORY:Boolean = false;
		
		private static const BLINK_VARIANCE:uint = 5;
		private static const BLINK_MINIMUM:uint = 5;
		private static const BLINK_FRAME_RATE:uint = 5;
		
		private static var _entryDoorsClosed:Boolean = true;
		
		public static const QUEUE_Y:int = 63;
		public static var _queueBarrier:FlxSprite;
		public static var _queueBarrierHM:FlxSprite;
		
		public static const TICKET_QUEUE_Y:int = 55;
		public static var _ticketQueueBarrier:FlxSprite;
		public static var _ticketQueueBarrierOpen:Boolean = false;
		public static var _ticketEntryBarrier:FlxSprite;
		public static var _ticketEntryBarrierOpen:Boolean = true;
		public static var _marinaQueueBarrier:FlxSprite;
		public static var _marinaQueueBarrierOpen:Boolean = true;
		
		public static const COUNTER_X:int = 100;
		public static var _counterHitBox:FlxSprite;
		
		public static const DOOR_Y:int = 75;
		
		public static const QUEUE_TRANSITION_1_X:int = 145;
		public static const QUEUE_TRANSITION_2_Y:int = DOOR_Y;
		public static const QUEUE_TRANSITION_3_X:int = 300;
		public static const QUEUE_TRANSITION_4_Y:int = QUEUE_Y - 2;
		
		// HEAR YE HEAR YE - HARDCODED NUMBERS - AND THEY DID END UP BITING ME IN THE ASS
		public static const SIT_X:int = 800 + 135;
		public static const SIT_Y:int = 31;
		
		private static var _entryBG:FlxSprite;
		private static var _entryFG:FlxSprite;
		private static var _entryHM:FlxSprite;
		
		public static var _entryDoors:FlxSprite;
		private static var _entryDoorsHM:FlxSprite;
		private static var _entryDoorsTrigger:FlxSprite;
		
		private static var _ticketsBG:FlxSprite;
		private static var _ticketsFG:FlxSprite;
		private static var _ticketsFGFG:FlxSprite;
		private static var _ticketsHM:FlxSprite;
		
		private static var _ticketBarrier:FlxSprite;
		
		private static var _hall1BG:FlxSprite;
		private static var _hall1FG:FlxSprite;
		private static var _hall1FGFG:FlxSprite;
		private static var _hall1HM:FlxSprite;
		//		private static var _hall2BG:FlxSprite;
		//		private static var _hall2HM:FlxSprite;
		private static var _hall3BG:FlxSprite;
		private static var _hall3HM:FlxSprite;
		private static var _hall4BG:FlxSprite;
		private static var _hall4HM:FlxSprite;
		
		private static var _oliveTreesTrigger:FlxSprite;
		private static var _starryNightTrigger:FlxSprite;
		private static var _mapTrigger:FlxSprite;
		private static var _soupCansTrigger:FlxSprite;
		private static var _dancersTrigger:FlxSprite;
		
		private static var _marinaRoom:FlxSprite;
		private static var _marinaRoomHM:FlxSprite;
		private static var _marinaRoomTapeHM:FlxSprite;
		
		public static var _tableAndChairs:FlxSprite;
		public static var _tableAndChairsHM:FlxSprite;
		public static var _marina:FlxSprite;
		public static var _hiResMarina:FlxSprite;
		
		public static var _chairHM:FlxSprite;
		
		private static var _ticketGuard:Guard;
		private static var _marinaGuard1:Guard;
		private static var _marinaGuard2:Guard;
		
		private static var _marinaTimer:FlxTimer;
		
		private static var _light:FlxSprite;
		
		public static var _avatar:Avatar;
		public static var _cameraFocus:FlxPoint;
		
		private static var _m:Message;
		
		public static var _messages:Messages;
		
		
		public function World()
		{
		}
		
		public static function init(avatar:Avatar):void {
			_marinaTimer = new FlxTimer();
			_avatar = avatar;
			_cameraFocus = new FlxPoint();
			World._cameraFocus.x = FlxG.width * Math.floor(_avatar.x / FlxG.width) + FlxG.width * 0.5;
			_messages = new Messages();
		}
		
		public static function marinaLookUp():void {
			_marinaTimer.start(5,1,marinaLooksUp);
		}
		
		public static function marinaLooksDown():void {
			_marina.play("upToDown");
		}
		
		private static function marinaLooksUp(t:FlxTimer):void {
			_marina.play("downToUp");
		}
		
		public static function hiResMarina():void {
			FlxG.state.add(_hiResMarina);
			_hiResMarina.play("open");
			_marinaTimer.start(getBlinkTime(),1,blink);
		}
		
		private static function blink(t:FlxTimer):void {
			_hiResMarina.play("blink");
			_marinaTimer.start(getBlinkTime(),1,blink);
		}
		
		private static function getBlinkTime():uint {
			return Math.random() * BLINK_VARIANCE + BLINK_MINIMUM;
		}
		
		public static function collide(avatar:Avatar):void {
			
			var collided:Boolean = false;
			var m:Message;
			
			_light.alpha = Time.getLight();
			
			if (World.DEBUG_MEMORY) trace("World.collide() top");
			if (World.DEBUG_MEMORY) traceMemory();
			
			// Check for the avatar going off screen in either side
			if (avatar._hitBox.y + avatar._hitBox.height + avatar.direction.y*2 >= FlxG.height * 2 - 2) {
				collided = true;
			}
			else if ((avatar._hitBox.x + avatar.direction.x*2 < 0 || avatar._hitBox.x + avatar.direction.x*2 > FlxG.width) && 
					 (avatar._hitBox.y + avatar._hitBox.height + avatar.direction.y*2 > FlxG.height * 2 ||
					  (avatar._hitBox.y + avatar.direction.y*2 <= FlxG.height * 2 - 15) && avatar._hitBox.y > FlxG.height)) {
				trace("Pavement hit.");
				collided = true;
			}
			
			if (World.DEBUG_MEMORY) trace("Checking _entryHM");
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox, _entryHM)) {
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			if (World.DEBUG_MEMORY) trace("Checking LEAVING ENTRY SCREEN");
			//else 
			if (_avatar.y > FlxG.height && 
				(_avatar.x + avatar.direction.x*2 < 0 || _avatar.x + _avatar.width + avatar.direction.x*2 > FlxG.width) &&
				Time.museumIsOpen() &&
				!_avatar._seenMarina) {
				// If they are walking off the entry screen and the museum is open and they haven't sat with her, 
				// then we make them stay -- otherwise they can walk off if they want to
				m = new Message(Texts.LEAVING_ENTRY_SCREEN);
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			if (World.DEBUG_MEMORY) trace("Checking LEAVING TICKET SCREEN");
			//else 
			if (_avatar.y > 0 && 
				_avatar.y < FlxG.height && 
				_avatar._hitBox.x + avatar.direction.x*2 <= 0 &&
				_avatar.velocity.x < 0) {
				m = new Message(Texts.LEAVING_TICKET_SCREEN);
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			if (World.DEBUG_MEMORY) trace("Checking _entryDoorsHM");
			//else 
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox, 
				_entryDoorsHM)) {
				collided = true;
				if (!Time.museumIsOpen()) m = new Message(Texts.MOMA_DOORS_CLOSED);
			}
			if (World.DEBUG_MEMORY) traceMemory();
			if (World.DEBUG_MEMORY) trace("checking _ticketsHM");
			//else 
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox, 
				_ticketsHM)) {
				trace("Hit tickets room wall.");
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			if (World.DEBUG_MEMORY) trace("checking _hall1HM");
			//else 
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox, _hall1HM)) {
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _hall3HM");
			//else 
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox, _hall3HM)) {
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _hall4HM");
			//else 
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox, _hall4HM)) {
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _marinaRoomHM");
			//else 
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox, _marinaRoomHM)) {
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _marinaRoomTapeHM");
			//else 
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox, _marinaRoomTapeHM)) {
				collided = true;
				m = new Message(Texts.HIT_TAPE);
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("handleFrontDoors()");
			handleFrontDoors();
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _queueBarrier");
			if (avatar._hitBox.overlapsAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_queueBarrierHM)) {
				if (World.DEBUG_MODE) trace("Hit queue barrier.");
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _ticketBarrier");
			if (avatar._hitBox.overlapsAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_ticketBarrier)) {
				if (!avatar._hasTicket) {
					m = new Message(Texts.TICKET_CHECK_NO_TICKET);
					collided = true;
				}
				else if (!avatar._ticketChecked) {
					m = new Message(Texts.TICKET_CHECK_WITH_TICKET);
					avatar._ticketChecked = true;
				}
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _ticketQueueBarrier");
			if (avatar._hitBox.overlapsAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_ticketQueueBarrier) &&
				!_ticketQueueBarrierOpen) {
				if (!_avatar._hasTicket) {
					m = new Message(Texts.ENTER_TICKET_QUEUE_WRONG_WAY_NO_TICKET);
				}
				else {
					m = new Message(Texts.ENTER_TICKET_QUEUE_WRONG_WAY_WITH_TICKET);
				}
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _ticketEntryBarrier");
			if (avatar._hitBox.overlapsAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_ticketEntryBarrier) &&
				!_ticketEntryBarrierOpen) {
				m = new Message(Texts.ENTER_TICKET_QUEUE_WITH_TICKET);
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _starryNight");
			if (_avatar._hitBox.overlapsAt(_avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_starryNightTrigger)) {
				m = new Message(Texts.STARRY_NIGHT);
				collided = true;								
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _oliveTrees");
			if (_avatar._hitBox.overlapsAt(_avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_oliveTreesTrigger)) {
				m = new Message(Texts.OLIVE_TREES);
				collided = true;								
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _soupCans");			
			if (_avatar._hitBox.overlapsAt(_avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_soupCansTrigger)) {
				m = new Message(Texts.SOUP_CANS);
				collided = true;								
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _dancers");
			if (_avatar._hitBox.overlapsAt(_avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_dancersTrigger)) {
				m = new Message(Texts.DANCERS);
				collided = true;								
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking _marinaQueueBarrier");
			if (_avatar._hitBox.overlapsAt(_avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				_marinaQueueBarrier) && !_marinaQueueBarrierOpen && !_avatar._sitter) {
				collided = true;
				m = new Message(Texts.PLEASE_WAIT);
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking sitter status");
			if (_avatar._hitBox.x + _avatar._hitBox.width < _marinaQueueBarrier.x && _avatar._sitter) {
				_marinaQueueBarrierOpen = true;
				_avatar._sitter = false;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking table and chairs");
			if (FlxCollision.pixelPerfectCheckAt(avatar._hitBox.x + avatar.direction.x*2,
				avatar._hitBox.y + avatar.direction.y*2,
				avatar._hitBox,
				_tableAndChairsHM)) {
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Checking LEAVE MARINA AREA");
			if (_avatar._hitBox.x + _avatar._hitBox.width + avatar.direction.x*2 > FlxG.width * 5) {
				m = new Message(Texts.LEAVE_MARINA_AREA);
				collided = true;
			}
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("Performing collision result");
			if (collided) {
				avatar.velocity.x = 0; avatar.velocity.y = 0;
				avatar.x -= avatar.direction.x * 1;
				avatar.y -= avatar.direction.y * 1;
			}
			if (World.DEBUG_MEMORY) traceMemory();
		}
		
		private static function handleFrontDoors():void {
			if (FlxCollision.pixelPerfectCheck(_avatar._hitBox,World._entryDoorsTrigger)) {
				if (World._entryDoorsClosed && Time.museumIsOpen() && _entryDoors.finished) {
					_entryDoors.play("opening");
					_entryDoorsHM.play("opening");
					_entryDoorsClosed = false;
				}
			}
			else {
				if (!World._entryDoorsClosed && _entryDoors.finished) {
					_entryDoors.play("closing");
					_entryDoorsHM.play("closing");
					_entryDoorsClosed = true;
				}
			}
		}
		
		public static function setUpScenes():void {
			
			_ticketGuard = new Guard(170,51);
			FlxG.state.add(_ticketGuard);
			People.push(_ticketGuard);
			
			_marinaGuard1 = new Guard(FlxG.width * 4 + 108,22);
			FlxG.state.add(_marinaGuard1);
			People.push(_marinaGuard1);
			_marinaGuard2 = new Guard(FlxG.width * 4 + 112,33);
			FlxG.state.add(_marinaGuard2);
			People.push(_marinaGuard2);
			
			_counterHitBox = new FlxSprite(110,50);
			_counterHitBox.makeGraphic(5,8,0xAAFFFFFF);
			_counterHitBox.visible = DEBUG_MODE;
			FlxG.state.add(_counterHitBox);
			
			_entryBG = new FlxSprite(0,FlxG.height);
			_entryBG.loadGraphic(Assets.ENTRY_BG,false,false,FlxG.width,FlxG.height);	
			_entryBG.ID = -10000; // Should always be at back
			_entryFG = new FlxSprite(0,FlxG.height);
			_entryFG.loadGraphic(Assets.ENTRY_FG,false,false,FlxG.width,FlxG.height);
			_entryFG.ID = 10000;
			_entryHM = new FlxSprite(0,FlxG.height);
			_entryHM.loadGraphic(Assets.ENTRY_HM,false,false,FlxG.width,FlxG.height);
			_entryHM.visible = COLLISION_MODE;
			FlxG.state.add(_entryBG);
			FlxG.state.add(_entryFG);
			FlxG.state.add(_entryHM);
			
			_entryDoors = new FlxSprite(0,FlxG.height);
			_entryDoors.loadGraphic(Assets.ENTRY_DOORS,true,false,FlxG.width,FlxG.height);	
			_entryDoors.addAnimation("opening",Assets.ENTRY_DOORS_OPENING_FRAMES,5,false);
			_entryDoors.addAnimation("closing",Assets.ENTRY_DOORS_CLOSING_FRAMES,5,false);
			_entryDoors.addAnimation("closed",[Assets.ENTRY_DOORS_CLOSED],5,false);
			_entryDoors.ID = -100;
			_entryDoorsHM = new FlxSprite(0,FlxG.height);
			_entryDoorsHM.loadGraphic(Assets.ENTRY_DOORS_HM,true,false,FlxG.width,FlxG.height);
			_entryDoorsHM.addAnimation("opening",Assets.ENTRY_DOORS_OPENING_FRAMES,5,false);
			_entryDoorsHM.addAnimation("closing",Assets.ENTRY_DOORS_CLOSING_FRAMES,5,false);
			_entryDoorsHM.addAnimation("closed",[Assets.ENTRY_DOORS_CLOSED],5,false);
			_entryDoorsHM.ID = -99;
			_entryDoorsHM.visible = World.COLLISION_MODE;
			_entryDoors.play("closed");
			_entryDoorsHM.play("closed");
			FlxG.state.add(_entryDoors);
			FlxG.state.add(_entryDoorsHM);
			
			_entryDoorsTrigger = new FlxSprite(80,FlxG.height);
			_entryDoorsTrigger.makeGraphic(40,80,0xAAFFFFFF);
			_entryDoorsTrigger.visible = World.DEBUG_MODE;
			FlxG.state.add(_entryDoorsTrigger);
			
			_ticketsBG = new FlxSprite(0,0);
			_ticketsBG.loadGraphic(Assets.TICKETS_BG,false,false,FlxG.width,FlxG.height);	
			_ticketsBG.ID = -10000; // Should always be at back
			_ticketsFG = new FlxSprite(0,0);
			_ticketsFG.loadGraphic(Assets.TICKETS_FG,false,false,FlxG.width,FlxG.height);
			_ticketsFG.ID = 50;
			_ticketsFGFG = new FlxSprite(0,0);
			_ticketsFGFG.loadGraphic(Assets.TICKETS_FG_FG,false,false,FlxG.width,FlxG.height);
			_ticketsFGFG.ID = 10000;
			_ticketsHM = new FlxSprite(0,0);
			_ticketsHM.loadGraphic(Assets.TICKETS_HM,false,false,FlxG.width,FlxG.height);
			_ticketsHM.visible = COLLISION_MODE;
			FlxG.state.add(_ticketsBG);
			FlxG.state.add(_ticketsFG);
			FlxG.state.add(_ticketsFGFG);
			FlxG.state.add(_ticketsHM);
			
			_ticketBarrier = new FlxSprite(181,62);
			_ticketBarrier.makeGraphic(5,20,0xCCFFFF00);
			_ticketBarrier.ID = 10000;
			_ticketBarrier.visible = World.DEBUG_MODE;
			FlxG.state.add(_ticketBarrier);
			
			_ticketQueueBarrier = new FlxSprite(128,57);
			_ticketQueueBarrier.makeGraphic(28,2,0xCCFFFFFF);
			_ticketQueueBarrier.ID = 10000;
			_ticketQueueBarrier.visible = World.DEBUG_MODE;
			FlxG.state.add(_ticketQueueBarrier);
			
			_ticketEntryBarrier = new FlxSprite(0,57);
			_ticketEntryBarrier.makeGraphic(32,2,0xCCFFFFFF);
			_ticketEntryBarrier.ID = 10000;
			_ticketEntryBarrier.visible = World.DEBUG_MODE;
			FlxG.state.add(_ticketEntryBarrier);
			
			_queueBarrier = new FlxSprite(30,24);
			_queueBarrier.loadGraphic(Assets.BARRIER_OBJ,false,false,100,50);
			_queueBarrier.ID = _queueBarrier.y;
			_queueBarrierHM = new FlxSprite(35,58);
			_queueBarrierHM.makeGraphic(92,4,0xCCFFFFFF);
			_queueBarrierHM.visible = World.DEBUG_MODE;
			FlxG.state.add(_queueBarrier);
			FlxG.state.add(_queueBarrierHM);
			
			_hall1BG = new FlxSprite(FlxG.width * 1,0);
			_hall1BG.loadGraphic(Assets.HALL1_BG,false,false,FlxG.width,FlxG.height);
			_hall1BG.ID = -10000;
			_hall1FG = new FlxSprite(FlxG.width * 1,0);
			_hall1FG.loadGraphic(Assets.HALL1_FG,false,false,FlxG.width,FlxG.height);
			_hall1FG.ID = 50;
			_hall1FGFG = new FlxSprite(FlxG.width * 1,0);
			_hall1FGFG.loadGraphic(Assets.HALL1_FG_FG,false,false,FlxG.width,FlxG.height);
			_hall1FGFG.ID = 10000;
			_hall1HM = new FlxSprite(FlxG.width * 1,0);
			_hall1HM.loadGraphic(Assets.HALL1_HM,false,false,FlxG.width,FlxG.height);
			_hall1HM.visible = COLLISION_MODE;
			FlxG.state.add(_hall1BG);
			FlxG.state.add(_hall1FG);
			FlxG.state.add(_hall1FGFG);
			FlxG.state.add(_hall1HM);
			
			_starryNightTrigger = new FlxSprite(FlxG.width * 1 + 74,46);
			_starryNightTrigger.makeGraphic(6,5,0xAAFFFFFF);
			_starryNightTrigger.visible = World.DEBUG_MODE;
			FlxG.state.add(_starryNightTrigger);
			
			_oliveTreesTrigger = new FlxSprite(FlxG.width * 1 + 134,46);
			_oliveTreesTrigger.makeGraphic(6,5,0xAAFFFFFF);
			_oliveTreesTrigger..visible = World.DEBUG_MODE;
			FlxG.state.add(_oliveTreesTrigger);
			
			//			_hall2BG = new FlxSprite(FlxG.width * 2,0);
			//			_hall2BG.loadGraphic(Assets.HALL2_BG,false,false,FlxG.width,FlxG.height);			
			//			_hall2BG.ID = -10000;
			//			_hall2HM = new FlxSprite(FlxG.width * 2,0);
			//			_hall2HM.loadGraphic(Assets.HALL2_HM,false,false,FlxG.width,FlxG.height);
			//			_hall2HM.visible = COLLISION_MODE;
			//			FlxG.state.add(_hall2BG);
			//			FlxG.state.add(_hall2HM);
			//			
			//			_mapTrigger = new FlxSprite(FlxG.width * 2 + 70,50);
			//			_mapTrigger.makeGraphic(53,5,0xAAFFFFFF);
			//			_mapTrigger.visible = World.DEBUG_MODE;
			//			FlxG.state.add(_mapTrigger);
			
			_hall3BG = new FlxSprite(FlxG.width * 2,0);
			_hall3BG.loadGraphic(Assets.HALL3_BG,false,false,FlxG.width,FlxG.height);			
			_hall3BG.ID = -10000;
			_hall3HM = new FlxSprite(FlxG.width * 2,0);
			_hall3HM.loadGraphic(Assets.HALL3_HM,false,false,FlxG.width,FlxG.height);
			_hall3HM.visible = COLLISION_MODE;
			FlxG.state.add(_hall3BG);
			FlxG.state.add(_hall3HM);
			
			_soupCansTrigger = new FlxSprite(FlxG.width * 2 + 54,46);
			_soupCansTrigger.makeGraphic(6,5,0xAAFFFFFF);
			_soupCansTrigger.visible = World.DEBUG_MODE;
			FlxG.state.add(_soupCansTrigger);
			
			_hall4BG = new FlxSprite(FlxG.width * 3,0);
			_hall4BG.loadGraphic(Assets.HALL4_BG,false,false,FlxG.width,FlxG.height);			
			_hall4BG.ID = -10000;
			_hall4HM = new FlxSprite(FlxG.width * 3,0);
			_hall4HM.loadGraphic(Assets.HALL4_HM,false,false,FlxG.width,FlxG.height);
			_hall4HM.visible = COLLISION_MODE;
			FlxG.state.add(_hall4BG);
			FlxG.state.add(_hall4HM);
			
			_dancersTrigger = new FlxSprite(FlxG.width * 3 + 56,46);
			_dancersTrigger.makeGraphic(6,5,0xAAFFFFFF);
			_dancersTrigger.visible = World.DEBUG_MODE;
			FlxG.state.add(_dancersTrigger);
			
			_marinaRoom = new FlxSprite(FlxG.width * 4,0);
			_marinaRoom.loadGraphic(Assets.MARINA_ROOM,false,false,FlxG.width,FlxG.height);			
			_marinaRoom.ID = -10000;
			_marinaRoomHM = new FlxSprite(FlxG.width * 4,0);
			_marinaRoomHM.loadGraphic(Assets.MARINA_ROOM_HM,false,false,FlxG.width,FlxG.height);
			_marinaRoomHM.visible = COLLISION_MODE;
			_marinaRoomTapeHM = new FlxSprite(FlxG.width * 4,0);
			_marinaRoomTapeHM.loadGraphic(Assets.MARINA_ROOM_TAPE_HM,false,false,FlxG.width,FlxG.height);
			_marinaRoomTapeHM.visible = COLLISION_MODE;
			FlxG.state.add(_marinaRoom);
			FlxG.state.add(_marinaRoomHM);
			FlxG.state.add(_marinaRoomTapeHM);
			
			_marinaQueueBarrier = new FlxSprite(FlxG.width * 4 + 115,58);
			_marinaQueueBarrier.makeGraphic(2,6,0xAAFFFFFF);
			_marinaQueueBarrier.visible = DEBUG_MODE;
			FlxG.state.add(_marinaQueueBarrier);
			
			_tableAndChairs = new FlxSprite(FlxG.width * 4 + 130,40);
			_tableAndChairs.loadGraphic(Assets.TABLE_AND_CHAIRS,false,false,60,30);
			_tableAndChairs.ID = 30;
			_tableAndChairsHM = new FlxSprite(FlxG.width * 4 + 130,40);
			_tableAndChairsHM.loadGraphic(Assets.TABLE_AND_CHAIRS_HM,false,false,60,30);
			_tableAndChairsHM.visible = World.DEBUG_MODE;
			_chairHM = new FlxSprite(FlxG.width * 4 + 145,60);
			_chairHM.makeGraphic(2,10,0xAA00FF00);
			_chairHM.ID = 20000;
			_chairHM.visible = World.DEBUG_MODE;
			FlxG.state.add(_tableAndChairs);
			FlxG.state.add(_tableAndChairsHM);
			FlxG.state.add(_chairHM);
			
			_marina = new FlxSprite(FlxG.width * 4 + 164,36);
			_marina.loadGraphic(Assets.MARINA_SITTING,true,false,20,30);
			_marina.addAnimation("headUp",[Assets.MARINA_UP],6,false);
			_marina.addAnimation("headDown",[Assets.MARINA_DOWN],6,false);
			_marina.addAnimation("upToDown",Assets.MARINA_DOWN_FRAMES,4,false);
			_marina.addAnimation("downToUp",Assets.MARINA_UP_FRAMES,4,false);
			_marina.play("headDown");
			_marina.ID = _tableAndChairs.ID + 1;
			FlxG.state.add(_marina);
			
			_hiResMarina = new FlxSprite(FlxG.width * 4,0);
			_hiResMarina.loadGraphic(Assets.MARINA_HI_RES,true,false,FlxG.width,FlxG.height);
			_hiResMarina.addAnimation("blink",Assets.MARINA_BLINK_FRAMES,BLINK_FRAME_RATE,false);
			_hiResMarina.addAnimation("open",[Assets.MARINA_EYES_OPEN],BLINK_FRAME_RATE,false);
			_hiResMarina.ID = 100000;
			
			_light = new FlxSprite(0,FlxG.height);
			_light.makeGraphic(FlxG.width,FlxG.height,0xFF000000);
			_light.alpha = Time.getLight();
			_light.ID = 99999;
			FlxG.state.add(_light);
			
		}
		
		private static function traceMemory():void {
			trace("World: memory usage: " + (System.totalMemory / 1024 / 1024) + " MB");
		}
		
	}
}