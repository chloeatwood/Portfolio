// JavaScript for smooth scrolling navigation and project description updates

// Smooth scrolling for navigation links
document.querySelectorAll('.nav-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Function to dynamically update the project description when hovering over project images
function updateDescription(project) {
    const description = document.querySelector('.project-description');
    switch (project) {
        case 'Word Search Generator':
            description.innerHTML = "This project involved creating a Word Search Generator in C. It is used in a terminal. To run it, navigate to the folder and type: <br>make WordSearchGenerator";
            break;
        // Add cases for other projects if desired
    }
}
