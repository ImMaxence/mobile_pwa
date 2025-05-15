export const formatToFrenchDateWithHours = (isoDate) => {
    if (!isoDate) return '';

    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return ''; // Sécurité en cas de date invalide

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} - ${hours}:${minutes}`;
};
