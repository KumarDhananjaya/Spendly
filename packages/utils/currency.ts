export const formatCurrency = (amount: number, locale = 'en-IN', currency = 'INR') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
    }).format(amount);
};
