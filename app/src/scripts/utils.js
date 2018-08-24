//this will display exactly two digits.  It will trim a three+ digit number to two digits.
export function displayTwoDigits(num){
	return ('0' + num).slice(-2);
}