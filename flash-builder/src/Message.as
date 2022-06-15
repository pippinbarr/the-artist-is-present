package
{
	import flash.events.KeyboardEvent;
	import flash.text.*;
	import flash.ui.Keyboard;
	
	import org.flixel.*;
	
	public class Message extends FlxGroup
	{
		private const _x:int = 50;
		private const _y:int = 50;
		
		private const MESSAGE_TIME:uint = 10;
		
		private var _destroy:Boolean = false;
		
		private var _outerWhiteBox:FlxSprite;
		private var _redLineBox:FlxSprite;
		private var _innerWhiteBox:FlxSprite;
		
		private var _text:TextField;
		private var _textFormat:TextFormat = new TextFormat("Commodore",28,0x000000,null,null,null,null,null,"left",null,null,null,null);
		
		private var _timer:FlxTimer;
		
		private var _message:Array;
		
		private var _counter:uint = 0;
		
		private var _skippable:Boolean = true;
		
		public function Message(message:Array,skippable:Boolean=true)
		{			
			trace("Message.Message()");
			
			super();
			
			_skippable = skippable;
			
			_message = message;
			_timer = new FlxTimer();
			
			_text = new TextField();
			_text.defaultTextFormat = _textFormat;
			_text.embedFonts = true;
			_text.wordWrap = true;
			_text.autoSize = "center";
			_text.selectable = false;
			
			_text.text = _message[_counter];
			
			_text.width = 150 * 4; 
			_text.visible = false;
			
			_outerWhiteBox = new FlxSprite();
			this.add(_outerWhiteBox);
			
			_redLineBox = new FlxSprite();
			this.add(_redLineBox);
			
			_innerWhiteBox = new FlxSprite();
			this.add(_innerWhiteBox);

			
			FlxG.stage.addChild(_text);
			FlxG.stage.removeEventListener(KeyboardEvent.KEY_UP,keyUp);

			displayMessage(null);
		}
		
		private function displayMessage(t:FlxTimer):void {
			
			trace("Message.displayMessage()");
			
			cleanUp();
			
			// Don't display this message if one is already displaying
			if (World._messages.length != 0 && _counter == 0) {
				_timer.start(1,1,displayMessage);
				return;
			}	
			
			if (World._messages.length == 0) World._messages.add(this);
						
			FlxG.paused = true;
						
			this.ID = 100000;
			
			_text.text = _message[_counter];					
			_text.x = FlxG.width*4/2 - _text.width/2;
			_text.y = FlxG.height*4/2 - _text.height/2;
			_text.visible = true;
				
			_outerWhiteBox.makeGraphic(_text.width/4 + 12,_text.height/4 + 10,0xFFFFFFFF);
			_outerWhiteBox.x = World._cameraFocus.x - _outerWhiteBox.width/2;
			_outerWhiteBox.y = World._cameraFocus.y - _outerWhiteBox.height/2;

			_redLineBox.makeGraphic(_text.width/4 + 12 - 2,_text.height/4 - 2 + 10,0xFFCC0000);
			_redLineBox.x = World._cameraFocus.x - _redLineBox.width/2;
			_redLineBox.y = World._cameraFocus.y - _redLineBox.height/2;

			_innerWhiteBox.makeGraphic(_text.width/4 + 12 - 4,_text.height/4 - 4 + 10,0xFFFFFFFF);
			_innerWhiteBox.x = World._cameraFocus.x - _innerWhiteBox.width/2; 
			_innerWhiteBox.y = World._cameraFocus.y - _innerWhiteBox.height/2;
			
			_outerWhiteBox.visible = true;
			_redLineBox.visible = true;
			_innerWhiteBox.visible = true;
			
			if (!_skippable) { return };
			
			FlxG.stage.addEventListener(KeyboardEvent.KEY_UP,keyUp,false,0,true);
															
			_counter++;
			if (_counter < _message.length) {
				trace("Message.displayMessage starting timer for new displayMessage");
				_timer.start(MESSAGE_TIME,1,displayMessage);
			}
			else _timer.start(MESSAGE_TIME,1,endOfMessage);
			
		}
		
		public override function update():void {
			super.update();
		}
		
		public override function postUpdate():void {
			super.postUpdate();
			trace("Message.postUpdate()");
			if (_destroy) {
				this.destroy();
			}
		}
		
		private function keyUp(e:KeyboardEvent):void {
			trace("Message.keUp()");
			if (e.keyCode == Keyboard.ENTER) {
				if (_counter < _message.length) {
					trace("Message.keyUp calling displayMessage.");
					_timer.stop();
					displayMessage(null);
				}
				else {
					endOfMessage(null);
				}
			}
		}
		
		private function endOfMessage(t:FlxTimer):void {
			trace("Message.endOfMessage()");
			_destroy = true;
		}
		
		private function cleanUp():void {
			FlxG.stage.removeEventListener(KeyboardEvent.KEY_UP,keyUp);
			_outerWhiteBox.visible = false;
			_redLineBox.visible = false;
			_innerWhiteBox.visible = false;
			_text.visible = false;
		}
		
		public override function destroy():void {
			trace("Message.destroy()");
			cleanUp();
			
			this._textFormat = null;
						
			_timer.destroy();
			
			remove(_outerWhiteBox,true);
			remove(_redLineBox,true);
			remove(_innerWhiteBox,true);
			_outerWhiteBox.destroy();
			_redLineBox.destroy();
			_innerWhiteBox.destroy();
			
			FlxG.stage.removeChild(_text);
			
			World._messages.remove(this,true);
			trace("Removed message from _messages.");
			trace("_messages.length=" + World._messages.length);
			trace("_messages.members.length=" + World._messages.members.length);
			
			FlxG.stage.focus = null;
			FlxG.paused = false;

			super.destroy();
		}
	}
}