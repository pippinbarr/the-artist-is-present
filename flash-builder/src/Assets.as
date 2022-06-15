package
{
	public class Assets
	{
		
		[Embed(source="assets/Commodore Pixelized v1.2.ttf", fontName="Commodore", fontWeight="Regular", embedAsCFF="false")]
		public static const COMMODORE_FONT:Class;
		
		[Embed(source="assets/Backgrounds/EntryBG.png")]
		public static const ENTRY_BG:Class;
		[Embed(source="assets/Backgrounds/EntryFG.png")]
		public static const ENTRY_FG:Class;
		[Embed(source="assets/Hitmaps/EntryHM.png")]
		public static const ENTRY_HM:Class;
		
		[Embed(source="assets/Backgrounds/EntryDoors.png")]
		public static const ENTRY_DOORS:Class;
		public static const ENTRY_DOORS_OPENING_FRAMES:Array = new Array(0,1,2,3);
		public static const ENTRY_DOORS_CLOSING_FRAMES:Array = new Array(3,2,1,0);
		public static const ENTRY_DOORS_CLOSED:int = 0;
		
		[Embed(source="assets/Hitmaps/EntryDoorsHM.png")]
		public static const ENTRY_DOORS_HM:Class;

		[Embed(source="assets/Backgrounds/TicketsBG.png")]
		public static const TICKETS_BG:Class;
		[Embed(source="assets/Backgrounds/TicketsFG.png")]
		public static const TICKETS_FG:Class;
		[Embed(source="assets/Backgrounds/TicketsFGFG.png")]
		public static const TICKETS_FG_FG:Class;
		[Embed(source="assets/Hitmaps/TicketsHM.png")]
		public static const TICKETS_HM:Class;
		[Embed(source="assets/Objects/Barrier.png")]
		public static const BARRIER_OBJ:Class;
		[Embed(source="assets/Objects/BarrierHM.png")]
		public static const BARRIER_HM:Class;

		[Embed(source="assets/Backgrounds/Hallway1BG.png")]
		public static const HALL1_BG:Class;
		[Embed(source="assets/Backgrounds/Hallway1FG.png")]
		public static const HALL1_FG:Class;
		[Embed(source="assets/Backgrounds/Hallway1FGFG.png")]
		public static const HALL1_FG_FG:Class;
		[Embed(source="assets/Hitmaps/Hallway1HM.png")]
		public static const HALL1_HM:Class;
		
		[Embed(source="assets/Backgrounds/Hallway2.png")]
		public static const HALL2_BG:Class;
		[Embed(source="assets/Hitmaps/Hallway2HM.png")]
		public static const HALL2_HM:Class;
		
		[Embed(source="assets/Backgrounds/Hallway3.png")]
		public static const HALL3_BG:Class;
		[Embed(source="assets/Hitmaps/Hallway3HM.png")]
		public static const HALL3_HM:Class;
		
		[Embed(source="assets/Backgrounds/Hallway4.png")]
		public static const HALL4_BG:Class;
		[Embed(source="assets/Hitmaps/Hallway4HM.png")]
		public static const HALL4_HM:Class;
		
		[Embed(source="assets/Backgrounds/MarinaRoom.png")]
		public static const MARINA_ROOM:Class;
		[Embed(source="assets/Hitmaps/MarinaRoomHM.png")]
		public static const MARINA_ROOM_HM:Class;
		[Embed(source="assets/Hitmaps/MarinaRoomTapeHM.png")]
		public static const MARINA_ROOM_TAPE_HM:Class;
		[Embed(source="assets/Objects/TableAndChairs.png")]
		public static const TABLE_AND_CHAIRS:Class;
		[Embed(source="assets/Objects/TableAndChairsHM.png")]
		public static const TABLE_AND_CHAIRS_HM:Class;
		
		[Embed(source="assets/SpriteSheets/WalkCycleHair.png")]
		public static const PANTS_WALK_CYCLE:Class;
		[Embed(source="assets/SpriteSheets/DressWalkCycle.png")]
		public static const DRESS_WALK_CYCLE:Class;
		
		public static const SIDE_WALK_FRAMES:Array = new Array(0,1,2,3,4,5,6,7);
		public static const FRONT_WALK_FRAMES:Array = new Array(8,9,10,11,12,13);
		public static const BACK_WALK_FRAMES:Array = new Array(15,16,17,18,19,20);
		public static const SIDE_IDLE_FRAME:uint = 22;
		public static const FRONT_IDLE_FRAME:uint = 14;
		public static const BACK_IDLE_FRAME:uint = 21;
		public static const SIT_FRAME:uint = 23;
		
		[Embed(source="assets/People/SittingPerson.png")]
		public static const PANTS_SITTING:Class;
	
		
		// THE COLOURS IN THE WALK CYCLE
		public static const MAIN_HAIR_COLOR:uint = 0xFFFCEDC0;
		public static const LONGER_HAIR_COLOR:uint = 0xFF9CF3B8;
		public static const LONG_HAIR_COLOR:uint = 0xFF585031;
		public static const NECK_HAIR_COLOR:uint = 0xFFA6B8F0;
		public static const SHIRT_HAIR_COLOR:uint = 0xFFF5F17B;
		
		public static const EYE_COLOR:uint = 0xFF000000;
		public static const MOUTH_COLOR:uint = 0xFFff1e17;
		public static const SKIN_COLOR:uint = 0xFFFF5E53;
		public static const BODY_COLOR:uint = 0xFF0094E3;
		public static const T_COLOR:uint = 0xFF82EE75;
		public static const SLEEVE_COLOR:uint = 0xFF00A352;
		public static const BELT_COLOR:uint = 0xFF585858;
		public static const SHORTS_COLOR:uint = 0xFFF7E975;
		public static const PANT_COLOR:uint = 0xFF00EEAC;
		public static const SHORT_SKIRT_COLOR:uint = 0xFFff261c;
		public static const LONG_SKIRT_COLOR:uint = 0xFF143bef;
		public static const BOOT_COLOR:uint = 0xFFEFC4E8;
		public static const SHOE_COLOR:uint = 0xFF00F9FA;
		
		public static const EYE_COLORS:Array = new Array(0xff637c62,0xff4e8b9a,0xff403226,0xff0e779e);
		public static const MOUTH_COLORS:Array = new Array(0xffc96c69,0xffc96c69);
		public static const HAIR_COLORS:Array = new Array(0xFF000000,0xff583b3b,0xff9d9b67,0xff9d9c9c,0xff757060,0xff5e4b11,0xff5b1515);
		public static const SKIN_COLORS:Array = new Array(0xffc69a55,0xffd2a7b6,0xffd2a9cb,0xff65331f,0xff7e5f36);
		public static const SHIRT_COLORS:Array = new Array(0xff232323,0xff292929,0xff361a1a,0xff14223e,0xff000000);
		public static const BELT_COLORS:Array = new Array(0xFF000000,0xff4a210b);
		public static const PANT_COLORS:Array = new Array(0xff444342,0xff401c09,0xff385473,0xff628790,0xff434a3b);
		public static const DRESS_COLORS:Array = new Array(0xFFFF0000);
		public static const SHOE_COLORS:Array = new Array(0xFF000000,0xff4b370c,0xff474237);
		
		[Embed(source="assets/People/SittingMarina.png")]
		public static const MARINA_SITTING:Class;
		public static const MARINA_DOWN_FRAMES:Array = new Array(0,1,2,3);
		public static const MARINA_UP_FRAMES:Array = new Array(3,2,1,0);
		public static const MARINA_DOWN:uint = 3;
		public static const MARINA_UP:uint = 0;
		
		[Embed(source="assets/People/MarinaHiResAnim.png")]
		public static const MARINA_HI_RES:Class;
		public static const MARINA_BLINK_FRAMES:Array = new Array(0,1,2,1,0);
		public static const MARINA_EYES_OPEN:uint = 0;
		public static const MARINA_EYES_CLOSED:uint = 2;
		
		public function Assets()
		{
		}
	}
}