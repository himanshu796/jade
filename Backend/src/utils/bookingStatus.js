const getEffectiveStatus = (booking) => {
    if (booking.status === 'CONFIRMED' && new Date(booking.checkOut) < new Date()) {
        return 'COMPLETED';
    }
    return booking.status;
};

const withEffectiveStatus = (booking) => ({
    ...booking,
    status: getEffectiveStatus(booking),
});

export {
    getEffectiveStatus,
    withEffectiveStatus
}