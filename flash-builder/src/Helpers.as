package
{
	public class Helpers
	{
		public function Helpers()
		{
		}
		
		public static function darkenHex(hex:uint):uint {
			var a:uint = hex >> 24 & 0xFF;
			var r:uint = hex >> 16 & 0xFF; r = Math.max(0x00,(r - 20));
			var g:uint = hex >> 8 & 0xFF; g = Math.max(0x00,(g - 20));
			var b:uint = hex & 0xFF; b = Math.max(0x00,(b - 20));
			
			return ((a << 24) | (r << 16) | (g << 8) | b);
		}
	}
}