export function distanceGain(userX: number, userY: number, otherX: number, otherY: number, maxDistance: number) {
    const dx = userX - otherX;
    const dy = userY - otherY;
    const distanceSq = dx*dx + dy*dy;
    const gain = Math.max(0, 1 - distanceSq / (maxDistance*maxDistance));
    return gain;
}

export function lowPassFrequency(distance: number, maxDistance: number) {
    return 20000 * (1 - distance / maxDistance); // farther = more muffled
}
