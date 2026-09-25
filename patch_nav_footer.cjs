const fs = require('fs');

let navbar = fs.readFileSync('src/components/Navbar.tsx', 'utf8');
navbar = navbar.replace(/>Become a Partner<\/a>/, '>Technician Registration</a>');
navbar = navbar.replace(/href="#become-partner"/g, 'href="#technician-registration"');
fs.writeFileSync('src/components/Navbar.tsx', navbar);

let footer = fs.readFileSync('src/components/Footer.tsx', 'utf8');
footer = footer.replace(/>Become a Partner<\/a>/, '>Technician Registration</a>');
footer = footer.replace(/href="#become-partner"/g, 'href="#technician-registration"');
fs.writeFileSync('src/components/Footer.tsx', footer);

let app = fs.readFileSync('src/App.tsx', 'utf8');
app = app.replace(/window\.location\.hash === '#become-partner'/, "window.location.hash === '#technician-registration'");
fs.writeFileSync('src/App.tsx', app);
