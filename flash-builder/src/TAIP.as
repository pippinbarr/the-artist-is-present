package
{
	
	//import flash.display.BitmapData;
	import flash.events.*;
	import flash.system.*;
	import flash.text.*;
	
	import org.flixel.*;
	
	public class TAIP extends FlxState {
		
		private const NUM_SCREENS_WIDE:uint = 6;
		private const NUM_SCREENS_HIGH:uint = 2;
		
		private var _avatar:Avatar;
		
		private var _marinaGuard:Guard;
		
		private var _screenOneCamera:FlxCamera;
		private var _screenTwoCamera:FlxCamera;
		
		private var _currentCamera:uint = 0;
		
		private var _introTimer:FlxTimer;
		private var _newQueuerTimer:FlxTimer;
		private var _initQueueTimer:FlxTimer;
		private var _teleportTimer:FlxTimer;
		
		private var _fifteenMinuteWarningGiven:Boolean = false;
		private var _closedWarningGiven:Boolean = false;
		private var _closedTeleportComplete:Boolean = false;
		
		private var _queueProcessing:Boolean = false;
		private var _queueReady:Boolean = false;
		private var _requiredPreQueueLength:uint = 0;
		private var _currentPreQueueLength:uint = 0;
		
		private var _preScreen:PreScreen;
		
		private var _startedClosed:Boolean = false;
		private var _museumOpeningQueuersAdded:Boolean = false;
		
		private var _addedSpecialEditionQueuers:Boolean = false;
		
		private var _destroyPreScreen:Boolean = false;
		
		private var _defaultCamera:FlxCamera;
		
		public function TAIP() {
			super();
		}
		
		public override function create():void {
			
			if (World.DEBUG_MEMORY) trace("TAIP.create()");
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("super.create()");
			super.create();
			if (World.DEBUG_MEMORY) traceMemory();
			
			_defaultCamera = new FlxCamera(0,0,FlxG.width,FlxG.height);
			
			if (!Time.museumIsOpen()) {
				_startedClosed = true;
			}
			
			if (World.DEBUG_MEMORY) trace("setting framerate");
			if (World.DEBUG_MEMORY) traceMemory();
			FlxG.framerate = 30;
			//FlxG.bgColor = 0xFFCCCCCC;
			FlxG.bgColor = 0xFF000000;
			
			if (World.DEBUG_MEMORY) trace("creating and adding avatar");
			_avatar = new Avatar(FlxG.width * 0 + 80, FlxG.height * 1 + 50); // Front door
			//_avatar = new Avatar(FlxG.width * 0 + 80, FlxG.height * 0 + 50); // Ticket hall
			//_avatar = new Avatar(FlxG.width * 1 + 80, FlxG.height * 0 + 50); // First hall
			//_avatar = new Avatar(FlxG.width * 2 + 80, FlxG.height * 0 + 50); // Soup cans hall
			//_avatar = new Avatar(FlxG.width * 3 + 80, FlxG.height * 0 + 50); // Dancers hall
			//_avatar = new Avatar(FlxG.width * 4 + 80, FlxG.height * 0 + 50); // Marina room
			add(_avatar);
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("initialising people");
			// Set up the core classes and the avatar
			People.init();
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("adding avatar to people");
			People.push(_avatar);
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("initialising world");
			World.init(_avatar);
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("World.setUpScenes()");
			World.setUpScenes();
			if (World.DEBUG_MEMORY) traceMemory();
			
			_initQueueTimer = new FlxTimer();
			
			if (World.DEBUG_MEMORY) trace("setting up introTimer");
			_introTimer = new FlxTimer();
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (World.DEBUG_MEMORY) trace("setting up newQueuerTimer");
			_newQueuerTimer = new FlxTimer();
			_newQueuerTimer.start(6,1,newQueuer);
			if (World.DEBUG_MEMORY) traceMemory();
			
			_teleportTimer = new FlxTimer();
			
			if (World.DEBUG_MEMORY) trace("adding main camera");
			// Set up the initial camera
			FlxG.addCamera(new FlxCamera(0,0,FlxG.width,FlxG.height));
			//FlxG.camera.focusOn(new FlxPoint(FlxG.width * 0.5, FlxG.height * 1.5));
			if (World.DEBUG_MEMORY) traceMemory();
			
			_preScreen = new PreScreen();
			_preScreen.create();
			add(_preScreen);
			
			FlxG.paused = true;
			
			if (World.DEBUG_MEMORY) trace("end of TAIP.create()");
			
		}
		
		private function introMessage(t:FlxTimer):void {
			var m:Message = new Message(Texts.INTRO_MESSAGE);
			var m2:Message = new Message(["It's " + Time.getTime() + "."]);
			//t.start(0.1,1,timeMessage);
		}
		
		public override function update():void {
			
			if (World.DEBUG_MEMORY) trace("TAIP.update()");
			if (World.DEBUG_MEMORY) traceMemory();
			
			if (FlxG.paused && !_preScreen._queueReady && !_queueProcessing) {
				moveCamera();
				_queueProcessing = true;
				_preScreen.initTimer();
				_preScreen.update();
			}
			else if (FlxG.paused && !_preScreen._queueReady && _queueProcessing) {
				//moveCamera();
				_preScreen.update();
				//_initQueueTimer.update();
				//_queueProcessing = false;
			}
			else if (FlxG.paused && _preScreen._queueReady && !_queueReady) {
				//moveCamera();
				_preScreen.update();
				//FlxG.paused = false;
				//_preScreen.destroy();
			}
			else if (FlxG.paused) {
				World._messages.update();	
			}
			else if (!FlxG.paused && _preScreen._queueReady && !_queueReady) {
				//moveCamera();
				_destroyPreScreen = true;
				_queueReady = true;
				_introTimer.start(2,1,introMessage);
			}
			else if (!FlxG.paused && _queueReady) {
				super.update();
				
				if (World.DEBUG_MEMORY) trace("Start of normal update()");
				if (World.DEBUG_MEMORY) traceMemory();
				
				if (World.DEBUG_MEMORY) trace("moveCamera()");
				// Focus the camera appropriately
				moveCamera();
				if (World.DEBUG_MEMORY) traceMemory();
				
				if (World.DEBUG_MEMORY) trace("Checking museum just opened");
				if (_startedClosed && Time.museumIsOpen() && !_museumOpeningQueuersAdded) {
					// If the player started the game with the museum closed and now it's open
					// then we need to have the initial 2 people in the queue when they go in
					initPreQueue(3);
					_museumOpeningQueuersAdded = true;
				}
				if (World.DEBUG_MEMORY) traceMemory();
				
				var m:Message;
				
				if (World.DEBUG_MEMORY) trace("updateIDs and sort");
				// Sort the people on the screen so that they all display with the right overlaps
				People.updateIDs(); // Sets all Person IDs to their y position, for sorting
				sort("ID",ASCENDING);	
				if (World.DEBUG_MEMORY) traceMemory();
				
				if (World.DEBUG_MEMORY) trace("Checks for museum closing");
				if (_avatar._hitBox.y < FlxG.height && 
					_avatar._hitBox.y > 0 &&
					_avatar._hitBox.x > 0 &&
					_avatar._hitBox.x + _avatar._hitBox.width < FlxG.width * 5 &&
					Time.museumClosingInFifteenMinutes() && 
					!_fifteenMinuteWarningGiven) {
					_fifteenMinuteWarningGiven = true;
					m = new Message(Texts.MOMA_CLOSING_IN_FIFTEEN);
				}
				
				if (_avatar._hitBox.y < FlxG.height && 
					_avatar._hitBox.y > 0 &&
					_avatar._hitBox.x > 0 &&
					_avatar._hitBox.x + _avatar._hitBox.width < FlxG.width * 5 &&
					!Time.museumIsOpen() && 
					!_closedWarningGiven) {
					// The avatar is in the museum and the museum just closed
					_closedWarningGiven = true;
					//teleport(null);
					World._avatar.x = 100 - World._avatar.width/2;
					World._avatar.y = FlxG.height + 50;
					_avatar.faceDown();;
					World._avatar.velocity.x = 0;
					World._avatar.velocity.y = 0
					World._avatar._intendedVelocityX = 0;
					World._avatar._intendedVelocityY = 0
					_teleportTimer.start(0.1,1,teleport);
					World._cameraFocus.x = FlxG.width * Math.floor(World._avatar.x / FlxG.width) + FlxG.width * 0.5;
					
				}
				if (_closedWarningGiven && World._messages.length == 0) {
					//_teleportTimer.start(1,1,teleport);
				}
				if (World.DEBUG_MEMORY) traceMemory();
				
				People.collide();
				World.collide(_avatar);
				
			}
			
			if (_avatar._queueMessageSeen && !_addedSpecialEditionQueuers) {
				addNewQueuer();
				_addedSpecialEditionQueuers = true;
			}
			
			if (_destroyPreScreen) {
				_preScreen.visible = false;
				_preScreen.destroy();
				_destroyPreScreen = false;
				remove(_preScreen,true);
			}
			
		}
		
		private function teleport(t:FlxTimer):void {
			var m:Message = new Message(Texts.MOMA_CLOSING,false);
		}
		
		private function newQueuer(t:FlxTimer):void {
			if (Time.newQueuer()) {
				addNewQueuer();
			}
			_newQueuerTimer.start(6,1,newQueuer);
		}
		
		public override function draw():void {
			super.draw();
			if (FlxG.paused) World._messages.draw();
		}
		
		private function initPreQueue(size:uint):void {
			var q:Queuer;
			for (var i:int = 0; i < size; i++) {
				q = new Queuer();
				q.x = (FlxG.width * 4 + 50) - i*25; q.y = World.QUEUE_Y - q.height;
				People.push(q);
				add(q);
			}
		}
		
		private function addNewQueuer():void {
			var q:Queuer = new Queuer();
			q.x = -40; q.y = World.TICKET_QUEUE_Y - q.height;
			People.push(q);
			add(q);
		}
		
		private function moveCamera():void {
			
			//FlxG.resetCameras(_defaultCamera);
			//FlxG.resetCameras();
			
			if (_avatar._hitBox.y > FlxG.height * 2) return;
			if (_avatar._hitBox.y < 0) return;
			if (_avatar.x < 0) return;
			if (_avatar.x + _avatar.width > FlxG.width && _avatar.y > FlxG.height) return;
			
			if (!_queueReady) FlxG.resetCameras(new FlxCamera(0,0,FlxG.width,FlxG.height));
			World._cameraFocus.y = FlxG.height * Math.floor((_avatar.y + _avatar.height/2) / FlxG.height) +
				FlxG.height * 0.5;
			
			if (_avatar.velocity.x > 0) World._cameraFocus.x = FlxG.width * Math.floor((_avatar.x + _avatar.width - 4) / FlxG.width) + FlxG.width * 0.5;	
			if (_avatar.velocity.x < 0) World._cameraFocus.x = FlxG.width * Math.floor((_avatar.x + 4) / FlxG.width) + FlxG.width * 0.5;	
			
			FlxG.camera.focusOn(World._cameraFocus);
		}
		
		public override function postUpdate():void {
			trace("In postupdate");
			if (!FlxG.paused) super.postUpdate();
			else {
				World._messages.postUpdate();
			}
		}
		
		private function traceMemory():void {
			trace("TAIP: memory usage: " + (System.totalMemory / 1024 / 1024) + " MB");
		}
		
		public override function destroy():void {
			super.destroy();
		}
	}
}