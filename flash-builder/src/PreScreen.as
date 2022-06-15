package
{
	import flash.events.*;
	import flash.text.*;
	
	import org.flixel.*;
	
	public class PreScreen extends FlxGroup
	{
		
		[Embed(source="assets/Title/MarinaTitle.png")]
		public static const MARINA_TITLE_IMAGE:Class;
		
		private var _titleTextString:String = "THE\nARTIST\nIS\nPRESENT";
		private var _subtitleTextString:String = "MARINA ABRAMOVIC\n\n(AND PIPPIN BARR)";
		private var _currentTitleText:uint = 0;
		private var _titleText:TextField;
		private var _subtitleText:TextField;
		private var _titleTextFormat:TextFormat;
		private var _subtitleTextFormat:TextFormat;
				
		private var _bg:FlxSprite;
		private var _marina:FlxSprite;
		
		private var _playButton:TextField;
		private var _playButtonFormat:TextFormat;
		
		public var _queueReady:Boolean = false;
		//public var _destroy:Boolean = false;
		
		private var _initTimer:FlxTimer;
		
		public function PreScreen(MaxSize:uint=0)
		{
			super(MaxSize);
		}
		
		public function create():void {
			
			_initTimer = new FlxTimer();
			
			_bg = new FlxSprite(0,FlxG.height);
			_bg.makeGraphic(FlxG.width,FlxG.height,0xFFFFFFFF);
			add(_bg);
			
			_marina = new FlxSprite(0,FlxG.height);
			_marina.loadGraphic(MARINA_TITLE_IMAGE,false,false,FlxG.width / 2, FlxG.height);
			add(_marina);
			
			// Textfield to display boarding messages
			_titleTextFormat = new TextFormat("Commodore",50,0x000000,null,null,false,null,null,"center",null,null,null,null);
			_titleText = new TextField();
			_titleText.width = FlxG.width * 4 / 2;
			_titleText.height = FlxG.height * 4;
			_titleText.x = 0 + FlxG.width * 4 / 2;
			_titleText.y = 0;
			_titleText.embedFonts = true;
			_titleText.selectable = false;
			_titleText.defaultTextFormat = _titleTextFormat;
			_titleText.text = _titleTextString;
			
			FlxG.stage.addChild(_titleText);
			
			_subtitleTextFormat = new TextFormat("Commodore",24,0x000000,null,null,false,null,null,"center",null,null,null,null);
			_subtitleText = new TextField();
			_subtitleText.width = FlxG.width * 4 / 2;
			_subtitleText.height = FlxG.height * 4;
			_subtitleText.x = 0 + FlxG.width * 4 / 2;
			_subtitleText.y = 6*FlxG.height*4/10;
			_subtitleText.embedFonts = true;
			_subtitleText.selectable = false;
			_subtitleText.defaultTextFormat = _subtitleTextFormat;
			_subtitleText.text = _subtitleTextString;
			
			FlxG.stage.addChild(_subtitleText);
			
			_playButton = new TextField();
			_playButtonFormat = new TextFormat("Commodore",20,0x000000,null,null,false,null,null,"center",null,null,null,null);
			_playButton.width = FlxG.width * 4 / 2;
			_playButton.x = 0 + FlxG.width * 4 / 2;
			_playButton.y = 9*FlxG.height*4/10;
			_playButton.embedFonts = true;
			_playButton.selectable = false;
			_playButton.defaultTextFormat = _playButtonFormat;
			_playButton.text = "";
		}
		
		public function init(t:FlxTimer):void {
			trace("PreScreen.init");
			var q:Queuer;
			var queueLength:uint = Time.getInitQueueLength();
			trace("Queue length: " + queueLength);
			for (var i:int = 0; i < queueLength; i++) {
				trace("Adding...");
				q = new Queuer();
				q.x = (FlxG.width * 4 + 50) - i*20; q.y = World.QUEUE_Y - q.height;
				People.push(q);
				FlxG.state.add(q);
				trace("Added.");
			}
			_queueReady = true;
			trace("_queueReady set to true.");
		}
		
		public function initTimer():void {
			trace("PreScreen.initTimer");
			_initTimer.start(0.5,1,init);
		}
		
		public override function update():void {
			super.update();
			
			if (_queueReady && _playButton.text == "") {
				trace("Queue Ready!");
				_playButton.text = "- CLICK TO BEGIN -";
				FlxG.stage.addChild(_playButton);
				FlxG.stage.addEventListener(MouseEvent.CLICK,clickHandler,false,0,true);
			}
			
		}
		
		private function clickHandler(e:MouseEvent):void {
			FlxG.paused = false;
			FlxG.stage.removeEventListener(MouseEvent.CLICK,clickHandler);
			FlxG.stage.focus = null;
		}
		
		public function cleanUp():void {			
		}
		
		public override function postUpdate():void {
			super.postUpdate();
		}
		
		public override function destroy():void {
			trace("PreScreen.destroy");
			FlxG.stage.removeChild(_titleText);
			FlxG.stage.removeChild(_subtitleText);
			FlxG.stage.removeChild(_playButton);
			remove(_marina,true);
			remove(_bg,true);
			_marina.destroy();
			_bg.destroy();
			
			FlxG.stage.focus = null;
			FlxG.paused = false;
			super.destroy();
		}
	}
}