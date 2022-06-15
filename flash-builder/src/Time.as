package
{
	public class Time
	{
		
		private static const _ticketTimes:Array = new Array(20,20,22,24,23,22,21,24,20,18); // In seconds 
		private static const _sitTimes:Array = new Array(
			2,2,4,4,4,5,5,5,5,5,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8,8,
			9,9,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,10,10,
			11,11,11,11,11,11,11,11,11,11,12,12,12,12,12,
			13,13,13,13,13,13,13,13,13,14,14,14,14,14,
			15,15,15,15,15,15,15,15,15,15,15,16,16,16,16,
			17,17,17,17,17,17,18,18,18,18,18,18,19,19,19,19,19,19,19,
			20,20,20,20,20,20,20,28,30,30,30,40,50,60,60,60,70,80,90,
			100,120,240,480); // In minutes
		
		public function Time()
			
		{
		}
		
		public static function getTicketTime():uint {
			var index:uint =  Math.floor(Math.random() * _ticketTimes.length);
			return _ticketTimes[index];
		}
		
		public static function getSitTime():uint {
			//return 5;
			var index:uint =  Math.floor(Math.random() * _sitTimes.length);
			return 60 * _sitTimes[index]; // Convert to minutes
		}
		
		public static function getInitQueueLength():uint {
						
			if (!museumIsOpen()) {
				return 0;
			}
			var d:Date = new Date;
			d = timeZoneShift(d);
			if (d.getUTCHours() == 10 && d.getUTCMinutes() <= 45) {
				// Within the first 8 minutes of opening
				// There are people already there relative to the number of minutes after 30
				// e.g. there are 26 people 8 minutes after opening
				return (d.getUTCMinutes() - 30) * 1 + 2; // Absolute minimum of two people
			}
			else if (d.getUTCHours() < 17 || (d.getUTCHours() == 18 && d.getUTCMinutes() < 15)) {
				return Math.floor(Math.random() * 10) + 20; // The rest of the time there are 20-30 people waiting
			}
			return 10; // Otherwise it's 15 minutes to closing and there are ten people left
		}
		
		public static function getLight():Number {
			var d:Date = new Date;
			d = timeZoneShift(d);
			
			if (d.getUTCHours() > 7 && d.getUTCHours() < 17) {
				// Daylight
				return 0;
			}
			if (d.getUTCHours() <= 4 || d.getUTCHours() >= 23) {
				return 0.8;
			}
			else if (d.getUTCHours() <= 7) {
				// Midnight to 7am
				return ((8 - d.getUTCHours()) * 0.2);
			}
			else if (d.getUTCHours() >= 17) {
				return ((d.getUTCHours() + 2 - 17) * 0.1);
				// 7pm to 11pm
			}
			else return 0;
		}
		
		// Called once every 6 seconds by the main program
		public static function newQueuer():Boolean {
			
//			if (Math.random() > 0.5) return true;
//			else return false;
			
			if (!museumIsOpen()) {
				return false;
			}
			if (People.length > 40) {
				return false;
			}
			
			var d:Date = new Date;
			d = timeZoneShift(d);
			
			if (d.getUTCHours() == 10 && d.getUTCMinutes() < 45) {
				// The fifteen minutes after opening, so we'll add the most people the fastest here
				if (Math.random() < 0.25) {
					// One person per 24 seconds on average
					return true;
				}
			}
			else if (d.getUTCHours() < 17 || (d.getUTCHours() == 18 && d.getUTCMinutes() < 15)) {
				// The rest of the day, so we'll just add people sporadically - basically just "replacement level"
				if (Math.random() < 0.005) {
					// One person per twenty minutes on average (1 in 200 times, called each 6 seconds);
					return true;
				}
			}
				
			return false;
		}
		
		public static function getTime():String {
			var d:Date = new Date;
			d = timeZoneShift(d);
			var hours:uint = d.getUTCHours();
			var ampm:String;
			if (hours >= 12) ampm = "pm";
			else ampm = "am";
			if (hours > 12) hours -= 12;
			if (hours == 0) hours = 12;
			var minutes:String = "";
			if (d.getUTCMinutes() < 10) minutes += "0";
			minutes += d.getUTCMinutes();
			return "" + hours + ":" + minutes + ampm;
		}
		
		public static function museumIsOpen():Boolean {
			
			//return false;
			//return true;
			
			var d:Date = new Date;
			d = timeZoneShift(d);
						
			if (d.getUTCDay() == 2) {
				// Closed on Tuesdays
				return false;
			}
			if (christmas(d) || thanksgiving(d)) {
				// Closed on those holidays
				return false;
			}
			if ((d.getUTCHours() == 10 && d.getUTCMinutes() >= 30) ||
				(d.getUTCHours() >= 11 && d.getUTCHours() < 17) ||
				(d.getUTCHours() == 17 && d.getUTCMinutes() < 30)) {
				// Opening hours are 10:30 to 17:30
				return true;
			}
			else return false;
		}
		
		public static function museumClosingInFifteenMinutes():Boolean {
			if (!museumIsOpen()) {
				return false;
			}
			var d:Date = new Date;
			d = timeZoneShift(d);
			if (d.getUTCHours() == 17 && d.getUTCMinutes() == 15) {
				return true;
			}
			else {
				return false;
			}
		}
		
		private static function christmas(d:Date):Boolean {
			return (d.getUTCDate() == 25 && 
					d.getUTCMonth() == 11);
		}
		
		private static function thanksgiving(d:Date):Boolean {
			return (d.getUTCDay() == 4 &&
				d.getUTCMonth() == 10 &&
				d.getUTCDate() >= 22 &&
				d.getUTCDate() <= 28);
		}
		
		private static function timeZoneShift(d:Date):Date {
			d.setTime(d.getTime() - (4 * 1000 * 60 * 60));
			return d;
		}
	}
}