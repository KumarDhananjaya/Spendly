import dayjs from 'dayjs';

export const formatDate = (date: number | Date, format = 'YYYY-MM-DD') => {
    return dayjs(date).format(format);
};

export const getMonthYear = (date: number | Date) => {
    return dayjs(date).format('YYYY-MM');
};
