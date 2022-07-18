export const formatCurrency = (number, digits) => {
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
		maximumFractionDigits: digits, 
    });
    return formatter.format(number);
}