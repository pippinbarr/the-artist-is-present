package
{
	import flash.display.*;
	import flash.display.Sprite;
	import flash.events.MouseEvent;
	import flash.text.*;
	import flash.utils.getTimer;
	
	import org.flixel.system.FlxPreloader;
	
	[SWF(width = "800", height = "400", backgroundColor = "#FFFFFF")]
	
	public class TAIPPreloader extends FlxPreloader
	{
		
		[Embed(source="assets/Commodore Pixelized v1.2.ttf", fontName="Commodore", fontWeight="Regular", embedAsCFF="false")]
		public static const COMMODORE_FONT:Class;
		
		[Embed(source="assets/Title/MarinaTitle.png")]
		public static const MARINA_TITLE_IMAGE:Class;
		
		private var _titleTexts:Array = new Array("THE\n","ARTIST\n","IS\n","PRESENT\n");
		private var _subtitleTextString:String = "MARINA ABRAMOVIC";
		private var _currentTitleText:uint = 0;
		private var _titleText:TextField;
		private var _subtitleText:TextField;
		private var _titleTextFormat:TextFormat;
		private var _subtitleTextFormat:TextFormat;
		
		private var _subtitleAdded:Boolean = false;
		
		private var _bg:Bitmap;
		private var _loadingBar:Bitmap;
		private var _loadingBarBGBlack:Bitmap;
		private var _loadingBarBGWhite:Bitmap;
		
		private var _playButton:TextField;
		private var _playButtonFormat:TextFormat;
		
		private var _timer:uint = 0;
		
		
		public function TAIPPreloader() {			
			className = "TheArtistIsPresent";
			super();
		}
		
		override protected function create():void {
			
			trace("TAIPPreloader.create()");
			
			Font.registerFont(COMMODORE_FONT);
			
			// Set minimum running time of the preload
			_min = 8000000;
			
			// Create a buffer Sprite
			_buffer = new Sprite();
			addChild(_buffer);	
					
			_bg = new Bitmap(new BitmapData(stage.stageWidth,stage.stageHeight,false,0xFFFFFF));
			_buffer.addChild(_bg);
			
			var bitmap:Bitmap = new MARINA_TITLE_IMAGE();
			bitmap.scaleX *= 4; bitmap.scaleY *= 4;
			_buffer.addChild(bitmap);
			
			// Textfield to display boarding messages
			_titleTextFormat = new TextFormat("Commodore",50,0x000000,null,null,false,null,null,"center",null,null,null,null);
			_titleText = new TextField();
			_titleText.width = stage.stageWidth / 2;
			_titleText.height = stage.stageHeight;
			_titleText.x = stage.x + stage.stageWidth / 2;
			_titleText.y = 0;
			_titleText.embedFonts = true;
			_titleText.selectable = false;
			_titleText.defaultTextFormat = _titleTextFormat;
			_titleText.text = "";
			
			_subtitleTextFormat = new TextFormat("Commodore",24,0x000000,null,null,false,null,null,"center",null,null,null,null);
			_subtitleText = new TextField();
			_subtitleText.width = stage.stageWidth / 2;
			_subtitleText.height = stage.stageHeight;
			_subtitleText.x = stage.x + stage.stageWidth / 2;
			_subtitleText.y = 6*stage.stageHeight/10;
			_subtitleText.embedFonts = true;
			_subtitleText.selectable = false;
			_subtitleText.defaultTextFormat = _subtitleTextFormat;
			_subtitleText.text = "";
						
			_playButton = new TextField();
			_playButtonFormat = new TextFormat("Commodore",20,0x000000,null,null,false,null,null,"center",null,null,null,null);
			_playButton.width = stage.stageWidth / 2;
			_playButton.x = stage.x + stage.stageWidth / 2;
			_playButton.y = 8*stage.stageHeight/10;
			_playButton.embedFonts = true;
			_playButton.selectable = false;
			_playButton.defaultTextFormat = _playButtonFormat;
			_playButton.text = "- CLICK TO BEGIN -";
			
			_loadingBarBGWhite = new Bitmap(new BitmapData(stage.stageWidth,40,false,0x000000));
			_loadingBarBGBlack = new Bitmap(new BitmapData(stage.stageWidth - 8,32,false,0xFFFFFF));
			_loadingBar = new Bitmap(new BitmapData(1,24,false,0x333333));
			
			_loadingBarBGWhite.x = 0;
			_loadingBarBGWhite.y = stage.stageHeight - _loadingBarBGWhite.height;
			_loadingBarBGBlack.x = _loadingBarBGWhite.x + 4;
			_loadingBarBGBlack.y = _loadingBarBGWhite.y + 4;
			_loadingBar.x = _loadingBarBGBlack.x + 4;
			_loadingBar.y = _loadingBarBGBlack.y + 4;
			
			_buffer.addChild(_titleText);
			_buffer.addChild(_subtitleText);
			
			_buffer.addChild(_loadingBarBGWhite);
			_buffer.addChild(_loadingBarBGBlack);
			_buffer.addChild(_loadingBar);			
			
		}
		
		override protected function update(Percent:Number):void {
			
			var ActualPercent:Number = root.loaderInfo.bytesLoaded / root.loaderInfo.bytesTotal;
			_loadingBar.scaleX = ActualPercent * (stage.stageWidth - 16);
		
			if (root.loaderInfo.bytesLoaded < root.loaderInfo.bytesTotal || 
				(getTimer() < _min && 
				(_currentTitleText < _titleTexts.length) ||
				!_subtitleAdded)) {
				_timer++;
				if (_timer == 20) {
					_timer = 0;
					//trace("Adding to title...");
					if (_currentTitleText < _titleTexts.length) {
						_titleText.appendText(_titleTexts[_currentTitleText]);
						_currentTitleText++;
					}
					else if (!_subtitleAdded) {
						trace("Added subtitle");
						_subtitleText.appendText("MARINA ABRAMOVIC");
						_subtitleAdded = true;
						
					}
					else {
						_timer = 0;
					}
				}
				
			}
			else {
				if (_timer == 10) {
					if (root.loaderInfo.bytesLoaded >= root.loaderInfo.bytesTotal) {
						_min = 3000;
						stage.focus = null;
					}
				}
				else {
					_timer++;
				}
			}
			
		}
		
	}
}