package
{
	import org.flixel.FlxGame;
	
	[SWF(width = "800", height = "400", backgroundColor = "#FFFFFF")]
	[Frame(factoryClass="TAIPPreloader")]
	
	public class TheArtistIsPresent extends FlxGame
	{		
		public function TheArtistIsPresent()
		{	
			trace("TheArtistIsPresent()");
			super(200,100,TAIP,4);
		}
		
	}
}