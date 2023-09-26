
const button = document.getElementById('open-close-filters');
button?.addEventListener('click', function handleClick(event) {
    const filterButton = document.getElementById("filters") as HTMLDivElement | null;
    if (filterButton.style.display === "none") {
        filterButton.style.display = "block";
    } else {
        filterButton.style.display = "none";
    }
});
