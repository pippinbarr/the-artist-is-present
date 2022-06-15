package
{
	import org.flixel.*;
	
	public class Guard extends Person
	{
		public function Guard(X:Number=0, Y:Number=0, SimpleGraphic:Class=null)
		{
			super(X, Y, SimpleGraphic);
			facing = LEFT;
		}
		
		public override function update():void {
			super.update();
			this._guard = true;
		}
		
		protected override function reColourPerson():void {
			// Basic features: eyes, hair, skin
			
			_skinColor = Assets.SKIN_COLORS[Math.floor(Math.random() * Assets.SKIN_COLORS.length)];
			replaceColor(Assets.EYE_COLOR,Assets.EYE_COLORS[Math.floor(Math.random() * Assets.EYE_COLORS.length)]);
			replaceColor(Assets.MOUTH_COLOR,Assets.MOUTH_COLORS[Math.floor(Math.random() * Assets.MOUTH_COLORS.length)]);
			replaceColor(Assets.SKIN_COLOR,_skinColor);
			
			_shirtColor = 0xFF222222;
			_sleeveColor = 0xFF111111;
			
			// GENERATE THE TOP
			var topRandom:Number = Math.random();
			if (true) { 				
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
			
			_beltColor = 0xFF000000;
			
			var beltRandom:Number = Math.random();
			if (beltRandom > 0.7) {
				replaceColor(Assets.BELT_COLOR,_beltColor);
			}
			else {
				replaceColor(Assets.BELT_COLOR,_shirtColor);
			}
			
			if (_pants) {
				
				_pantColor = 0xFF111111;
				
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
			super.destroy();
		}
	}
}